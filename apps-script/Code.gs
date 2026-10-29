/**
 * TOBIAS MAGAZINE — Servidor (Google Apps Script) — versão 2
 *
 * Público (sem senha):  GET conteúdo do site | POST lead, suggest, track
 * Gestão (com SENHA):   salvar conteúdo, contratos, listar leads/sugestões/métricas, Guia na planilha
 *
 * Conteúdo do site -> arquivo JSON no Drive. Dados privados/operacionais -> planilha abaixo.
 */

// >>> USE A MESMA SENHA QUE VOCÊ JÁ ESCOLHEU (só você sabe, não aparece no site) <<<
const SENHA_GESTAO = "TROQUE-ESTA-SENHA";

const SHEET_ID = "1XyQGjJkOFTBxoa2PuwttZ-65fDNvfw4bPSCcMKaE91E";
const NOME_ARQUIVO = "tobias-magazine-dados.json";
const LIMITE_BYTES = 8 * 1024 * 1024;

const ABAS = {
  Leads: ["ID", "Data", "Loja", "Responsável", "WhatsApp", "Ramo", "Plano", "Mensagem", "Status"],
  Sugestoes: ["ID", "Data", "Tipo", "Titulo", "Dados", "WhatsApp", "Status"],
  Metricas: ["Chave", "Evento", "ID", "Item", "Total", "Atualizado"],
  Contratos: ["ID", "Lojista", "Plano", "Valor", "Status", "WhatsApp", "Contato"],
  Guia: ["id", "ativo", "name", "catSlug", "avatar", "description", "address", "mapsUrl", "hours", "phone", "landline", "instagram", "website", "photo", "status", "sponsored", "priority"]
};

// ---------- utilidades ----------
function resp_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function aba_(nome) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(nome);
  if (!sh) {
    sh = ss.insertSheet(nome);
    sh.getRange(1, 1, 1, ABAS[nome].length).setValues([ABAS[nome]]).setFontWeight("bold").setBackground("#fbe9dc");
    sh.setFrozenRows(1);
    sh.getRange(1, 1, sh.getMaxRows(), ABAS[nome].length).setNumberFormat("@"); // tudo como texto (telefones)
  }
  return sh;
}

function lerObjs_(sh) {
  const v = sh.getDataRange().getValues();
  if (v.length < 2) return [];
  const h = v[0];
  return v.slice(1).filter((r) => r.some((c) => c !== "")).map((r) => {
    const o = {};
    h.forEach((k, i) => (o[k] = r[i] instanceof Date ? r[i].toISOString() : String(r[i])));
    return o;
  });
}

// limpa texto vindo do público: sem < >, sem caracteres de controle, tamanho limitado (as abas são texto puro, então não executam fórmulas)
function txt_(v, max) {
  let s = String(v == null ? "" : v).replace(/[<>]/g, "").replace(/[\u0000-\u001f]/g, " ").trim();
  if (s.length > (max || 300)) s = s.slice(0, max || 300);
  return s;
}

function tel_(v) {
  return String(v == null ? "" : v).replace(/\D/g, "").slice(0, 15);
}

function limite_(nome, max, segundos) {
  const cache = CacheService.getScriptCache();
  const n = Number(cache.get("rl_" + nome) || 0);
  if (n >= max) return false;
  cache.put("rl_" + nome, String(n + 1), segundos);
  return true;
}

function senhaOk_(body) {
  if (SENHA_GESTAO === "TROQUE-ESTA-SENHA") return false;
  if (body.password === SENHA_GESTAO) return true;
  Utilities.sleep(900); // dificulta tentativas em massa
  return false;
}

function arquivo_() {
  const it = DriveApp.getFilesByName(NOME_ARQUIVO);
  return it.hasNext() ? it.next() : null;
}

function agora_() {
  return Utilities.formatDate(new Date(), "America/Bahia", "yyyy-MM-dd HH:mm:ss");
}

// ---------- GET ----------
function doGet() {
  try {
    const f = arquivo_();
    if (!f) return resp_({ ok: true, empty: true });
    return ContentService.createTextOutput(f.getBlob().getDataAsString()).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return resp_({ ok: false, error: String(err) });
  }
}

