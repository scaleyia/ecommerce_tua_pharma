import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Módulos opcionais — só entram se as chaves existirem, pra não quebrar o boot.
const modules: any[] = []

// Arquivos (fotos de produto enviadas pelo painel).
//
// Precisa ser explícito por dois motivos:
//  1. `upload_dir` fixa a pasta em `static/`, relativa ao workdir do container
//     (/app/.medusa/server). É essa pasta que o volume do EasyPanel preserva —
//     sem volume, toda foto enviada some no deploy seguinte.
//  2. `backend_url` define a URL pública gravada no banco para cada imagem. O
//     padrão do provider é http://localhost:9000/static, que funciona no dev e
//     quebra em produção: a loja receberia links para localhost.
modules.push({
  resolve: '@medusajs/medusa/file',
  options: {
    providers: [
      {
        resolve: '@medusajs/medusa/file-local',
        id: 'local',
        options: {
          upload_dir: 'static',
          backend_url: `${process.env.MEDUSA_BACKEND_URL ?? 'http://localhost:9000'}/static`,
        },
      },
    ],
  },
})

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
