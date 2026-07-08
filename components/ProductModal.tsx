"use client";

import { useEffect, useCallback } from "react";
import type { Product } from "@/lib/types";
import { INSTAGRAM_DM } from "@/lib/constants";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!product) return;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [product, handleKeyDown]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.brand} product`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500">
              {product.brand}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all duration-200 hover:border-white hover:text-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex flex-1 items-center justify-center overflow-hidden px-4 pb-4 sm:px-8">
          <img
            src={product.image}
            alt={`${product.brand} item`}
            className="max-h-[calc(100vh-200px)] w-full max-w-2xl animate-scale-in object-contain"
          />
        </div>

        <footer className="shrink-0 border-t border-zinc-800/50 bg-black/50 px-4 py-5 backdrop-blur-xl sm:px-6 sm:py-6">
          <a
            href={INSTAGRAM_DM}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-base font-bold text-black transition-all duration-200 hover:bg-zinc-200 active:scale-[0.98] sm:py-5 sm:text-lg"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Order on Instagram
          </a>
          <p className="mt-3 text-center text-xs text-zinc-600">
            Screenshot this item and send it in your DM
          </p>
        </footer>
      </div>
    </div>
  );
}
