"use client";

import { useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import LandingScreen from "@/components/LandingScreen";
import PriceListModal from "@/components/PriceListModal";
import { ALL_BRANDS } from "@/lib/constants";
import type { Product } from "@/lib/types";

interface InventoryAppProps {
  products: Product[];
}

export default function InventoryApp({ products }: InventoryAppProps) {
  const [entered, setEntered] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(ALL_BRANDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priceListOpen, setPriceListOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const brands = useMemo(
    () => [
      ALL_BRANDS,
      ...Array.from(new Set(products.map((product) => product.brand))).sort(),
    ],
    [products]
  );

  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const product of products) {
      counts[product.brand] = (counts[product.brand] ?? 0) + 1;
    }

    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesBrand =
        selectedBrand === ALL_BRANDS || product.brand === selectedBrand;

      const matchesSearch =
        !query ||
        product.brand.toLowerCase().includes(query) ||
        product.title.toLowerCase().includes(query);

      return matchesBrand && matchesSearch;
    });
  }, [products, selectedBrand, searchQuery]);

  const playMusic = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setIsMusicPlaying(true);
    } catch (error) {
      console.error("Music could not start:", error);
      setIsMusicPlaying(false);
    }
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      await playMusic();
    } else {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
  };

  const enterSite = async () => {
    await playMusic();
    setEntered(true);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/hit-em-up.mp3"
        loop
        preload="auto"
        onPlay={() => setIsMusicPlaying(true)}
        onPause={() => setIsMusicPlaying(false)}
      />

      {!entered ? (
        <LandingScreen onEnter={enterSite} />
      ) : (
        <div className="min-h-screen bg-black text-white">
          <Sidebar
            brands={brands}
            selectedBrand={selectedBrand}
            onBrandSelect={setSelectedBrand}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            productCounts={productCounts}
          />

          <div className="lg:pl-[var(--sidebar-width)]">
            <Header
              onMenuToggle={() => setSidebarOpen(true)}
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              itemCount={filteredProducts.length}
            />

            <main>
              <ProductGrid
                products={filteredProducts}
                onProductSelect={setSelectedProduct}
                activeBrand={selectedBrand}
              />
            </main>
          </div>

          <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setPriceListOpen(true)}
              className="rounded-full border border-zinc-700 bg-black/90 px-5 py-3 text-sm font-bold text-white shadow-xl backdrop-blur-md transition hover:border-white"
            >
              Price List
            </button>

            <button
              type="button"
              onClick={toggleMusic}
              className="rounded-full bg-white px-5 py-3 text-sm font-bold text-black shadow-xl transition hover:bg-zinc-200"
            >
              {isMusicPlaying ? "Pause Music" : "Play Music"}
            </button>
          </div>

          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />

          <PriceListModal
            isOpen={priceListOpen}
            onClose={() => setPriceListOpen(false)}
          />
        </div>
      )}
    </>
  );
}