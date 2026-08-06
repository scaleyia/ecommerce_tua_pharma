export type Category = {
  slug: string;
  name: string;
  tagline: string;
  icon: string; // lucide-react icon name
  gradient: [string, string];
  accent: string; // cor do rótulo do produto
};

// Tipo de embalagem — define a ilustração (SVG) mostrada para o produto
export type Packaging =
  | "pote-capsula" // pote de cápsulas/comprimidos (padrão dos manipulados)
  | "pote-po" // pote largo de pó (creatina, whey, colágeno em pó)
  | "pote-creme" // pote baixo e largo de creme/sérum
  | "bisnaga" // bisnaga/tubo (pomada, gel)
  | "gotas" // frasco conta-gotas (sublingual, gotas)
  | "frasco" // frasco líquido (xampu, solução, xarope, tônico)
  | "spray" // frasco spray âmbar (minoxidil, loção capilar)
  | "caixa"; // caixa/estojo (sachês)

export type ProductSize = {
  label: string; // ex.: "100 mL"
  refPrice?: number; // preço de referência (BS Pharma) — interno, não exibido
  price: number; // preço final; se refPrice existir, é derivado (−10%)
};

export type Product = {
  id: string;
  variantId?: string; // id da variante na Medusa (p/ carrinho/checkout)
  slug: string;
  name: string;
  category: string; // category slug
  refPrice?: number; // preço de referência (BS Pharma) — interno, não exibido
  price: number; // preço final; se refPrice existir, é derivado (refPrice −10%)
  oldPrice?: number; // apenas promoções reais (preço riscado)
  rating: number;
  reviews: number;
  shortDescription: string;
  description: string;
  benefits: string[];
  badges: string[];
  packaging: Packaging;
  image?: string; // foto real do produto (royalty-free); fallback p/ ilustração SVG
  imageLabel?: string; // nome curto exibido na embalagem
  sizes?: ProductSize[]; // opções de tamanho (ex.: loção)
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
  variantId?: string; // variante na Medusa (p/ checkout)
  name: string;
  slug: string;
  price: number; // preço unitário no momento em que foi adicionado
  category: string;
  packaging: Packaging;
  image?: string;
  imageLabel?: string;
  quantity: number;
  size?: string; // rótulo do tamanho escolhido (ex.: "100 mL")
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
