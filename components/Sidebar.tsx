"use client";

import { useEffect, useRef } from "react";
import { ALL_BRANDS } from "@/lib/constants";

interface SidebarProps {
  brands: string[];
  selectedBrand: string;
  onBrandSelect: (brand: string) => void;
  isOpen: boolean;
  onClose: () => void;
  productCounts: Record<string, number>;
}

export default function Sidebar({
  brands,
  selectedBrand,
  onBrandSelect,
  isOpen,
  onClose,
  productCounts,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleBrandClick = (brand: string) => {
    onBrandSelect(brand);
    onClose();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-5 lg:border-b-0 lg:px-6 lg:pt-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500">
            Filter
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight">Brands</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 lg:px-4" aria-label="Brand filter">
        <ul className="space-y-1">
          {brands.map((brand) => {
            const isActive = selectedBrand === brand;
            const count =
              brand === ALL_BRANDS
                ? Object.values(productCounts).reduce((a, b) => a + b, 0)
                : productCounts[brand] ?? 0;

            return (
              <li key={brand}>
                <button
                  type="button"
                  onClick={() => handleBrandClick(brand)}
                  className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-white font-semibold text-black"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <span className="truncate">{brand}</span>
                  <span
                    className={`ml-2 shrink-0 text-xs tabular-nums ${
                      isActive ? "text-zinc-500" : "text-zinc-600 group-hover:text-zinc-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden border-t border-zinc-800 p-6 lg:block">
        <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          Premium Inventory
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Screenshot · DM · Order
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[var(--sidebar-width)] border-r border-zinc-800 bg-black lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile slide-out */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            aria-label="Close menu overlay"
          />
          <aside
            ref={sidebarRef}
            className="absolute inset-y-0 left-0 w-[min(85vw,320px)] border-r border-zinc-800 bg-black shadow-2xl animate-slide-in-left"
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
