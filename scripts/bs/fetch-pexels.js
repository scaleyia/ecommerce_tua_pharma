// Baixa fotos royalty-free da Pexels por TIPO de embalagem e salva em
// public/produtos/base/<tipo>-<n>.jpg. Uso comercial liberado, sem atribuição.
// Uso: PEXELS_API_KEY=... node scripts/bs/fetch-pexels.js
const fs = require("fs");
const path = require("path");
const https = require("https");

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) {
  console.error("Defina PEXELS_API_KEY (veja .env.local).");
  process.exit(1);
}

// Consultas por tipo de embalagem (fundo branco, produto isolado).
const QUERIES = {
  "pote-capsula": "blank white supplement bottle mockup white background",
  "pote-po": "blank protein powder jar mockup white background",
  "pote-creme": "blank white cream jar mockup white background",
  bisnaga: "blank white cosmetic tube mockup white background",
  gotas: "amber glass dropper bottle isolated product photo",
  frasco: "blank white pump bottle mockup white background",
  spray: "amber pharmacy bottle isolated product photo",
  caixa: "blank white product box mockup white background",
};
const PER = 10; // candidatos por tipo (escolhemos os melhores depois)

const getJSON = (url) =>
  new Promise((res, rej) => {
    https
      .get(url, { headers: { Authorization: KEY, "User-Agent": "Mozilla/5.0" } }, (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => {
          if (r.statusCode !== 200) return rej(new Error(`HTTP ${r.statusCode}: ${d.slice(0, 200)}`));
          try {
            res(JSON.parse(d));
          } catch (e) {
            rej(e);
          }
        });
      })
      .on("error", rej);
  });

const download = (url, dest) =>
  new Promise((res, rej) => {
    const f = fs.createWriteStream(dest);
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (r) => {
        if (r.statusCode !== 200) return rej(new Error(`img HTTP ${r.statusCode}`));
        r.pipe(f);
        f.on("finish", () => f.close(() => res()));
      })
      .on("error", rej);
  });

(async () => {
  const outDir = path.join(__dirname, "../../public/produtos/base");
  fs.mkdirSync(outDir, { recursive: true });
  // Refaz só os tipos passados via argv (ex.: node fetch-pexels.js gotas spray).
  const only = process.argv.slice(2);
  const manifestPath = path.join(outDir, "manifest.json");
  const manifest = only.length && fs.existsSync(manifestPath) ? require(manifestPath) : {};
  const entries = only.length ? Object.entries(QUERIES).filter(([t]) => only.includes(t)) : Object.entries(QUERIES);
  for (const [tipo, q] of entries) {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${PER}&orientation=square`;
    try {
      const j = await getJSON(url);
      manifest[tipo] = [];
      let i = 0;
      for (const p of j.photos || []) {
        const src = p.src.large || p.src.medium;
        const dest = path.join(outDir, `${tipo}-${i}.jpg`);
        await download(src, dest);
        manifest[tipo].push(`/produtos/base/${tipo}-${i}.jpg`);
        i++;
      }
      console.log(`${tipo}: ${i} imagens`);
    } catch (e) {
      console.error(`${tipo}: ERРО ${e.message}`);
    }
  }
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("\nmanifest salvo em public/produtos/base/manifest.json");
})();
