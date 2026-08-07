import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Módulos opcionais — só entram se as chaves existirem, pra não quebrar o boot.
const modules: any[] = []

if (process.env.PAGARME_SECRET_KEY) {
  modules.push({
    resolve: '@medusajs/medusa/payment',
    options: {
      providers: [
        {
          resolve: './src/modules/pagarme',
          id: 'pagarme',
          options: {
            secretKey: process.env.PAGARME_SECRET_KEY,
            pixExpiresIn: Number(process.env.PAGARME_PIX_EXPIRES_IN ?? 3600),
            statementDescriptor: process.env.PAGARME_STATEMENT_DESCRIPTOR ?? 'TUAPHARMA',
          },
        },
      ],
    },
  })
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  ...(modules.length ? { modules } : {}),
})