// ---------- POST ----------
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    const raw = (e && e.postData && e.postData.contents) || "";
    if (raw.length > LIMITE_BYTES) return resp_({ ok: false, error: "Conteúdo grande demais" });
    const body = JSON.parse(raw);
    const acao = body.action || (body.data ? "saveContent" : "");

    // ----- ações públicas -----
    if (acao === "lead") return lead_(body);
    if (acao === "suggest") return suggest_(body);
    if (acao === "track") return track_(body);

    // ----- ações de gestão (exigem senha) -----
    if (SENHA_GESTAO === "TROQUE-ESTA-SENHA") return resp_({ ok: false, error: "Senha do servidor ainda não foi definida no Code.gs" });
    if (!senhaOk_(body)) return resp_({ ok: false, error: "Senha incorreta" });

    switch (acao) {
      case "saveContent": {
        if (!body.data || typeof body.data !== "object") return resp_({ ok: false, error: "Dados inválidos" });
        const conteudo = JSON.stringify({ ok: true, updatedAt: new Date().toISOString(), data: body.data });
        const f = arquivo_();
        if (f) f.setContent(conteudo);
        else DriveApp.createFile(NOME_ARQUIVO, conteudo, MimeType.PLAIN_TEXT);
        return resp_({ ok: true });
      }
      case "list": {
        const nome = { leads: "Leads", sugestoes: "Sugestoes", metricas: "Metricas" }[body.sheet];
        if (!nome) return resp_({ ok: false, error: "Aba inválida" });
        return resp_({ ok: true, rows: lerObjs_(aba_(nome)) });
      }
      case "setStatus": {
        const nome = { leads: "Leads", sugestoes: "Sugestoes" }[body.sheet];
        if (!nome) return resp_({ ok: false, error: "Aba inválida" });
        const sh = aba_(nome);
        const v = sh.getDataRange().getValues();
        const col = v[0].indexOf("Status") + 1;
        for (let i = 1; i < v.length; i++) {
          if (String(v[i][0]) === String(body.id)) {
            sh.getRange(i + 1, col).setValue(txt_(body.status, 40));
            return resp_({ ok: true });
          }
        }
        return resp_({ ok: false, error: "Registro não encontrado" });
      }
      case "getSponsors":
        return resp_({ ok: true, rows: lerObjs_(aba_("Contratos")) });
      case "saveSponsors":
        return substituir_("Contratos", (body.rows || []).map((r) => [r.id, r.client, r.plan, r.amount, r.status, r.contact || "", ""]));
      case "getDirectory":
        return resp_({ ok: true, rows: lerObjs_(aba_("Guia")) });
      case "saveDirectory":
        return substituir_(
          "Guia",
          (body.rows || []).map((r) => ABAS.Guia.map((k) => (k === "ativo" ? "SIM" : r[k] == null ? "" : String(r[k]))))
        );
      default:
        return resp_({ ok: false, error: "Ação desconhecida" });
    }
  } catch (err) {
    return resp_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function substituir_(nome, linhas) {
  const sh = aba_(nome);
  const n = ABAS[nome].length;
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, n).clearContent();
  if (linhas.length) {
    if (sh.getMaxRows() < linhas.length + 1) sh.insertRowsAfter(sh.getMaxRows(), linhas.length + 1 - sh.getMaxRows());
    sh.getRange(2, 1, linhas.length, n).setNumberFormat("@").setValues(linhas.map((l) => l.map((c) => (c == null ? "" : String(c)))));
  }
  return resp_({ ok: true, count: linhas.length });
}

// ---------- públicas ----------
function lead_(b) {
  if (b.hp) return resp_({ ok: true }); // isca anti-robô preenchida
  if (!limite_("lead", 40, 3600)) return resp_({ ok: false, error: "Muitos pedidos agora. Tente mais tarde." });
  const f = b.fields || {};
  if (!txt_(f.loja, 120) || !tel_(f.whatsapp)) return resp_({ ok: false, error: "Preencha loja e WhatsApp" });
  aba_("Leads").appendRow(["ld-" + Date.now(), agora_(), txt_(f.loja, 120), txt_(f.responsavel, 120), tel_(f.whatsapp), txt_(f.ramo, 120), txt_(f.plano, 120), txt_(f.mensagem, 600), "Novo"]);
  return resp_({ ok: true });
}

function suggest_(b) {
  if (b.hp) return resp_({ ok: true });
  if (!limite_("suggest", 60, 3600)) return resp_({ ok: false, error: "Muitos envios agora. Tente mais tarde." });
  const f = b.fields || {};
  const tipo = b.type === "classified" ? "classified" : "biz";
  const limpo = {};
  Object.keys(f).slice(0, 12).forEach((k) => {
    limpo[txt_(k, 30)] = k === "phone" ? tel_(f[k]) : txt_(f[k], k === "description" || k === "details" ? 600 : 200);
  });
  const titulo = tipo === "biz" ? limpo.name : limpo.title;
  if (!titulo) return resp_({ ok: false, error: "Faltou o nome/título" });
  aba_("Sugestoes").appendRow(["sg-" + Date.now(), agora_(), tipo, titulo, JSON.stringify(limpo), limpo.phone || "", "Pendente"]);
  return resp_({ ok: true });
}

function track_(b) {
  if (!limite_("track", 3000, 3600)) return resp_({ ok: true });
  const evs = (b.events || []).slice(0, 60);
  if (!evs.length) return resp_({ ok: true });
  const sh = aba_("Metricas");
  const v = sh.getDataRange().getValues();
  const idx = {};
  for (let i = 1; i < v.length; i++) idx[String(v[i][0])] = i + 1;
  const permitidos = { maps: 1, whatsapp: 1, call: 1, visit: 1, comercial: 1, anuncie: 1 };
  const soma = {};
  evs.forEach((ev) => {
    const e = String(ev.e || "");
    if (!permitidos[e]) return;
    const id = txt_(ev.id || "site", 60), nome = txt_(ev.n || "", 120), k = e + "|" + id;
    if (!soma[k]) soma[k] = { e: e, id: id, n: nome, c: 0 };
    soma[k].c++;
  });
  Object.keys(soma).forEach((k) => {
    const s = soma[k];
    if (idx[k]) {
      const cel = sh.getRange(idx[k], 5);
      cel.setValue(String((Number(cel.getValue()) || 0) + s.c));
      sh.getRange(idx[k], 6).setValue(agora_());
    } else {
      sh.appendRow([k, s.e, s.id, s.n, String(s.c), agora_()]);
    }
  });
  return resp_({ ok: true });
}
