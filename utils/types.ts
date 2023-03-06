export interface Money {
  amount: number;
  currencyCode: string;
}

export interface Image {
  url: string;
  width: number;
  height: number;
  altText: string;
}

export interface List<T> {
  nodes: T[];
}

export interface ProductPriceRange {
  minVariantPrice: Money;
  maxVariantPrice: Money;
}
// ['id', 'createdAt', 'name', 'metadata', 'currentOwner', 'issuer']
export interface Item {
  id: string;
  createdAt: Date;
  name: string;
  metadata: string;
  currentOwner: string;
  image?: string;
  issuer: string;
}

export interface Metadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  animation_url?: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  featuredImage: Image | null;
  images?: List<Image>;
  variants: List<ProductVariant>;
  priceRange: ProductPriceRange;
}

export interface ProductVariant {
  id: string;
  priceV2: Money;
  title: string;
  availableForSale: boolean;
}
