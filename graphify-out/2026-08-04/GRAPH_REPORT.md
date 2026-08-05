# Graph Report - Ecoomerce - Tua Pharma  (2026-08-04)

## Corpus Check
- 64 files · ~128,778 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 414 nodes · 602 edges · 28 communities (24 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2a607f90`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app/page.tsx
- bisnaga
- data.ts
- layout.tsx
- compilerOptions
- dependencies
- devDependencies
- ProductImage.tsx
- CatalogClient.tsx
- route.ts
- receita/page.tsx
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- Manual de Marca — Tua Pharma
- 0001_init.sql
- products.ts
- Tua Pharma — E-commerce (protótipo)
- generate.js
- caixa
- gotas
- pote-capsula
- pote-creme
- pote-po
- fetch-pexels.js
- gen-image.js

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `brl()` - 14 edges
3. `pote-capsula` - 11 edges
4. `pote-po` - 11 edges
5. `pote-creme` - 11 edges
6. `bisnaga` - 11 edges
7. `gotas` - 11 edges
8. `frasco` - 11 edges
9. `spray` - 11 edges
10. `caixa` - 11 edges

## Surprising Connections (you probably didn't know these)
- `CadastroPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/cadastro/page.tsx → src/context/AuthContext.tsx
- `ContaPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/conta/page.tsx → src/context/AuthContext.tsx
- `ContaPage()` --calls--> `brl()`  [EXTRACTED]
  src/app/conta/page.tsx → src/lib/format.ts
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/login/page.tsx → src/context/AuthContext.tsx
- `TrocasDevolucoesPage()` --calls--> `whatsappLink()`  [EXTRACTED]
  src/app/trocas-devolucoes/page.tsx → src/lib/site.ts

## Import Cycles
- None detected.

## Communities (28 total, 4 thin omitted)

### Community 0 - "app/page.tsx"
Cohesion: 0.09
Nodes (24): metadata, ContaPage(), mockOrders, Tab, benefits, HomePage(), testimonials, ClubeClient() (+16 more)

### Community 1 - "bisnaga"
Cohesion: 0.06
Nodes (33): bisnaga, frasco, spray, /produtos/base/bisnaga-0.jpg, /produtos/base/bisnaga-1.jpg, /produtos/base/bisnaga-2.jpg, /produtos/base/bisnaga-3.jpg, /produtos/base/bisnaga-4.jpg (+25 more)

### Community 2 - "data.ts"
Cohesion: 0.13
Nodes (30): CartPage(), COUPONS, generateMetadata(), ProductPage(), CartDrawer(), ProductCard(), ProductImage(), ProductPurchase() (+22 more)

### Community 3 - "layout.tsx"
Cohesion: 0.07
Nodes (33): CadastroPage(), inter, jost, metadata, LoginPage(), highlights, metadata, values (+25 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 5 - "dependencies"
Cohesion: 0.08
Nodes (24): clsx, lucide-react, next, dependencies, clsx, lucide-react, next, react (+16 more)

### Community 6 - "devDependencies"
Cohesion: 0.12
Nodes (17): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, tsx, @types/node, @types/react (+9 more)

### Community 7 - "ProductImage.tsx"
Cohesion: 0.14
Nodes (5): ACCENTS, LabelContent(), Shape, wrap(), Packaging

### Community 8 - "CatalogClient.tsx"
Cohesion: 0.20
Nodes (6): COUPONS, db, metadata, CatalogClient(), SortKey, categories

### Community 9 - "route.ts"
Cohesion: 0.40
Nodes (5): CSV_PATH, dynamic, esc(), POST(), runtime

### Community 14 - "Manual de Marca — Tua Pharma"
Cohesion: 0.12
Nodes (16): 1. Essência da marca, 2. Logotipo, 3. Paleta de cores, 4. Tipografia, 5. Tom de voz, 6. Aplicações, 7. Dados oficiais da marca, Dourados (cor de destaque) (+8 more)

### Community 15 - "0001_init.sql"
Cohesion: 0.22
Nodes (11): auth.users, public.handle_new_user, on_auth_user_created, public.categories, public.coupons, public.is_admin(), public.leads, public.order_items (+3 more)

### Community 16 - "products.ts"
Cohesion: 0.36
Nodes (9): getBestsellers(), getProductBySlug(), getProducts(), getProductsByCategory(), getSpecialOffers(), Row, rowToProduct(), supabaseReady() (+1 more)

### Community 17 - "Tua Pharma — E-commerce (protótipo)"
Cohesion: 0.29
Nodes (6): Como rodar, Estrutura, Funcionalidades, Identidade visual, Próxima fase (fase 2), Tua Pharma — E-commerce (protótipo)

### Community 20 - "generate.js"
Cohesion: 0.09
Nodes (9): BOTTLES, byCat, cols, fs, maisVendidos, ofertas, out, path (+1 more)

### Community 21 - "caixa"
Cohesion: 0.18
Nodes (11): caixa, /produtos/base/caixa-0.jpg, /produtos/base/caixa-1.jpg, /produtos/base/caixa-2.jpg, /produtos/base/caixa-3.jpg, /produtos/base/caixa-4.jpg, /produtos/base/caixa-5.jpg, /produtos/base/caixa-6.jpg (+3 more)

### Community 22 - "gotas"
Cohesion: 0.18
Nodes (11): gotas, /produtos/base/gotas-0.jpg, /produtos/base/gotas-1.jpg, /produtos/base/gotas-2.jpg, /produtos/base/gotas-3.jpg, /produtos/base/gotas-4.jpg, /produtos/base/gotas-5.jpg, /produtos/base/gotas-6.jpg (+3 more)

### Community 23 - "pote-capsula"
Cohesion: 0.18
Nodes (11): pote-capsula, /produtos/base/pote-capsula-0.jpg, /produtos/base/pote-capsula-1.jpg, /produtos/base/pote-capsula-2.jpg, /produtos/base/pote-capsula-3.jpg, /produtos/base/pote-capsula-4.jpg, /produtos/base/pote-capsula-5.jpg, /produtos/base/pote-capsula-6.jpg (+3 more)

### Community 24 - "pote-creme"
Cohesion: 0.18
Nodes (11): pote-creme, /produtos/base/pote-creme-0.jpg, /produtos/base/pote-creme-1.jpg, /produtos/base/pote-creme-2.jpg, /produtos/base/pote-creme-3.jpg, /produtos/base/pote-creme-4.jpg, /produtos/base/pote-creme-5.jpg, /produtos/base/pote-creme-6.jpg (+3 more)

### Community 25 - "pote-po"
Cohesion: 0.18
Nodes (11): pote-po, /produtos/base/pote-po-0.jpg, /produtos/base/pote-po-1.jpg, /produtos/base/pote-po-2.jpg, /produtos/base/pote-po-3.jpg, /produtos/base/pote-po-4.jpg, /produtos/base/pote-po-5.jpg, /produtos/base/pote-po-6.jpg (+3 more)

### Community 26 - "fetch-pexels.js"
Cohesion: 0.29
Nodes (4): fs, https, path, QUERIES

### Community 27 - "gen-image.js"
Cohesion: 0.40
Nodes (4): body, fs, https, req

## Knowledge Gaps
- **205 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+200 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pote-capsula` connect `pote-capsula` to `bisnaga`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `pote-po` connect `pote-po` to `bisnaga`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `pote-creme` connect `pote-creme` to `bisnaga`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _205 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0928030303030303 - nodes in this community are weakly interconnected._
- **Should `bisnaga` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13107822410147993 - nodes in this community are weakly interconnected._