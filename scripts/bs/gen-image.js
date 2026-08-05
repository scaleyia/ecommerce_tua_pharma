// Gera uma imagem via Gemini (generateContent, inlineData base64) e salva em PNG.
// Uso: node scripts/bs/gen-image.js "<modelo>" "<prompt>" "<saida.png>"
const fs = require("fs");
const https = require("https");

const KEY = process.env.GEMINI_API_KEY || require("./_key");
const [, , model, prompt, out] = process.argv;

const body = JSON.stringify({
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: { responseModalities: ["IMAGE"] },
});

const req = https.request(
  {
    method: "POST",
    hostname: "generativelanguage.googleapis.com",
    path: `/v1beta/models/${model}:generateContent`,
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY, "Content-Length": Buffer.byteLength(body) },
  },
  (res) => {
    let d = "";
    res.on("data", (c) => (d += c));
    res.on("end", () => {
      if (res.statusCode !== 200) {
        console.error("HTTP", res.statusCode, d.slice(0, 500));
        process.exit(1);
      }
      const j = JSON.parse(d);
      const parts = j.candidates?.[0]?.content?.parts || [];
      const img = parts.find((p) => p.inlineData);
      if (!img) {
        console.error("sem imagem. resposta:", JSON.stringify(j).slice(0, 500));
        process.exit(1);
      }
      fs.writeFileSync(out, Buffer.from(img.inlineData.data, "base64"));
      console.log("OK ->", out, "(", fs.statSync(out).size, "bytes )");
    });
  }
);
req.on("error", (e) => { console.error(e.message); process.exit(1); });
req.write(body);
req.end();
