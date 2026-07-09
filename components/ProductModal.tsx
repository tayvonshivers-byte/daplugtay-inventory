"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { INSTAGRAM_DM } from "@/lib/constants";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [imageIndex, setImageIndex] = useState(0);

  const gallery = product?.images?.length
    ? product.images
    : product
    ? [product.image]
    : [];

  const currentImage = gallery[imageIndex] || "";

  useEffect(() => {
    setImageIndex(0);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  const previousImage = () => {
    setImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md">
      <header className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {product.brand}
          </p>
          {product.sku && <p className="mt-1 text-xs text-zinc-600">{product.sku}</p>}
        </div>

        <button onClick={onClose} className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-white">
          Close
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <img
          src={`/api/image?url=${encodeURIComponent(currentImage)}`}
          alt={`${product.brand} item`}
          className="max-h-[65vh] w-full max-w-2xl object-contain"
        />

        {gallery.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-4">
            <button onClick={previousImage} className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-white">
              Previous
            </button>

            <span className="text-sm text-zinc-400">
              {imageIndex + 1} / {gallery.length}
            </span>

            <button onClick={nextImage} className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-white">
              Next
            </button>
          </div>
        )}
      </div>

      <footer className="border-t border-zinc-800 px-4 py-5">
        <a href={INSTAGRAM_DM} target="_blank" rel="noopener noreferrer" className="block w-full rounded-full bg-white py-4 text-center font-bold text-black">
          DM @daplugtay
        </a>
      </footer>
    </div>
  );
}