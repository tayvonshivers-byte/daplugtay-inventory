import products from "@/public/data/products.json";
import InventoryApp from "@/components/InventoryApp";
import type { Product } from "@/lib/types";

export default function Home() {
  return <InventoryApp products={products as Product[]} />;
}