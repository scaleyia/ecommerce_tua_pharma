import type { Banner, Category, Reward, Product } from "./types";
import { bsProducts } from "./catalog.generated";

// Estratégia de preço (fase inicial): vendemos 10% abaixo da referência da
// BS Pharma. Preencha `refPrice` no produto que o `price` sai automático daqui.
export const REF_DISCOUNT = 0.1;

export const priceFromRef = (refPrice: number): number =>
  Math.round(refPrice * (1 - REF_DISCOUNT) * 100) / 100;

export const categories: Category[] = [
  {
    slug: "cabelo",
    name: "Cabelo",
    tagline: "Crescimento e força dos fios",
    icon: "Droplets",
    gradient: ["#245A42", "#12261C"],
    accent: "#1E7BA8",
  },
  {
    slug: "beleza",
    name: "Beleza & Colágeno",
    tagline: "Colágeno para pele e articulações",
    icon: "Sparkles",
    gradient: ["#2E6B4F", "#163B2C"],
    accent: "#C24B86",
  },
  {
    slug: "saude",
    name: "Saúde & Bem-estar",
    tagline: "Equilíbrio e vitalidade no dia a dia",
    icon: "HeartPulse",
    gradient: ["#1B4332", "#0C1E16"],
    accent: "#2F8F5B",
  },
  {
    slug: "fitness",
    name: "Fitness & Performance",
    tagline: "Energia e força muscular",
    icon: "Dumbbell",
    gradient: ["#245A42", "#0C1E16"],
    accent: "#CF3B2E",
  },
  {
    slug: "longevidade",
    name: "Longevidade",
    tagline: "Renovação celular e vitalidade",
    icon: "Leaf",
    gradient: ["#3E8B68", "#1B4332"],
    accent: "#E38A16",
  },
  {
    slug: "veterinaria",
    name: "Veterinária",
    tagline: "Manipulados sob medida para o seu pet",
    icon: "PawPrint",
    gradient: ["#1B4332", "#0C1E16"],
    accent: "#3E8B68",
  },
];

// Rótulo padronizado (padrão BS Pharma): sempre nome + TUA PHARMA +
// quantidade de cápsulas + dosagem. Monta a linha "60 cápsulas · 500 mg"
// a partir dos campos estruturados; cai no badge legado se ainda não houver.
export const productSpec = (product: {
  count?: string;
  dosage?: string;
  badges?: string[];
}): string | undefined => {
  const parts = [product.count, product.dosage].filter(Boolean);
  if (parts.length) return parts.join(" · ");
  return product.badges?.[1];
};



// Deriva o preço final: onde houver `refPrice` (referência BS Pharma),
// o `price` é recalculado a −10% automaticamente (produto e tamanhos).
export const products: Product[] = bsProducts.map((p) => ({
  ...p,
  price: p.refPrice != null ? priceFromRef(p.refPrice) : p.price,
  sizes: p.sizes?.map((s) => ({
    ...s,
    price: s.refPrice != null ? priceFromRef(s.refPrice) : s.price,
  })),
}));

export const banners: Banner[] = [
  {
    id: "b1",
    eyebrow: "Farmácia de Manipulação",
    title: "Fórmulas sob medida, feitas para o seu corpo",
    subtitle:
      "Manipulados com precisão farmacêutica, ingredientes de alta pureza e o cuidado que você merece.",
    ctaLabel: "Explorar produtos",
    ctaHref: "/produtos",
    align: "left",
    gradient: ["#12261C", "#1B4332"],
    icon: "FlaskConical",
  },
  {
    id: "b2",
    eyebrow: "Clube Tua",
    title: "Até 20% OFF e frete grátis todo mês",
    subtitle:
      "Entre para o Clube de Vantagens Tua Pharma e receba benefícios exclusivos, cashback e brindes.",
    ctaLabel: "Conhecer o Clube",
    ctaHref: "/clube",
    align: "left",
    gradient: ["#1B4332", "#0C1E16"],
    icon: "Crown",
  },
  {
    id: "b3",
    eyebrow: "Praticidade",
    title: "Envie sua receita e manipule com segurança",
    subtitle:
      "Nossos farmacêuticos analisam sua receita e preparam sua fórmula com todo o rigor técnico.",
    ctaLabel: "Enviar receita",
    ctaHref: "/receita",
    align: "left",
    gradient: ["#163B2C", "#245A42"],
    icon: "FileText",
  },
];

// Regras do Clube de Vantagens Tua (programa de pontos gratuito)
export const POINTS_PER_REAL = 1; // 1 ponto a cada R$ 1 gasto
export const MIN_REDEEM = 200; // pontos mínimos para trocar por prêmios

export const clubRewards: Reward[] = [
  {
    id: "r1",
    name: "Cupom R$ 15 OFF",
    description: "Desconto de R$ 15 na sua próxima compra.",
    points: 200,
    icon: "Ticket",
  },
  {
    id: "r2",
    name: "Frete grátis",
    description: "Frete grátis garantido no próximo pedido.",
    points: 300,
    icon: "Truck",
  },
  {
    id: "r3",
    name: "Brinde surpresa Tua",
    description: "Um mimo exclusivo da Tua Pharma para você.",
    points: 450,
    icon: "Gift",
  },
  {
    id: "r4",
    name: "Cupom R$ 40 OFF",
    description: "Desconto de R$ 40 em compras acima de R$ 150.",
    points: 600,
    icon: "Ticket",
  },
  {
    id: "r5",
    name: "Vitamina C Lipossomal grátis",
    description: "Resgate um frasco por nossa conta.",
    points: 1000,
    icon: "Pill",
  },
  {
    id: "r6",
    name: "Kit Skincare Manipulado",
    description: "Sérum + creme facial manipulados exclusivos.",
    points: 1500,
    icon: "Sparkles",
  },
  {
    id: "r7",
    name: "R$ 100 em créditos",
    description: "Cem reais de crédito para usar como quiser.",
    points: 2000,
    icon: "Coins",
  },
];

// Preço unitário considerando o tamanho escolhido (ex.: loção)
export const unitPrice = (product: Product, size?: string): number => {
  if (size && product.sizes) {
    const found = product.sizes.find((s) => s.label === size);
    if (found) return found.price;
  }
  return product.price;
};

export const productBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const categoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);

export const productsByCategory = (slug: string): Product[] =>
  products.filter((p) => p.category === slug);

export const specialOffers = (): Product[] => products.filter((p) => p.special);

export const bestsellers = (): Product[] => products.filter((p) => p.bestseller);
