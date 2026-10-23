import { Router, type IRouter } from "express";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { pool } from "@workspace/db";

const router: IRouter = Router();

function requireOwner(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) {
  const expected = process.env.SHOPSHUD_ADMIN_TOKEN;
  if (!expected) {
    res.status(503).json({ error: "Owner management is not configured. Set SHOPSHUD_ADMIN_TOKEN on the server." });
    return;
  }
  const auth = req.header("authorization") ?? "";
  const supplied = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !a.length || !timingSafeEqual(a, b)) {
    res.status(401).json({ error: "Owner authentication required." });
    return;
  }
  next();
}

const safeProduct = (row: Record<string, unknown>) => ({
  id: row.id, title: row.title, description: row.description, category: row.category,
  priceMinor: row.price_minor, currency: row.currency, rightsModel: row.rights_model,
  rightsTerms: row.rights_terms, previewUrl: row.preview_url, assetObjectKey: row.asset_object_key,
  assetVerified: row.asset_verified, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at,
});

const publicProduct = (row: Record<string, unknown>) => ({
  id: row.id, title: row.title, description: row.description, category: row.category,
  priceMinor: row.price_minor, currency: row.currency, rightsModel: row.rights_model,
  rightsTerms: row.rights_terms, previewUrl: row.preview_url, status: row.status,
});

router.get("/catalog", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id,title,description,category,price_minor,currency,rights_model,rights_terms,preview_url,asset_object_key,asset_verified,status,created_at,updated_at FROM shopshud_products WHERE status = 'published' ORDER BY published_at DESC, created_at DESC"
    );
    res.json({ products: rows.map(publicProduct) });
  } catch (error) { next(error); }
});

router.get("/owner/catalog", requireOwner, async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id,title,description,category,price_minor,currency,rights_model,rights_terms,preview_url,asset_object_key,asset_verified,status,created_at,updated_at FROM shopshud_products ORDER BY updated_at DESC"
    );
    res.json({ products: rows.map(safeProduct) });
  } catch (error) { next(error); }
});

router.post("/owner/catalog", requireOwner, async (req, res, next) => {
  try {
    const { title, description, category, priceMinor, rightsModel, rightsTerms, previewUrl, assetObjectKey, assetVerified = false, status = "draft" } = req.body ?? {};
    if (typeof title !== "string" || !title.trim() || title.length > 180 ||
        typeof description !== "string" || !description.trim() ||
        typeof category !== "string" || !category.trim() ||
        !Number.isSafeInteger(priceMinor) || priceMinor < 0 ||
        !["file_sale", "usage_license", "copyright_transfer"].includes(rightsModel) ||
        typeof rightsTerms !== "string" || !rightsTerms.trim() ||
        !["draft", "published", "paused"].includes(status)) {
      res.status(400).json({ error: "Required fields are missing or invalid. Provide title, description, category, priceMinor, rightsModel and rightsTerms." });
      return;
    }
    if (status === "published") {
      res.status(503).json({ error: "Publication is disabled until private asset storage, server-side file verification, and rights-document handling are implemented. Save this product as a draft for now." });
      return;
    }
    const id = randomUUID();
    const { rows } = await pool.query(
      `INSERT INTO shopshud_products (id,title,description,category,price_minor,currency,rights_model,rights_terms,preview_url,asset_object_key,asset_verified,status,published_at)
       VALUES ($1,$2,$3,$4,$5,'THB',$6,$7,$8,$9,$10,$11,CASE WHEN $11='published' THEN now() ELSE NULL END)
       RETURNING id,title,description,category,price_minor,currency,rights_model,rights_terms,preview_url,asset_object_key,asset_verified,status,created_at,updated_at`,
      [id,title.trim(),description.trim(),category.trim(),priceMinor,rightsModel,rightsTerms.trim(),typeof previewUrl === "string" ? previewUrl : null,typeof assetObjectKey === "string" ? assetObjectKey : null,assetVerified === true,status]
    );
    res.status(201).json({ product: safeProduct(rows[0]) });
  } catch (error) { next(error); }
});

router.patch("/owner/catalog/:id", requireOwner, async (req, res, next) => {
  try {
    const allowed = ["title","description","category","priceMinor","rightsModel","rightsTerms","previewUrl","assetObjectKey","assetVerified","status"] as const;
    const body = req.body ?? {};
    if (!Object.keys(body).length || Object.keys(body).some((key) => !(allowed as readonly string[]).includes(key))) {
      res.status(400).json({ error: "Only catalog fields may be updated." });
      return;
    }
    const current = await pool.query("SELECT * FROM shopshud_products WHERE id=$1", [req.params.id]);
    if (!current.rowCount) { res.status(404).json({ error: "Product not found." }); return; }
    const old = current.rows[0];
    const values = {
      title: body.title ?? old.title, description: body.description ?? old.description,
      category: body.category ?? old.category, priceMinor: body.priceMinor ?? old.price_minor,
      rightsModel: body.rightsModel ?? old.rights_model, rightsTerms: body.rightsTerms ?? old.rights_terms,
      previewUrl: body.previewUrl ?? old.preview_url, assetObjectKey: body.assetObjectKey ?? old.asset_object_key,
      assetVerified: body.assetVerified ?? old.asset_verified, status: body.status ?? old.status,
    };
    if (typeof values.title !== "string" || !values.title.trim() || values.title.length > 180 ||
        typeof values.description !== "string" || !values.description.trim() ||
        typeof values.category !== "string" || !values.category.trim() ||
        !Number.isSafeInteger(values.priceMinor) || values.priceMinor < 0 ||
        !["file_sale","usage_license","copyright_transfer"].includes(values.rightsModel) ||
        typeof values.rightsTerms !== "string" || !values.rightsTerms.trim() ||
        !["draft","published","paused"].includes(values.status)) {
      res.status(400).json({ error: "Product fields are invalid." }); return;
    }
    if (values.status === "published") {
      res.status(503).json({ error: "Publication is disabled until private asset storage, server-side file verification, and rights-document handling are implemented." }); return;
    }
    const { rows } = await pool.query(
      `UPDATE shopshud_products SET title=$2,description=$3,category=$4,price_minor=$5,rights_model=$6,rights_terms=$7,preview_url=$8,asset_object_key=$9,asset_verified=$10,status=$11,published_at=CASE WHEN $11='published' THEN COALESCE(published_at,now()) ELSE NULL END,updated_at=now()
       WHERE id=$1 RETURNING id,title,description,category,price_minor,currency,rights_model,rights_terms,preview_url,asset_object_key,asset_verified,status,created_at,updated_at`,
      [req.params.id,values.title.trim(),values.description.trim(),values.category.trim(),values.priceMinor,values.rightsModel,values.rightsTerms.trim(),values.previewUrl,values.assetObjectKey,values.assetVerified,values.status]
    );
    res.json({ product: safeProduct(rows[0]) });
  } catch (error) { next(error); }
});

router.delete("/owner/catalog/:id", requireOwner, async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM shopshud_products WHERE id=$1 AND status <> 'published' RETURNING id", [req.params.id]);
    if (!result.rowCount) { res.status(409).json({ error: "Product not found or published. Pause it before removal; published records are not hard-deleted." }); return; }
    res.status(204).end();
  } catch (error) { next(error); }
});

export default router;
