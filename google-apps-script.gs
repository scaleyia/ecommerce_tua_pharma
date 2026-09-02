/**
 * TUA PHARMA — Recebe os leads do pop-up de desconto e grava no Google Sheets.
 *
 * COMO PUBLICAR:
 * 1. Abra a planilha no Google Sheets.
 * 2. Menu "Extensões" > "Apps Script".
 * 3. Apague o conteúdo e cole TODO este código. Salve (ícone de disquete).
 * 4. Clique em "Implantar" > "Nova implantação".
 * 5. Engrenagem > tipo "App da Web".
 *      - Executar como: Eu (seu e-mail)
 *      - Quem tem acesso: Qualquer pessoa
 * 6. "Implantar" > autorize o acesso (o Google mostra um aviso; clique em
 *    "Avançado" > "Acessar (não seguro)" — é o seu próprio script).
 * 7. Copie a "URL do app da Web" (termina em /exec) e mande para mim.
 *
 * OBS: se você editar este código depois, precisa fazer "Implantar" >
 * "Gerenciar implantações" > editar > "Nova versão". Sem isso, a URL continua
 * rodando a versão antiga.
 */

var COLUNAS = [
  "Data",
  "Nome",
  "E-mail",
  "WhatsApp",
  "Nascimento",
  "Cupom",
  "Origem",
];

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Leads") || ss.insertSheet("Leads");

    // cabeçalho, criado uma única vez
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUNAS);
      sheet.getRange(1, 1, 1, COLUNAS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var d = JSON.parse(e.postData.contents);

    sheet.appendRow([
      d.date ? new Date(d.date) : new Date(),
      d.name || "",
      d.email || "",
      d.whatsapp || "",
      d.birthdate || "", // usado para o brinde de aniversário
      d.coupon || "",
      d.origem || "popup-cadastro",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/** Permite abrir a URL no navegador só para conferir se está no ar. */
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, service: "Tua Pharma — captura de leads" })
  ).setMimeType(ContentService.MimeType.JSON);
}
