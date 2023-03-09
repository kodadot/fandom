export interface Item {
  id: string;
  createdAt: Date;
  name: string;
  metadata: string;
  currentOwner: string;
  image?: string;
  meta?: Metadata;
  price: bigint;
  issuer: string;
}

export interface Metadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  animation_url?: string;
}