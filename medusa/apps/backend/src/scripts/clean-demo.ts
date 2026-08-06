import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows";
export default async function clean({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const demo = ["t-shirt", "sweatshirt", "sweatpants", "shorts"];
  const { data } = await query.graph({ entity: "product", fields: ["id", "handle"] });
  const ids = data.filter((p: any) => demo.includes(p.handle)).map((p: any) => p.id);
  if (ids.length) { await deleteProductsWorkflow(container).run({ input: { ids } }); }
  logger.info(`Demo removidos: ${ids.length}`);
}
