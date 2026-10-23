import {
  Armchair,
  Baby,
  BookOpen,
  Car,
  Dumbbell,
  GraduationCap,
  Image as ImageIcon,
  Laptop,
  Luggage,
  Music,
  Paintbrush,
  PawPrint,
  Shirt,
  Sparkles,
  Sofa,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryId, Product } from '@/lib/types';
import { useState } from 'react';

export const CATEGORY_ICON: Record<string, LucideIcon> = {
  music: Music,
  photo: ImageIcon,
  drawing: Paintbrush,
  exam: GraduationCap,
  ebook: BookOpen,
  electronics: Laptop,
  home: Sofa,
  beauty: Sparkles,
  sport: Dumbbell,
  fashion: Shirt,
  desk: Armchair,
  food: Utensils,
  baby: Baby,
  travel: Luggage,
  auto: Car,
  pets: PawPrint,
  books: BookOpen,
};

/** Shows high-resolution product photography with responsive fallback */
export function ProductArt({ product, className = '' }: { product: Product; className?: string }) {
  const [error, setError] = useState(false);
  const Icon = CATEGORY_ICON[product.category] || BookOpen;
  const h = product.hue || 200;

  if (product.image && !error) {
    return (
      <div className={`relative overflow-hidden bg-muted ${className}`}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={() => setError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      role="img"
      aria-label={`ภาพของ ${product.name}`}
      style={{ background: `hsl(${h} 45% 90%)` }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-md"
          style={{ background: `hsl(${h} 60% 28%)`, color: `hsl(${h} 70% 92%)` }}
        >
          <Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
