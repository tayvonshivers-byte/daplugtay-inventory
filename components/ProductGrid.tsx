"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  activeBrand: string;
}

export default function ProductGrid({
  products,
  onProductSelect,
  activeBrand,
}: ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(100);
const visibleProducts = products.slice(0, visibleCount);
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center animate-fade-in">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800">
          <svg className="h-7 w-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-zinc-300">No items found</p>
        <p className="mt-1 text-sm text-zinc-500">Try a different brand or search term</p>
      </div>
    );
  }

  return (
    <section className="px-4 py-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
            {activeBrand}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {visibleProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onSelect={onProductSelect}
          />
        ))}
      </div>
      {visibleCount < products.length && (
  <div className="mt-8 flex justify-center">
    <button
      onClick={() => setVisibleCount((count) => count + 100)}
      className="rounded-full bg-white px-8 py-3 font-bold text-black"
    >
      Load More
    </button>
  </div>
)}
    </section>
  );
}

function ProductCard({
  product,
  index,
  onSelect,
}: {
  product: Product;
  index: number;
  onSelect: (product: Product) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group animate-fade-up text-left"
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms`, opacity: 0 }}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 transition-all duration-300 group-hover:border-zinc-600 group-hover:shadow-lg group-hover:shadow-white/5 group-active:scale-[0.98]">
        <img
        decoding="async"
          src={product.image}
          alt={`${product.brand} item`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 translate-y-1 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/80">
            View
          </span>
        </div>
      </div>
      <p className="mt-2.5 truncate text-xs font-medium uppercase tracking-wider text-zinc-400 transition-colors group-hover:text-white">
        {product.brand}
      </p>
    </button>
  );
}
