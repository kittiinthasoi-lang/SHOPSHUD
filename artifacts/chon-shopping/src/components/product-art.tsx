import {
  Armchair,
  Baby,
  BookOpen,
  Car,
  Dumbbell,
  Laptop,
  Luggage,
  PawPrint,
  Shirt,
  Sparkles,
  Sofa,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryId, Product } from '@/lib/types';

export const CATEGORY_ICON: Record<CategoryId, LucideIcon> = {
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

import { useState } from 'react';

/** Shows high-resolution product photography with responsive fallback */
export function ProductArt({ product, className = '' }: { product: Product; className?: string }) {
  const [error, setError] = useState(false);
  const Icon = CATEGORY_ICON[product.category];
  const h = product.hue;

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
      <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="160" cy="25" r="60" fill={`hsl(${h} 50% 80%)`} />
        <circle cx="20" cy="140" r="55" fill={`hsl(${(h + 30) % 360} 55% 84%)`} />
        <rect x="48" y="118" width="104" height="8" rx="4" fill={`hsl(${h} 40% 30% / 0.14)`} />
        <path d="M0 150 L200 150 L200 132 Q100 118 0 134 Z" fill={`hsl(${h} 40% 78%)`} />
      </svg>
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
