export interface Product {
  id: number;
  sku?: string;
  brand: string;
  title: string;
  image: string;
  images?: string[];
  source: string;
  price?: string;
}