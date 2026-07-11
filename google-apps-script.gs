/**
 * TUA PHARMA — Recebe leads da roleta e grava no Google Sheets.
 *
 * COMO USAR:
 * 1. Crie uma planilha nova no Google Sheets (acesse sheets.new).
 * 2. Menu "Extensões" > "Apps Script".
 * 3. Apague o conteúdo e cole TODO este código. Salve (ícone de disquete).
 * 4. Clique em "Implantar" > "Nova implantação".
 * 5. Engrenagem > tipo "App da Web".
 *      - Executar como: Eu (seu e-mail)
 *      - Quem tem acesso: Qualquer pessoa
 * 6. "Implantar" > autorize o acesso (pode aparecer aviso do Google, clique
 *    em "Avançado" > "Acessar (não seguro)" — é seu próprio script).
 * 7. Copie a "URL do app da Web" (termina em /exec).
 * 8. Me envie essa URL — eu ligo no site (.env.local -> LEADS_WEBHOOK_URL).
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Leads") || ss.insertSheet("Leads");

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Data", "Nome", "WhatsApp", "E-mail", "Cupom", "Origem"]);
    }

    var d = JSON.parse(e.postData.contents);
    sheet.appendRow([
      d.date || new Date().toISOString(),
      d.name || "",
      d.whatsapp || "",
      d.email || "",
      d.coupon || "",
      d.origem || "roleta"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
