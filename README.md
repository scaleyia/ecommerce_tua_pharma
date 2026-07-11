# Tua Pharma — E-commerce (protótipo)

E-commerce completo para a **Tua Pharma**, farmácia de manipulação. Protótipo navegável
com identidade visual **verde-profundo + dourado** (premium), construído em **Next.js 15 +
TypeScript + Tailwind CSS**.

## Como rodar

```bash
npm install       # instala dependências (já instaladas)
npm run dev       # servidor de desenvolvimento em http://localhost:3000
npm run build     # build de produção
npm start         # roda o build de produção
```

Abra **http://localhost:3000** no navegador.

## Funcionalidades

- 🏠 **Home** — carrossel de banners, faixa de benefícios, grade de categorias, ofertas
  especiais com contador regressivo, mais vendidos, bloco do clube, sobre a farmácia,
  envie sua receita e depoimentos.
- 🛍️ **Catálogo** (`/produtos`) — filtro por categoria, busca e ordenação.
- 📦 **Página de produto** — galeria, preço/parcelamento, benefícios, quantidade,
  adicionar ao carrinho / comprar agora e relacionados.
- 🛒 **Carrinho** — drawer lateral + página completa, cupom (`TUA10`, `BEMVINDO`), frete
  grátis progressivo e finalização com confirmação.
- 👤 **Login / Cadastro** — autenticação simulada com todos os dados do usuário
  (persistência em `localStorage`).
- 🔐 **Minha Conta** — perfil editável, histórico de pedidos e status do clube (protegida).
- 👑 **Clube de Vantagens** — planos (Essencial/Prime/Black), como funciona, benefícios e FAQ.
- 📄 **Envie sua receita** — formulário com upload.
- ℹ️ **Sobre** e **rodapé com selos** (ANVISA, SSL, farmacêutico responsável, pagamentos, CNPJ).

## Identidade visual

| Cor | HEX |
|---|---|
| Verde profundo | `#12261C` |
| Verde principal | `#1B4332` |
| Verde médio | `#2E6B4F` |
| Dourado | `#C9A24B` |
| Dourado claro | `#E6C878` |
| Creme | `#F7F5EF` |

Fontes: **Jost** (títulos, estilo da logo) + **Inter** (corpo).

## Estrutura

```
src/
├── app/            # rotas (App Router)
│   ├── layout.tsx  # header, footer, providers, carrinho
│   ├── page.tsx    # home
│   ├── produtos/   # catálogo + [slug]
│   ├── carrinho/ login/ cadastro/ conta/ clube/ receita/ sobre/
├── components/     # Header, Footer, ProductCard, HeroCarousel, CartDrawer, etc.
├── context/        # CartContext, AuthContext
└── lib/            # data.ts (mock), types.ts, format.ts
```

## Próxima fase (fase 2)

Este é um **protótipo com dados fictícios**. Evoluções previstas: banco de dados e login
reais, painel administrativo de produtos, e integração de **pagamento** (Pix / cartão /
boleto — ex.: Mercado Pago, Pagar.me ou Stripe) e cálculo de frete real.

> Site com caráter demonstrativo. Dados, CNPJ e selos são fictícios.
