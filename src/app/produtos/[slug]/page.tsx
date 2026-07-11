import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Truck, ShieldCheck, RefreshCw, FlaskConical } from "lucide-react";
import {
  productBySlug,
  categoryBySlug,
  productsByCategory,
  products,
} from "@/lib/data";
import { brl, installment, discountPercent } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";
import { StarRating } from "@/components/StarRating";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ProductRow } from "@/components/ProductRow";
import { SectionHeading } from "@/components/SectionHeading";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productBySlug(slug);
  return { title: product ? `${product.name} — Tua Pharma` : "Produto — Tua Pharma" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  const category = categoryBySlug(product.category);
  const off = discountPercent(product.price, product.oldPrice);
  const related = productsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .concat(products.filter((p) => p.bestseller && p.category !== product.category))
    .slice(0, 8);

  return (
    <div className="container-tua py-8">
      {/* breadcrumb */}
      <nav className="mb-6 text-xs text-ink/50">
        <Link href="/" className="hover:text-green-700">Início</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/produtos?categoria=${product.category}`} className="hover:text-green-700">
          {category?.name}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-green-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* imagem */}
        <div>
          <ProductImage
            categorySlug={product.category}
            name={product.name}
            variant="detail"
            className="aspect-square rounded-3xl"
          />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <ProductImage
                key={i}
                categorySlug={product.category}
                className="aspect-square rounded-xl opacity-70"
                iconSize={40}
              />
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {product.badges.map((b) => (
              <span
                key={b}
                className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-green-700"
              >
                {b}
              </span>
            ))}
          </div>

          <h1 className="font-display text-3xl font-light leading-tight text-green-900 md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3">
            <StarRating value={product.rating} reviews={product.reviews} />
          </div>

          <p className="mt-4 text-ink/70">{product.shortDescription}</p>

          {/* preço */}
          <div className="mt-6 rounded-2xl bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              {product.oldPrice && (
                <span className="text-ink/40 line-through">{brl(product.oldPrice)}</span>
              )}
              {off > 0 && (
                <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-green-900">
                  -{off}% OFF
                </span>
              )}
            </div>
            <p className="font-display text-4xl font-light text-green-900">
              {brl(product.price)}
            </p>
            <p className="text-sm text-ink/55">
              ou {installment(product.price)} · <span className="text-green-600">5% OFF no Pix</span>
            </p>

            <div className="mt-5">
              <ProductPurchase productId={product.id} />
            </div>
          </div>

          {/* garantias */}
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[
              { icon: Truck, t: "Frete grátis*" },
              { icon: ShieldCheck, t: "Compra segura" },
              { icon: RefreshCw, t: "Troca fácil" },
              { icon: FlaskConical, t: "Manipulado" },
            ].map((g) => (
              <div key={g.t} className="flex flex-col items-center gap-1.5 rounded-xl bg-cream p-3 text-center">
                <g.icon size={20} className="text-green-700" />
                <span className="text-xs text-ink/70">{g.t}</span>
              </div>
            ))}
          </div>

          {/* benefícios */}
          <div className="mt-6">
            <h3 className="font-display text-lg text-green-900">Principais benefícios</h3>
            <ul className="mt-3 space-y-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-ink/75">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-700/10 text-green-700">
                    <Check size={12} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* descrição */}
      <div className="mt-12 rounded-3xl border border-green-900/5 bg-white p-8 shadow-card">
        <h2 className="font-display text-2xl font-light text-green-900">Descrição do produto</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink/70">{product.description}</p>
        <p className="mt-4 text-xs text-ink/45">
          * Este produto é manipulado sob demanda. Alguns itens podem exigir prescrição
          médica. Consulte sempre um profissional de saúde. Site com caráter demonstrativo.
        </p>
      </div>

      {/* relacionados */}
      {related.length > 0 && (
        <section className="mt-14">
          <SectionHeading eyebrow="Você também pode gostar" title="Produtos relacionados" />
          <ProductRow products={related} />
        </section>
      )}
    </div>
  );
}
