import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
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

  // Frete Brasil: o seed padrão só cobre a Europa. Sem uma opção de frete na
  // zona "br"/região BRL, o carrinho não completa em pedido. Cria uma vez.
  const { data: allRegions } = await query.graph({
    entity: "region",
    fields: ["id", "currency_code"],
  });
  const brRegion = allRegions.find((r: any) => r.currency_code === "brl");
  const { data: fsets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name"],
  });
  if (brRegion && !fsets.find((f: any) => f.name === "Entrega Brasil")) {
    logger.info("Criando opção de frete Brasil...");
    const link = container.resolve(ContainerRegistrationKeys.LINK);
    const fulfillmentModuleService = container.resolve(
      ModuleRegistrationName.FULFILLMENT
    );
    const { data: locs } = await query.graph({
      entity: "stock_location",
      fields: ["id"],
    });
    const stockLocation = locs[0];

    const fset = await fulfillmentModuleService.createFulfillmentSets({
      name: "Entrega Brasil",
      type: "shipping",
      service_zones: [
        { name: "Brasil", geo_zones: [{ country_code: "br", type: "country" }] },
      ],
    });

    if (stockLocation) {
      await link.create({
        [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
        [Modules.FULFILLMENT]: { fulfillment_set_id: fset.id },
      });
    }

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Frete padrão",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fset.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Padrão",
            description: "Entrega em alguns dias úteis.",
            code: "standard",
          },
          prices: [
            { currency_code: "brl", amount: 19.9 },
            { region_id: brRegion.id, amount: 19.9 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
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
