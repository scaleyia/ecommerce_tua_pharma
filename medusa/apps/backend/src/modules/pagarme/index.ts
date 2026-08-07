import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import PagarmeProviderService from "./service"

export default ModuleProvider(Modules.PAYMENT, {
  services: [PagarmeProviderService],
})
