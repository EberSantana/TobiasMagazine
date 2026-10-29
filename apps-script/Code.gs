/**
 * TOBIAS MAGAZINE — Servidor de dados (Google Apps Script)
 *
 * GET  -> devolve o conteúdo publicado (qualquer visitante lê).
 * POST -> grava o conteúdo (exige a SENHA abaixo, só você sabe).
 * Os dados ficam num arquivo JSON no seu Google Drive: "tobias-magazine-dados.json".
 */

// >>> TROQUE ESTA SENHA ANTES DE IMPLANTAR (ela nunca aparece no site) <<<
const SENHA_GESTAO = "TROQUE-ESTA-SENHA";

const NOME_ARQUIVO = "tobias-magazine-dados.json";
const LIMITE_BYTES = 8 * 1024 * 1024;

function resposta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function arquivo_() {
  const it = DriveApp.getFilesByName(NOME_ARQUIVO);
  return it.hasNext() ? it.next() : null;
}

function doGet() {
  try {
    const f = arquivo_();
    if (!f) return resposta_({ ok: true, empty: true });
    return ContentService.createTextOutput(f.getBlob().getDataAsString()).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return resposta_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    if (SENHA_GESTAO === "TROQUE-ESTA-SENHA") return resposta_({ ok: false, error: "Senha do servidor ainda não foi definida no Code.gs" });
    const raw = (e && e.postData && e.postData.contents) || "";
    if (raw.length > LIMITE_BYTES) return resposta_({ ok: false, error: "Conteúdo grande demais" });
    const body = JSON.parse(raw);
    if (body.password !== SENHA_GESTAO) return resposta_({ ok: false, error: "Senha incorreta" });
    if (!body.data || typeof body.data !== "object") return resposta_({ ok: false, error: "Dados inválidos" });

    const conteudo = JSON.stringify({ ok: true, updatedAt: new Date().toISOString(), data: body.data });
    const f = arquivo_();
    if (f) f.setContent(conteudo);
    else DriveApp.createFile(NOME_ARQUIVO, conteudo, MimeType.PLAIN_TEXT);
    return resposta_({ ok: true, updatedAt: new Date().toISOString() });
  } catch (err) {
    return resposta_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}
