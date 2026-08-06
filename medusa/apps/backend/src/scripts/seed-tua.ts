import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { readFileSync } from "fs";
import path from "path";

export default async function seedTua({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // Entidades já criadas pelo seed inicial
  const { data: channels } = await query.graph({ entity: "sales_channel", fields: ["id"] });
  const salesChannel = channels[0];
  const { data: profiles } = await query.graph({ entity: "shipping_profile", fields: ["id"] });
  const shippingProfile = profiles[0];
  const { data: stores } = await query.graph({ entity: "store", fields: ["id"] });
  const store = stores[0];

  // BRL como moeda padrão da loja
  logger.info("Configurando moeda BRL...");
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          { currency_code: "brl", is_default: true },
          { currency_code: "usd", is_default: false },
        ],
        default_sales_channel_id: salesChannel.id,
      },
    },
  });

  // Região Brasil (se não existir)
  const { data: regions } = await query.graph({ entity: "region", fields: ["id", "currency_code"] });
  if (!regions.find((r: any) => r.currency_code === "brl")) {
    logger.info("Criando região Brasil...");
    await createRegionsWorkflow(container).run({
      input: {
        regions: [
          { name: "Brasil", currency_code: "brl", countries: ["br"], payment_providers: ["pp_system_default"] },
        ],
      },
    });
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "br", provider_id: "tp_system" }],
    });
  }

  // Categorias (reusa as que já existem)
  logger.info("Garantindo categorias...");
  const catNames = ["Cabelo", "Beleza & Colágeno", "Saúde & Bem-estar", "Fitness & Performance", "Longevidade"];
  const catByName: Record<string, string> = {};
  const { data: existingCats } = await query.graph({ entity: "product_category", fields: ["id", "name"] });
  existingCats.forEach((c: any) => (catByName[c.name] = c.id));
  const missingCats = catNames.filter((n) => !catByName[n]);
  if (missingCats.length) {
    const { result: catResult } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: missingCats.map((name) => ({ name, is_active: true })) },
    });
    catResult.forEach((c: any) => (catByName[c.name] = c.id));
  }

  // Produtos do catálogo Tua Pharma (pula os já cadastrados por handle)
  const allItems = JSON.parse(
    readFileSync(path.join(process.cwd(), "tua-products.json"), "utf8")
  ) as Array<{ handle: string; title: string; description: string; category: string; price: number; sku: string }>;
  const { data: existingProds } = await query.graph({ entity: "product", fields: ["handle"] });
  const existingHandles = new Set(existingProds.map((p: any) => p.handle));
  const items = allItems.filter((p) => !existingHandles.has(p.handle));
  logger.info(`${existingHandles.size} já existem; ${items.length} novos a cadastrar.`);

  const productsInput = items.map((p) => ({
    title: p.title,
    handle: p.handle,
    description: p.description,
    status: ProductStatus.PUBLISHED,
    category_ids: catByName[p.category] ? [catByName[p.category]] : [],
    shipping_profile_id: shippingProfile.id,
    options: [{ title: "Formato", values: ["Único"] }],
    variants: [
      {
        title: "Único",
        sku: p.sku,
        manage_inventory: false,
        options: { Formato: "Único" },
        prices: [{ amount: p.price, currency_code: "brl" }],
      },
    ],
    sales_channels: [{ id: salesChannel.id }],
  }));

  logger.info(`Cadastrando ${productsInput.length} produtos...`);
  const CHUNK = 40;
  for (let i = 0; i < productsInput.length; i += CHUNK) {
    await createProductsWorkflow(container).run({ input: { products: productsInput.slice(i, i + CHUNK) } });
    logger.info(`  ${Math.min(i + CHUNK, productsInput.length)}/${productsInput.length}`);
  }

  // Mostra a publishable API key (necessária pro storefront)
  const { data: keys } = await query.graph({ entity: "api_key", fields: ["token", "type"] });
  const pak = keys.find((k: any) => k.type === "publishable");
  logger.info(`PUBLISHABLE_KEY=${pak?.token}`);
  logger.info("Seed Tua Pharma concluído com sucesso.");
}
