export type Category = {
  slug: string;
  name: string;
  tagline: string;
  icon: string; // lucide-react icon name
  gradient: [string, string];
  accent: string; // cor do rótulo do produto
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string; // category slug
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  shortDescription: string;
  description: string;
  benefits: string[];
  badges: string[];
  bestseller?: boolean;
  special?: boolean;
};

export type Banner = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  align: "left" | "center";
  gradient: [string, string];
  icon: string;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: string; // lucide-react icon name
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type User = {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  birthdate?: string;
  cep?: string;
  address?: string;
  points: number;
};
