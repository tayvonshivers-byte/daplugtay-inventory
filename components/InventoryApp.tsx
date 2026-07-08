"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import LandingScreen from "@/components/LandingScreen";
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

  const brands = useMemo(
    () => [ALL_BRANDS, ...Array.from(new Set(products.map((p) => p.brand))).sort()],
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

  if (!entered) {
    return <LandingScreen onEnter={() => setEntered(true)} />;
  }

  return (
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

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
