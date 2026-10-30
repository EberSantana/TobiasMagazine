// ==========================================================================
// TOBIAS MAGAZINE — Lógica Interativa + CMS Editorial com Login & RBAC
// ==========================================================================

(function () {
  const STORAGE_KEY = "tobias_cms_state_v2";
  const SESSION_KEY = "tobias_cms_session_v2";

  // Catálogo oficial de módulos/permissões que o Administrador pode atribuir aos perfis
  const ALL_MODULES = [
    { id: "edition", label: "🗞️ 1. Edição & Capa", desc: "Capa, número da edição e alerta urgente" },
    { id: "directory", label: "🏪 2. Guia do Comércio", desc: "Lojas, serviços e selo patrocinado" },
    { id: "utility", label: "🚨 3. Utilidade Pública", desc: "Avisos de água, luz, obras e saúde" },
    { id: "people", label: "🎙️ 4. Gente & Publis", desc: "Histórias de moradores e publieditoriais" },
    { id: "promotions", label: "🏷️ 5. Cupons & Ofertas", desc: "Descontos exclusivos dos lojistas" },
    { id: "events", label: "📅 6. Agenda & Lazer", desc: "Feiras, quermesses, esportes e cultura" },
    { id: "classifieds", label: "📌 7. Classificados", desc: "Imóveis, vagas, vendas e adoção pet" },
    { id: "flipbook", label: "📖 8. Páginas Flipbook", desc: "Diagramação das 10 páginas mobile" },
    { id: "monetization", label: "💰 9. Anuncie: Planos, Receita & Backup", desc: "Preços dos planos, contratos publicitários, backup e data.js" },
    { id: "whatsapp_config", label: "📲 10. Config. WhatsApp", desc: "Números oficiais, grupos, templates e QR Code" },
    { id: "audit_logs", label: "📋 11. Logs & Auditoria", desc: "Histórico de acessos e ações de todos os perfis" },
    { id: "users_rbac", label: "🔐 12. Perfis & Acessos", desc: "Criar perfis, atribuições e usuários (Exclusivo Admin)" },
    { id: "inbox", label: "📥 13. Caixa de Entrada & Métricas", desc: "Pedidos de anúncio, sugestões dos moradores, métricas e Guia na planilha" }
  ];

  // Perfis padrão pré-configurados (O Administrador pode criar novos perfis personalizados)
  function getDefaultRoles() {
    return [
      {
        id: "role-admin",
        name: "Administrador Geral",
        badgeColor: "#ff9c0d",
        description: "Acesso total a todos os módulos, WhatsApp, logs de auditoria, financeiro e criação de perfis.",
        permissions: ALL_MODULES.map((m) => m.id),
        isSystem: true
      },
      {
        id: "role-editor",
        name: "Editor de Pauta & Jornalismo",
        badgeColor: "#1b6b53",
        description: "Gerencia Edição & Capa, Utilidade Pública, Gente do Bairro, Agenda, Flipbook e Logs.",
        permissions: ["edition", "utility", "people", "events", "flipbook", "audit_logs"],
        isSystem: false
      },
      {
        id: "role-comercial",
        name: "Gestor Comercial & Guia",
        badgeColor: "#feb202",
        description: "Gerencia Guia do Comércio, Cupons, Classificados, Receita, Config. WhatsApp e Logs.",
        permissions: ["directory", "promotions", "classifieds", "monetization", "whatsapp_config", "audit_logs"],
        isSystem: false
      },
      {
        id: "role-colab",
        name: "Colaborador Comunitário",
        badgeColor: "#03326f",
        description: "Apoia na atualização de Utilidade Pública, Agenda da Praça, Classificados e Logs.",
        permissions: ["utility", "events", "classifieds", "audit_logs"],
        isSystem: false
      }
    ];
  }

  function getDefaultWhatsappConfig() {
    return {
      redacaoPhone: "5579999990000",
      comercialPhone: "5579999990000",
      groupInviteLink: "https://chat.whatsapp.com/TobiasMagazineBairro",
      shareTemplate: "🗞️ *TOBIAS MAGAZINE — {EDICAO} no ar!* \nConfira o Guia do Comércio no WhatsApp, horários do Posto de Saúde, Agenda da Praça e Cupons de Desconto no nosso bairro:\n{URL}",
      storeTemplate: "Olá! Vi o contato de *{LOJA}* no Guia da Tobias Magazine ({EDICAO}) e gostaria de atendimento.",
      couponTemplate: "Olá! Quero usar o cupom *{CUPOM}* ({DESCONTO}) na *{LOJA}* que vi na Tobias Magazine!",
      commercialTemplate: "Olá! Quero anunciar meu comércio/serviço na próxima edição da Tobias Magazine!",
      qrPosterUrl: "https://ebersantana.github.io/TobiasMagazine/",
      qrPosterTitle: "LEIA GRÁTIS A REVISTA DO NOSSO BAIRRO!",
      qrPosterFooter: "Escaneie com a câmera do celular • Sem instalar aplicativo"
    };
  }

  function getDefaultAuditLogs() {
    const now = new Date();
    const fmt = (d) => d.toLocaleString("pt-BR");
    return [
      {
        id: "log-init-1",
        timestamp: fmt(new Date(now.getTime() - 3600000 * 4)),
        username: "admin",
        fullName: "Administrador Chefe (Tobias)",
        roleName: "Administrador Geral",
        module: "🗞️ Edição & Capa",
        action: "Publicação Oficial",
        details: "Publicou o acervo das 6 Edições Quinzenais (#14 a #19) na Banca Digital"
      },
      {
        id: "log-init-2",
        timestamp: fmt(new Date(now.getTime() - 3600000 * 2)),
        username: "comercial",
        fullName: "Roberto • Gestor Comercial",
        roleName: "Gestor Comercial & Guia",
        module: "🏪 Guia do Comércio",
        action: "Destaque Patrocinado",
        details: "Ativou selo Destaque na Padaria Seu Tobias e Farmácia Vida & Saúde 24h"
      },
      {
        id: "log-init-3",
        timestamp: fmt(new Date(now.getTime() - 1800000)),
        username: "editor",
        fullName: "Mariana • Editora de Jornalismo",
        roleName: "Editor de Pauta & Jornalismo",
        module: "🚨 Utilidade Pública",
        action: "Alerta de Água & UBS",
        details: "Cadastrou aviso de manutenção hidráulica na Rua das Acácias e horário estendido da UBS"
      }
    ];
  }

  // Usuários iniciais (Credenciais para login e demonstração rápida)
  function getDefaultUsers() {
    return [
      {
        id: "usr-1",
        username: "admin",
        password: "123",
        fullName: "Administrador Chefe (Tobias)",
        roleId: "role-admin"
      },
      {
        id: "usr-2",
        username: "editor",
        password: "123",
        fullName: "Mariana • Editora de Jornalismo",
        roleId: "role-editor"
      },
      {
        id: "usr-3",
        username: "comercial",
        password: "123",
        fullName: "Roberto • Gestor Comercial",
        roleId: "role-comercial"
      },
      {
        id: "usr-4",
        username: "comunidade",
        password: "123",
        fullName: "Dona Lurdes • Associação de Moradores",
        roleId: "role-colab"
      }
    ];
  }

  function getDefaultAdsKit() {
    return {
      badge: "Mídia Kit & Parcerias Locais",
      title: "Coloque Sua Loja ou Serviço no Celular de Todo o Bairro",
      intro: "A <strong>Tobias Magazine</strong> é distribuída quinzenalmente nos grupos de WhatsApp dos condomínios, impulsionada por geolocalização no Instagram/Facebook (raio de 2km) e lida via QR Code no balcão das lojas parceiras.",
      plans: [
        { name: "Plano Guia & Rodapé", price: 49, unit: "quinzena", desc: "Card com botão direto para seu WhatsApp + Cupom na aba de Promoções.", featured: false, flag: "" },
        { name: "Destaque Página Inteira", price: 120, unit: "quinzena", desc: "Banner no Flipbook de 10 páginas + Selo Destaque no topo do Guia.", featured: true, flag: "Mais escolhido" },
        { name: "Publieditorial + Reels", price: 220, unit: "edição", desc: "Matéria contando a história da sua loja + Story em vídeo + Cartaz QR Code.", featured: false, flag: "" }
      ]
    };
  }

  function planLabel(p) {
    return `${p.name} (R$ ${p.price})`;
  }

  function renderAdsKit() {
    const kit = STATE.adsKit || getDefaultAdsKit();
    const set = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };
    set("adsKitBadge", escapeHtml(kit.badge));
    set("adsKitTitle", escapeHtml(kit.title));
    set("adsKitIntro", kit.intro);
    const lb = document.getElementById("adsLeadBtn");
    if (lb) lb.style.display = API_URL ? "inline-flex" : "none";
    set(
      "adsKitTiers",
      (kit.plans || [])
        .map(
          (p) => `
        <div class="tier-box ${p.featured ? "featured" : ""}">
          <strong style="color:var(--brand-gold); font-size:0.78rem; text-transform:uppercase;">${escapeHtml(p.name)}${p.flag ? " • " + escapeHtml(p.flag) : ""}</strong>
          <div style="font-size:1.35rem; font-weight:800; margin:4px 0;">R$ ${escapeHtml(String(p.price))} <span style="font-size:0.75rem; font-weight:400;">/ ${escapeHtml(p.unit)}</span></div>
          <p style="font-size:0.78rem; opacity:0.85;">${escapeHtml(p.desc)}</p>
        </div>`
        )
        .join("")
    );
  }

  function getDefaultSponsors() {
    return [
      {
        id: "sp-1",
        client: "Padaria & Confeitaria Seu Tobias",
        plan: "Destaque Página Inteira (R$ 120)",
        amount: 120,
        status: "Pago",
        contact: "5579999990001"
      },
      {
        id: "sp-2",
        client: "Farmácia Popular Vida & Saúde",
        plan: "Destaque Página Inteira (R$ 120)",
        amount: 120,
        status: "Pago",
        contact: "5579999990002"
      },
      {
        id: "sp-3",
        client: "Ótica Visão Clara",
        plan: "Publieditorial + Reels (R$ 220)",
        amount: 220,
        status: "Pago",
        contact: "5579999990010"
      },
      {
        id: "sp-4",
        client: "Pizzaria Forno da Praça",
        plan: "Plano Guia & Rodapé (R$ 49)",
        amount: 49,
        status: "Pendente",
        contact: "5579999990009"
      }
    ];
  }

  // Catálogo oficial de categorias do Guia (ordem = ordem dos filtros).
  // Só aparecem nos filtros as categorias que têm ao menos um cadastro.
  const CATEGORY_META = [
    { slug: "alimentacao", label: "Mercados & Padarias", icon: "🛒" },
    { slug: "restaurantes", label: "Restaurantes & Lanches", icon: "🍽️" },
    { slug: "saude", label: "Saúde & Farmácias", icon: "🩺" },
    { slug: "hospedagem", label: "Hospedagem", icon: "🏨" },
    { slug: "beleza", label: "Beleza & Estética", icon: "💇" },
    { slug: "lojas", label: "Lojas & Varejo", icon: "🛍️" },
    { slug: "veiculos", label: "Veículos & Oficinas", icon: "🚗" },
    { slug: "bancos", label: "Bancos", icon: "🏦" },
    { slug: "educacao", label: "Educação", icon: "🎓" },
    { slug: "pets", label: "Pet Shops", icon: "🐾" },
    { slug: "reparos", label: "Chaveiros & Reparos", icon: "🔑" },
    { slug: "profissionais", label: "Profissionais Liberais", icon: "⚡" }
  ];
  // Cor de texto legível (contraste AA) sobre um fundo hexadecimal
  function readableOn(hex) {
    const h = String(hex || "").replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(h)) return "#fff";
    const lum = [0, 2, 4].map((i) => {
      const v = parseInt(h.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    const L = 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
    return 1.05 / (L + 0.05) >= 4.5 ? "#fff" : "#1c1917";
  }
  const categoryLabel = (slug) => (CATEGORY_META.find((c) => c.slug === slug) || {}).label || "Comércio Local";
  const categoryOptionsHtml = (withIcons) =>
    CATEGORY_META.map((c) => `<option value="${c.slug}">${withIcons ? c.icon + " " : ""}${c.label}</option>`).join("");

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.edition && parsed.directory) {
          if (!parsed.sponsors) parsed.sponsors = getDefaultSponsors();
          if (!parsed.adsKit) parsed.adsKit = getDefaultAdsKit();
          if (!parsed.roles) parsed.roles = getDefaultRoles();
          if (!parsed.users) parsed.users = getDefaultUsers();
          if (!parsed.whatsappConfig) parsed.whatsappConfig = getDefaultWhatsappConfig();
          if (!parsed.auditLogs) parsed.auditLogs = getDefaultAuditLogs();
          // Garante que os novos módulos estejam presentes no perfil Admin
          const adminRole = parsed.roles.find((r) => r.id === "role-admin");
          if (adminRole) {
            adminRole.permissions = ALL_MODULES.map((m) => m.id);
          }
          if (!parsed.editionsCatalog || parsed.editionsCatalog.length < 6) {
            parsed.editionsCatalog = JSON.parse(JSON.stringify(window.TOBIAS_DATA.editionsCatalog || []));
          }
          if (!parsed.activeEditionId) parsed.activeEditionId = "ed-14";
          mergeNewDataItems(parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Erro ao carregar estado salvo:", e);
    }
    const clone = JSON.parse(JSON.stringify(window.TOBIAS_DATA));
    clone.sponsors = getDefaultSponsors();
    clone.adsKit = getDefaultAdsKit();
    clone.roles = getDefaultRoles();
    clone.users = getDefaultUsers();
    clone.whatsappConfig = getDefaultWhatsappConfig();
    clone.auditLogs = getDefaultAuditLogs();
    clone.activeEditionId = "ed-14";
    return clone;
  }

  // Quando o data.js ganha itens novos (dataVersion maior), acrescenta ao estado
  // salvo no navegador apenas os itens cujo "id" ainda não existe — sem apagar
  // nada do que foi editado pelo CMS.
  function mergeNewDataItems(saved) {
    const base = window.TOBIAS_DATA || {};
    const target = base.dataVersion || 1;
    if ((saved.dataVersion || 1) >= target) return;
    const gone = new Set(base.removedIds || []);
    if (gone.size) {
      ["directory", "essentialSchedules", "stories", "utilityNews", "peopleStories", "promotions", "events", "classifieds"].forEach((key) => {
        if (Array.isArray(saved[key])) saved[key] = saved[key].filter((it) => !(it && gone.has(it.id)));
      });
    }
    ["directory", "essentialSchedules", "stories", "utilityNews", "peopleStories", "promotions", "events", "classifieds"].forEach((key) => {
      if (!Array.isArray(base[key])) return;
      if (!Array.isArray(saved[key])) saved[key] = [];
      const have = new Set(saved[key].map((it) => it && it.id));
      base[key].forEach((it) => {
        if (!it || !it.id) return;
        if (!have.has(it.id)) {
          saved[key].push(JSON.parse(JSON.stringify(it)));
          return;
        }
        // item corrigido no data.js (campo "rev" maior): substitui a cópia antiga
        const idx = saved[key].findIndex((s) => s && s.id === it.id);
        if ((it.rev || 1) > ((saved[key][idx] && saved[key][idx].rev) || 1)) {
          saved[key][idx] = JSON.parse(JSON.stringify(it));
        }
      });
    });
    if (base.edition && saved.edition && saved.edition.mapsRegion === undefined) {
      saved.edition.mapsRegion = base.edition.mapsRegion || "";
    }
    saved.dataVersion = target;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (e) {}
  }

  function loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  let STATE = loadState();
  let CURRENT_USER = loadSession();

  // --------------------------------------------------------------------------
  // SINCRONIZAÇÃO COM O SERVIDOR (Google Apps Script) — opcional
  // Visitantes leem o conteúdo publicado; o Gestão grava com senha.
  // --------------------------------------------------------------------------
  const API_URL = String((window.TOBIAS_CONFIG && window.TOBIAS_CONFIG.apiUrl) || "").trim();
  const SYNC_PW_KEY = "tobias_sync_pw";
  const SHARED_KEYS = [
    "dataVersion", "edition", "stories", "directory", "utilityNews", "essentialSchedules",
    "peopleStories", "promotions", "events", "classifieds", "flipbookPages", "editionsCatalog",
    "adsKit", "whatsappConfig", "activeEditionId"
  ];
  let lastSynced = "";
  let pushTimer = null;
  let pullPromise = Promise.resolve();

  function sharedSlice() {
    const o = {};
    SHARED_KEYS.forEach((k) => {
      if (STATE[k] !== undefined) o[k] = STATE[k];
    });
    return o;
  }

  function syncToast(msg, bad) {
    let t = document.getElementById("syncToast");
    if (!t) {
      t = document.createElement("div");
      t.id = "syncToast";
      t.style.cssText =
        "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:99999;padding:10px 18px;border-radius:999px;font:600 0.85rem 'Plus Jakarta Sans',sans-serif;color:#fff;box-shadow:0 6px 24px rgba(0,0,0,.25);transition:opacity .3s;";
      document.body.appendChild(t);
    }
    t.style.background = bad ? "#b91c1c" : "#15803d";
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(t._h);
    t._h = setTimeout(() => (t.style.opacity = "0"), 3500);
  }

  function pullRemote() {
    if (!API_URL) return Promise.resolve();
    pullPromise = fetch(API_URL + (API_URL.includes("?") ? "&" : "?") + "t=" + Date.now())
      .then((r) => r.json())
      .then((j) => {
        if (!j || !j.ok || !j.data) {
          lastSynced = JSON.stringify(sharedSlice());
          return;
        }
        const remote = j.data;
        SHARED_KEYS.forEach((k) => {
          if (remote[k] !== undefined) STATE[k] = remote[k];
        });
        STATE.dataVersion = remote.dataVersion || 1;
        mergeNewDataItems(STATE); // acrescenta itens novos do data.js, se houver
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
        } catch (e) {}
        lastSynced = JSON.stringify(sharedSlice());
        renderAll();
      })
      .catch((e) => console.warn("Servidor indisponível, usando dados locais:", e));
    return pullPromise;
  }

  function schedulePush() {
    if (!API_URL || !CURRENT_USER) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushRemote, 700);
  }

  function getSyncPw() {
    let pw = "";
    try {
      pw = sessionStorage.getItem(SYNC_PW_KEY) || "";
    } catch (e) {}
    if (!pw) pw = window.prompt("Senha de gestão do servidor (Google Apps Script):") || "";
    return pw;
  }

  // Chamada ao servidor. opts.auth => envia a senha de gestão (pede uma vez por sessão).
  async function api(action, payload, opts) {
    opts = opts || {};
    if (!API_URL) return { ok: false, error: "Servidor não configurado" };
    const body = Object.assign({ action }, payload || {});
    if (opts.auth) {
      const pw = getSyncPw();
      if (!pw) return { ok: false, error: "Sem senha" };
      body.password = pw;
    }
    try {
      const r = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(body),
        keepalive: !!opts.keepalive
      });
      const j = await r.json();
      if (opts.auth) {
        try {
          if (j && j.ok) sessionStorage.setItem(SYNC_PW_KEY, body.password);
          else if (j && /senha/i.test(j.error || "")) sessionStorage.removeItem(SYNC_PW_KEY);
        } catch (e) {}
      }
      return j || { ok: false, error: "Resposta vazia" };
    } catch (e) {
      return { ok: false, error: "Sem conexão com o servidor" };
    }
  }

  async function pushRemote() {
    await pullPromise;
    const slice = sharedSlice();
    const snap = JSON.stringify(slice);
    if (snap !== lastSynced) {
      const j = await api("saveContent", { data: slice }, { auth: true });
      if (j && j.ok) {
        lastSynced = snap;
        syncToast("✓ Publicado para todos os visitantes");
      } else {
        syncToast("Servidor recusou: " + ((j && j.error) || "erro") + " — salvo só neste navegador.", true);
      }
    }
    await pushSponsors();
  }

  // Contratos publicitários: privados, ficam na aba "Contratos" da planilha (nunca no JSON público)
  let sponsorsLoaded = false;
  let sponsorsLoading = false;
  let lastSponsors = "";
  async function pushSponsors() {
    if (!sponsorsLoaded) return;
    const snap = JSON.stringify(STATE.sponsors || []);
    if (snap === lastSponsors) return;
    const j = await api("saveSponsors", { rows: STATE.sponsors || [] }, { auth: true });
    if (j && j.ok) {
      lastSponsors = snap;
      syncToast("✓ Contratos salvos na planilha");
    } else syncToast("Contratos não salvos: " + ((j && j.error) || "erro"), true);
  }
  async function loadSponsorsFromSheet() {
    const j = await api("getSponsors", {}, { auth: true });
    if (!j || !j.ok) {
      syncToast("Não foi possível ler os contratos: " + ((j && j.error) || "erro"), true);
      return false;
    }
    if (j.rows.length) {
      STATE.sponsors = j.rows.map((r) => ({
        id: r.ID,
        client: r.Lojista,
        plan: r.Plano,
        amount: Number(r.Valor) || 0,
        status: r.Status,
        contact: r.WhatsApp
      }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
      } catch (e) {}
    }
    sponsorsLoaded = true;
    lastSponsors = JSON.stringify(STATE.sponsors || []);
    if (!j.rows.length && (STATE.sponsors || []).length) {
      lastSponsors = ""; // planilha vazia: envia o que existe localmente na próxima gravação
      await pushSponsors();
    }
    return true;
  }

  // Métricas de uso (anônimas): contagem de cliques por comércio, enviada em lotes
  let metricQueue = [];
  function track(e, id, n) {
    if (!API_URL || CURRENT_USER) return; // não conta cliques da equipe
    metricQueue.push({ e, id: id || "site", n: n || "" });
    if (metricQueue.length >= 25) flushMetrics();
  }
  function flushMetrics(useBeacon) {
    if (!API_URL || !metricQueue.length) return;
    const events = metricQueue.splice(0, 60);
    const payload = JSON.stringify({ action: "track", events });
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(API_URL, new Blob([payload], { type: "text/plain;charset=utf-8" }));
    } else {
      api("track", { events }, { keepalive: true });
    }
  }
  setInterval(() => flushMetrics(false), 20000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushMetrics(true);
  });
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest && ev.target.closest("[data-track]");
    if (el) track(el.getAttribute("data-track"), el.getAttribute("data-id"), el.getAttribute("data-name"));
  });
  try {
    if (!sessionStorage.getItem("tobias_visit")) {
      sessionStorage.setItem("tobias_visit", "1");
      setTimeout(() => track("visit", "site", "Visitas ao site"), 1500);
    }
  } catch (e) {}

  let currentCategory = "todos";
  // Guia do Comércio: quantos cards aparecem antes do botão "Ver mais"
  const DIR_PAGE = 12;
  let directoryLimit = DIR_PAGE;
  let categoriesExpanded = false;
  let searchQuery = "";
  let currentFlipPage = 1;
  let currentAdminTab = "edition";
  let auditFilterUser = "todos";

  // Registra automaticamente no Log de Auditoria qualquer acesso ou alteração feita por qualquer perfil
  function logAction(moduleName, actionTitle, detailsText, customUserObj) {
    if (!STATE.auditLogs) STATE.auditLogs = [];
    const actor = customUserObj || CURRENT_USER;
    let roleName = "Visitante / Morador";
    if (actor) {
      const r = (STATE.roles || []).find((rl) => rl.id === actor.roleId);
      if (r) roleName = r.name;
    }
    STATE.auditLogs.unshift({
      id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      timestamp: new Date().toLocaleString("pt-BR"),
      username: actor ? actor.username : "publico",
      fullName: actor ? actor.fullName : "Morador via Portal",
      roleName: roleName,
      module: moduleName,
      action: actionTitle,
      details: detailsText
    });
    if (STATE.auditLogs.length > 250) {
      STATE.auditLogs = STATE.auditLogs.slice(0, 250);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
    renderAll();
    schedulePush();
  }

  function saveSession(userObj) {
    CURRENT_USER = userObj;
    if (userObj) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userObj));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  function getActiveRole() {
    if (!CURRENT_USER) return null;
    return (
      STATE.roles.find((r) => r.id === CURRENT_USER.roleId) || {
        id: "role-guest",
        name: "Convidado",
        permissions: ["utility"]
      }
    );
  }

  function hasPermission(permId) {
    const role = getActiveRole();
    if (!role) return false;
    return role.permissions.includes(permId);
  }

  function renderAll() {
    renderEditionsStand();
    renderTickerAndHero();
    renderStoriesBar();
    renderDirectory();
    renderUtilitySection();
    renderPeopleSection();
    renderPromotions();
    renderEvents();
    renderClassifieds();
    renderAdsKit();
    renderFlipbookPage(currentFlipPage);
    renderAdminView();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    renderAll();
    pullRemote();
    setupEventListeners();
    setupHorizontalScrollers();
  });

  // Banca de edições do topo: exibe apenas as edições que cabem inteiras na
  // largura disponível e esconde o restante atrás do botão "Todas (N)".
  // Funciona igual com 6 ou 60 edições — nenhum botão fica cortado.
  function fitEditionsShelf() {
    const shelf = document.getElementById("editionsTopShelf");
    if (!shelf || !shelf.offsetParent) return;
    const pills = Array.from(shelf.querySelectorAll(".edition-switch-pill:not(.shelf-more)"));
    const more = shelf.querySelector(".shelf-more");
    if (!more) return;
    pills.forEach((p) => (p.hidden = false));
    more.hidden = false;
    shelf.classList.add("measuring");
    const gap = parseFloat(getComputedStyle(shelf).columnGap) || 8;
    const avail = shelf.clientWidth;
    const moreW = more.offsetWidth + gap;
    let used = 0;
    let shown = 0;
    pills.forEach((p, i) => {
      const w = p.offsetWidth + gap;
      const isLast = i === pills.length - 1;
      const need = used + w + (isLast ? 0 : moreW);
      // A edição ativa (primeira) sempre aparece; o texto dela encurta com "…" se preciso.
      if (i === 0 || (shown === i && need <= avail)) {
        used += w;
        shown++;
      } else {
        p.hidden = true;
      }
    });
    more.hidden = shown === pills.length;
    shelf.classList.remove("measuring");
  }

  let shelfFitQueued = false;
  function scheduleShelfFit() {
    if (shelfFitQueued) return;
    shelfFitQueued = true;
    // espera os ícones SVG e as fontes ocuparem o espaço final antes de medir
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        shelfFitQueued = false;
        fitEditionsShelf();
      })
    );
  }

  window.addEventListener("resize", scheduleShelfFit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleShelfFit);

  // Menu e banca de edições: esmaece só a borda que tem conteúdo escondido
  // e permite rolar com a roda do mouse no computador.
  function setupHorizontalScrollers() {
    const FADE = "36px";
    document.querySelectorAll(".h-scroll").forEach((el) => {
      const update = () => {
        const max = el.scrollWidth - el.clientWidth;
        el.style.setProperty("--fade-l", el.scrollLeft > 2 ? FADE : "0px");
        el.style.setProperty("--fade-r", max - el.scrollLeft > 2 ? FADE : "0px");
      };
      el.addEventListener("scroll", update, { passive: true });
      el.addEventListener(
        "wheel",
        (e) => {
          if (el.scrollWidth <= el.clientWidth || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        },
        { passive: false }
      );
      window.addEventListener("resize", update);
      new MutationObserver(update).observe(el, { childList: true, subtree: true });
      update();
    });
  }

  // --------------------------------------------------------------------------
  // TEMA CLARO / ESCURO
  // --------------------------------------------------------------------------
  function initTheme() {
    const saved = localStorage.getItem("tobias_theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    updateThemeIcon(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("tobias_theme", next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById("themeToggleBtn");
    if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  // --------------------------------------------------------------------------
  // BANCA DIGITAL DE EDIÇÕES (6 EDIÇÕES QUINZENAIS #14 A #19)
  // --------------------------------------------------------------------------
  function renderEditionsStand() {
    const catalog = STATE.editionsCatalog || [];
    const activeId = STATE.activeEditionId || "ed-14";

    // Contadores de edições espalhados pela página (menu, título do Acervo)
    document.querySelectorAll("[data-edition-count]").forEach((el) => {
      el.textContent = catalog.length;
    });

    // 1. Barra horizontal no topo — edição ativa primeiro, depois as mais recentes.
    //    Só aparecem as que cabem inteiras; o resto fica no botão "Todas (N)".
    const topShelf = document.getElementById("editionsTopShelf");
    if (topShelf) {
      const active = catalog.find((ed) => ed.id === activeId);
      const others = catalog.filter((ed) => ed.id !== activeId).reverse();
      const ordered = (active ? [active] : []).concat(others);
      topShelf.innerHTML =
        ordered
          .map(
            (ed) => `
        <button class="edition-switch-pill ${ed.id === activeId ? "active" : ""}"
                onclick="window.TobiasApp.selectEdition('${ed.id}')" title="${escapeAttr(ed.shortLabel)}">
          🗞️ <span class="pill-text">${ed.shortLabel}</span>
        </button>
      `
          )
          .join("") +
        `<a href="#acervo-edicoes" class="edition-switch-pill shelf-more"
            onclick="window.TobiasApp.switchMode('portal')">
          <span class="more-long">Todas as edições</span><span class="more-short">Todas</span> (${catalog.length}) →
        </a>`;
      scheduleShelfFit();
    }

    // 2. Grade de Capas da Banca Digital
    const standGrid = document.getElementById("editionsStandGrid");
    if (standGrid) {
      standGrid.innerHTML = catalog
        .map((ed) => {
          const isCurrent = ed.id === activeId;
          return `
          <article class="edition-cover-card ${isCurrent ? "active-edition" : ""}">
            <div class="edition-cover-thumb" style="background-image:url('${ed.coverStory.image}')">
              <div class="ed-chips">
                ${isCurrent
                  ? '<span class="ed-chip ed-chip--live"><i class="ed-live-dot"></i>Lendo agora</span>'
                  : `<span class="ed-chip">${ed.badge}</span>`}
                <span class="ed-number">${String(ed.number).split("•")[0].trim()}</span>
              </div>
              <div>
                <div class="ed-meta">${ed.periodicity}</div>
                <h3 class="ed-title">${ed.coverStory.title}</h3>
              </div>
            </div>
            <div class="edition-cover-body">
              <p style="font-size:0.83rem; color:var(--text-secondary);">
                ${ed.coverStory.lead}
              </p>
              <div style="display:flex; gap:8px; margin-top:auto; padding-top:8px; border-top:1px solid var(--border-color);">
                <button class="btn ${isCurrent ? "btn-primary" : "btn-outline"}" style="flex:1; padding:8px 10px; font-size:0.78rem;"
                        onclick="window.TobiasApp.selectEdition('${ed.id}', 'portal')">
                  ${isCurrent ? "✓ Edição Ativa na Capa" : "📰 Carregar no Portal"}
                </button>
                <button class="btn btn-outline" style="padding:8px 10px; font-size:0.78rem;"
                        onclick="window.TobiasApp.selectEdition('${ed.id}', 'flipbook')" title="Folhear as 10 páginas desta edição">
                  📖 Folhear
                </button>
              </div>
            </div>
          </article>
        `;
        })
        .join("");
    }
  }

  // --------------------------------------------------------------------------
  // TICKER & HERO DE CAPA
  // --------------------------------------------------------------------------
  function renderTickerAndHero() {
    const tickerEl = document.getElementById("urgentTickerText");
    if (tickerEl) tickerEl.textContent = STATE.edition.urgentTicker;

    const editionMetaEl = document.getElementById("headerEditionMeta");
    if (editionMetaEl) {
      editionMetaEl.innerHTML = `📍 <strong>${STATE.edition.number} • ${STATE.edition.periodicity}</strong> • Leitura Mobile-First (${STATE.flipbookPages.length} Páginas)`;
    }

    const pulseKicker = document.getElementById("heroPulseKicker");
    if (pulseKicker) {
      pulseKicker.textContent = `Giro Rápido • ${STATE.edition.number}`;
    }

    const pulseListEl = document.getElementById("heroPulseList");
    if (pulseListEl) {
      const activeCatEd = (STATE.editionsCatalog || []).find((e) => e.id === STATE.activeEditionId);
      const pulses =
        (activeCatEd && activeCatEd.quickPulse) ||
        (STATE.editionsCatalog && STATE.editionsCatalog[0] && STATE.editionsCatalog[0].quickPulse) ||
        [];
      pulseListEl.innerHTML = pulses
        .map(
          (p) => `
        <div class="pulse-item">
          <div class="pulse-icon">${p.icon}</div>
          <div>
            <span class="pulse-meta">${p.meta}</span>
            <div class="pulse-title">${p.title}</div>
          </div>
        </div>
      `
        )
        .join("");
    }

    const coverEl = document.getElementById("heroCoverBox");
    if (coverEl) {
      const c = STATE.edition.coverStory;
      coverEl.style.backgroundImage = `url('${c.image}')`;
      coverEl.innerHTML = `
        <div class="cover-content">
          <div class="cover-badges">
            <span class="tag-badge">${c.kicker}</span>
            <span class="tag-badge secondary">⏱️ ${c.readingTime}</span>
          </div>
          <h1 class="cover-title">${c.title}</h1>
          <p class="cover-lead">${c.lead}</p>
          <div class="cover-actions">
            <button class="btn btn-primary" onclick="window.TobiasApp.openCoverModal()">📖 Ler Reportagem</button>
            <button class="btn btn-glass" onclick="window.TobiasApp.switchMode('flipbook')">📱 Folhear Revista (${STATE.flipbookPages.length} Pág)</button>
          </div>
        </div>
      `;
    }
  }

  // --------------------------------------------------------------------------
  // STORIES DO BAIRRO
  // --------------------------------------------------------------------------
  function renderStoriesBar() {
    const container = document.getElementById("storiesBar");
    if (!container) return;

    // Cores de fundo dos cards (texto branco com contraste AA). Cada story pode
    // definir a sua em "color" ou uma foto em "image" no data.js.
    const TONES = ["#03326f", "#0b4c9e", "#feb202", "#ff9c0d", "#012551", "#0b4c9e"];

    container.innerHTML = STATE.stories
      .map((st, i) => {
        const bg = st.image
          ? `background-color:${TONES[i % TONES.length]}; background-image:url('${escapeAttr(st.image)}');`
          : `background-color:${escapeAttr(st.color || TONES[i % TONES.length])};`;
        return `
      <button class="story-card ${st.image ? "has-photo" : ""} ${!st.image && readableOn(st.color || TONES[i % TONES.length]) !== "#fff" ? "story-light" : ""}" style="${bg}"
              onclick="window.TobiasApp.openStory('${st.id}')"
              aria-label="${escapeAttr(st.label + ": " + (st.title || ""))}">
        <span class="story-card-art" aria-hidden="true">${st.icon}</span>
        <span class="story-card-top">
          <span class="story-card-icon">${st.icon}</span>
        </span>
        <span class="story-card-text">
          <span class="story-card-kicker">${st.label}</span>
          <span class="story-card-title">${st.title || st.label}</span>
        </span>
      </button>
    `;
      })
      .join("");
  }

  // --------------------------------------------------------------------------
  // 1. GUIA DO COMÉRCIO E SERVIÇOS
  // --------------------------------------------------------------------------
  function renderDirectory() {
    const grid = document.getElementById("directoryGrid");
    if (!grid) return;

    renderCategoryPills();

    // Busca sem acento e sem diferenciar maiúsculas ("farmacia" acha "Farmácia")
    const norm = (s) =>
      String(s || "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase();
    const q = norm(searchQuery.trim());
    const filtered = STATE.directory
      .filter((item) => {
        const matchCat = currentCategory === "todos" || item.catSlug === currentCategory;
        const matchText =
          !q ||
          [item.name, item.category, item.description, item.address, item.status].some((f) => norm(f).includes(q));
        return matchCat && matchText;
      })
      // Serviços essenciais ("priority", ex.: UPA) primeiro, depois patrocinados;
      // o resto mantém a ordem de cadastro
      .sort((a, b) => (b.priority || 0) - (a.priority || 0) || (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0));

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 32px; background: var(--bg-surface); border-radius: 12px; border: 1px dashed var(--border-color);">
          <p style="font-size:1.05rem; font-weight:700;">Nenhum comércio ou profissional encontrado para "${searchQuery}".</p>
          <p style="color:var(--text-muted); font-size:0.88rem; margin-top:6px;">Tente buscar por padaria, chaveiro, eletricista, farmácia ou pet shop.</p>
        </div>
      `;
      return;
    }

    const w = STATE.whatsappConfig || getDefaultWhatsappConfig();
    const storeTpl = w.storeTemplate || "Olá! Vi o contato de *{LOJA}* no Guia da Tobias Magazine ({EDICAO}) e gostaria de atendimento.";

    const visible = filtered.slice(0, directoryLimit);
    const remaining = filtered.length - visible.length;

    grid.innerHTML = visible
      .map((biz) => {
        const msg = storeTpl
          .replace(/\{LOJA\}/g, biz.name)
          .replace(/\{EDICAO\}/g, STATE.edition.number);
        const mapsHref = buildMapsUrl(biz.mapsUrl, biz.name, biz.address);
        // Profissionais que só atendem em domicílio não têm endereço para "Como chegar"
        const hasPlace = !!biz.mapsUrl || !/^\s*atendimento (em|a) domic/i.test(biz.address || "");
        // O fallback fica sempre por baixo; a foto (se houver) cobre o card e some se o link quebrar.
        const photo =
          `<div class="biz-photo-fallback">${biz.avatar || "🏪"}<small>Foto em breve</small></div>` +
          (biz.photo
            ? `<img src="${escapeAttr(biz.photo)}" alt="Fachada de ${escapeAttr(biz.name)}" loading="lazy" decoding="async"
                    onerror="this.style.display='none'" />`
            : "");
        return `
      <article class="biz-card ${biz.sponsored ? "sponsored" : ""}">
        ${biz.sponsored ? '<span class="sponsored-ribbon">★ Destaque do Bairro</span>' : ""}
        <div class="biz-photo">
          ${photo}
          <span class="status-dot">● ${biz.status}</span>
        </div>
        <div class="biz-body">
          <div>
            <div class="biz-header">
              <div class="biz-avatar">${biz.avatar || "🏪"}</div>
              <div>
                <span class="biz-category">${CATEGORY_META.some((c) => c.slug === biz.catSlug) ? categoryLabel(biz.catSlug) : biz.category}</span>
                <h3 class="biz-name">${biz.name}</h3>
              </div>
            </div>
            <p class="biz-desc" style="margin-top:10px;">${biz.description}</p>
          </div>
          <div class="biz-meta">
            ${hasPlace
              ? `<a href="${mapsHref}" target="_blank" rel="noopener" title="Abrir endereço no Google Maps">📍 <span>${biz.address}</span></a>`
              : `<span>📍 <span>${biz.address}</span></span>`}
            ${biz.hours ? `<span>🕒 <span>${biz.hours}</span></span>` : ""}
            ${biz.landline
              ? `<a href="tel:+${String(biz.landline).replace(/\D/g, "")}" title="Ligar">📞 <span>${formatPhoneBR(biz.landline)}</span></a>`
              : ""}
            ${biz.instagram
              ? `<a href="https://www.instagram.com/${escapeAttr(String(biz.instagram).replace(/^@/, ""))}/" target="_blank" rel="noopener">${
                  window.TMIcons ? TMIcons.svg("instagram") : ""
                } <span>@${String(biz.instagram).replace(/^@/, "")}</span></a>`
              : ""}
            ${biz.website
              ? `<a href="${escapeAttr(biz.website)}" target="_blank" rel="noopener">🌐 <span>${String(biz.website).replace(/^https?:\/\//, "").replace(/\/$/, "")}</span></a>`
              : ""}
          </div>
          <div class="biz-actions" style="${(hasPlace ? 1 : 0) + (biz.phone || biz.landline ? 1 : 0) < 2 ? "grid-template-columns:1fr;" : ""}">
            ${hasPlace
              ? `<a class="btn btn-outline" href="${mapsHref}" target="_blank" rel="noopener"
               data-track="maps" data-id="${escapeAttr(biz.id)}" data-name="${escapeAttr(biz.name)}"
               aria-label="Como chegar até ${escapeAttr(biz.name)} pelo Google Maps">
              ${window.TMIcons ? TMIcons.svg("navigation") : "📍"} Como chegar
            </a>`
              : ""}
            ${biz.phone
              ? `<a class="btn btn-whatsapp"
               href="https://wa.me/${biz.phone}?text=${encodeURIComponent(msg)}"
               data-track="whatsapp" data-id="${escapeAttr(biz.id)}" data-name="${escapeAttr(biz.name)}"
               target="_blank" rel="noopener">
              ${window.TMIcons ? TMIcons.svg("whatsapp") : "💬"} WhatsApp
            </a>`
              : biz.landline
              ? `<a class="btn btn-primary" href="tel:+${String(biz.landline).replace(/\D/g, "")}"
                 data-track="call" data-id="${escapeAttr(biz.id)}" data-name="${escapeAttr(biz.name)}"
                 aria-label="Ligar para ${escapeAttr(biz.name)}">
              ${window.TMIcons ? TMIcons.svg("phone") : "📞"} Ligar
            </a>`
              : ""}
          </div>
        </div>
      </article>
    `;
      })
      .join("") +
      (remaining > 0
        ? `<div class="dir-more">
            <button class="btn btn-outline" onclick="window.TobiasApp.showMoreDirectory()">
              Ver mais ${Math.min(remaining, DIR_PAGE)} de ${remaining} restantes
            </button>
            <span class="dir-more-count">Mostrando ${visible.length} de ${filtered.length}</span>
          </div>`
        : "");
  }

  // Filtros do Guia: gerados a partir das categorias realmente cadastradas.
  // Computador: uma linha só; o que não cabe vai para o menu "Mais".
  // Celular: fila deslizante. Categorias com mais cadastros aparecem primeiro.
  function renderCategoryPills() {
    const box = document.getElementById("categoryPills");
    if (!box) return;
    const counts = {};
    STATE.directory.forEach((b) => (counts[b.catSlug] = (counts[b.catSlug] || 0) + 1));
    const known = CATEGORY_META.filter((c) => counts[c.slug]);
    const extra = Object.keys(counts)
      .filter((s) => !CATEGORY_META.some((c) => c.slug === s))
      .map((s) => {
        const any = STATE.directory.find((b) => b.catSlug === s);
        return { slug: s, label: (any && any.category) || s, icon: (any && any.avatar) || "🏪" };
      });
    const cats = known
      .concat(extra)
      .map((c, i) => ({ ...c, n: counts[c.slug], i }))
      .sort((a, b) => b.n - a.n || a.i - b.i);
    if (currentCategory !== "todos" && !counts[currentCategory]) currentCategory = "todos";

    // Quadrados de categoria: ícone, nome e quantidade de locais
    const total = STATE.directory.length;
    const tile = (slug, icon, label, n) => {
      const on = currentCategory === slug;
      return `<button class="cat-tile ${on ? "active" : ""}" aria-pressed="${on}"
                 onclick="window.TobiasApp.filterCategory('${slug}')">
          <span class="cat-tile-icon">${icon}</span>
          <span class="cat-tile-name">${label}</span>
          <span class="cat-tile-count">${n} ${n === 1 ? "local" : "locais"}</span>
          ${on ? '<span class="cat-tile-check" aria-hidden="true">✓</span>' : ""}
        </button>`;
    };
    box.innerHTML =
      tile("todos", "🏪", "Todos", total) +
      cats.map((c) => tile(c.slug, c.icon, c.label, c.n)).join("") +
      `<button class="cat-tile cat-tile-more" hidden onclick="window.TobiasApp.toggleCategoryTiles()">
         <span class="cat-tile-icon"></span><span class="cat-tile-name"></span><span class="cat-tile-count"></span>
       </button>`;
    layoutCategoryTiles();
  }

  // Mostra no máximo 2 linhas de quadrados (conforme a largura); o último vira
  // "Ver todas". A categoria escolhida sempre fica visível. Nunca sobra quadrado sozinho.
  function layoutCategoryTiles() {
    const box = document.getElementById("categoryPills");
    if (!box || !box.classList.contains("category-tiles")) return;
    const tiles = Array.from(box.querySelectorAll(".cat-tile:not(.cat-tile-more)"));
    const more = box.querySelector(".cat-tile-more");
    if (!more) return;
    const cols = getComputedStyle(box).gridTemplateColumns.split(" ").filter(Boolean).length || 3;
    const cap = cols * 2;
    tiles.forEach((t) => t.classList.remove("is-collapsed"));
    if (tiles.length <= cap) {
      more.hidden = true;
      return;
    }
    more.hidden = false;
    if (categoriesExpanded) {
      more.querySelector(".cat-tile-icon").textContent = "←";
      more.querySelector(".cat-tile-name").textContent = "Mostrar menos";
      more.querySelector(".cat-tile-count").textContent = "Recolher categorias";
      more.setAttribute("aria-expanded", "true");
    } else {
      const keep = cap - 1;
      const activeIdx = tiles.findIndex((t) => t.classList.contains("active"));
      tiles.forEach((t, i) => {
        let hide = i >= keep;
        if (activeIdx >= keep) hide = i === activeIdx ? false : i >= keep - 1;
        t.classList.toggle("is-collapsed", hide);
      });
      const hiddenN = tiles.filter((t) => t.classList.contains("is-collapsed")).length;
      more.querySelector(".cat-tile-icon").textContent = "→";
      more.querySelector(".cat-tile-name").textContent = "Ver todas";
      more.querySelector(".cat-tile-count").textContent = `+${hiddenN} categorias`;
      more.setAttribute("aria-expanded", "false");
      if (window.TMIcons) TMIcons.replaceIn(more);
    }
  }

  let tilesLayoutQueued = false;
  window.addEventListener("resize", () => {
    if (tilesLayoutQueued) return;
    tilesLayoutQueued = true;
    requestAnimationFrame(() => {
      tilesLayoutQueued = false;
      layoutCategoryTiles();
    });
  });

  // Computador: mede o espaço e manda para o menu "Mais" as categorias que não cabem.
  function fitCategoryPills() {
    const box = document.getElementById("categoryPills");
    if (!box) return;
    const pills = Array.from(box.querySelectorAll(":scope > .cat-pill[data-slug]"));
    const moreWrap = box.querySelector(".cat-more");
    if (!moreWrap) return;
    const moreBtn = moreWrap.querySelector(".cat-more-btn");
    const items = Array.from(moreWrap.querySelectorAll(".cat-menu-item"));
    pills.forEach((p) => (p.hidden = false));
    moreWrap.hidden = true;

    const mobile = window.matchMedia("(max-width: 720px)").matches;
    if (mobile || !box.offsetParent) {
      const active = box.querySelector(".cat-pill.active");
      if (active && box.scrollWidth > box.clientWidth) {
        box.scrollLeft = Math.max(0, active.offsetLeft - box.offsetLeft - 44);
      }
      return;
    }

    const gap = parseFloat(getComputedStyle(box).columnGap) || 8;
    const avail = box.clientWidth;
    // mede o botão "Mais" já com o maior texto que ele pode exibir
    const curMeta = CATEGORY_META.find((c) => c.slug === currentCategory);
    moreBtn.querySelector(".cat-more-text").textContent = curMeta ? curMeta.label : "Mais";
    moreBtn.querySelector(".cat-more-n").textContent = "99";
    moreWrap.hidden = false;
    const moreW = moreBtn.offsetWidth + gap;
    moreWrap.hidden = true;
    let used = 0;
    const hiddenSlugs = [];
    pills.forEach((p, i) => {
      const w = p.offsetWidth + gap;
      const isLast = i === pills.length - 1;
      if (hiddenSlugs.length === 0 && used + w + (isLast ? 0 : moreW) <= avail) {
        used += w;
      } else {
        p.hidden = true;
        hiddenSlugs.push(p.dataset.slug);
      }
    });
    if (!hiddenSlugs.length) return;
    moreWrap.hidden = false;
    items.forEach((it) => (it.hidden = !hiddenSlugs.includes(it.dataset.slug)));
    const chosen = hiddenSlugs.includes(currentCategory) ? CATEGORY_META.find((c) => c.slug === currentCategory) : null;
    moreBtn.classList.toggle("active", !!chosen);
    moreBtn.querySelector(".cat-more-text").textContent = chosen ? chosen.label : "Mais";
    moreBtn.querySelector(".cat-more-n").textContent = chosen ? counts(currentCategory) : hiddenSlugs.length;
    function counts(slug) {
      return STATE.directory.filter((b) => b.catSlug === slug).length;
    }
  }

  function closeCategoryMenu() {
    const menu = document.querySelector("#categoryPills .cat-menu");
    const btn = document.querySelector("#categoryPills .cat-more-btn");
    if (menu) menu.hidden = true;
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest || !e.target.closest(".cat-more")) closeCategoryMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCategoryMenu();
  });
  let pillsFitQueued = false;
  window.addEventListener("resize", () => {
    if (pillsFitQueued) return;
    pillsFitQueued = true;
    requestAnimationFrame(() => {
      pillsFitQueued = false;
      closeCategoryMenu();
      fitCategoryPills();
    });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitCategoryPills());

  // Link do Google Maps: usa o link próprio do local (Perfil da Empresa no Google)
  // quando informado; senão monta uma busca por nome + endereço + cidade/região.
  function buildMapsUrl(customUrl, name, address) {
    if (customUrl && /^https?:\/\//i.test(customUrl)) return escapeAttr(customUrl);
    const region = (STATE.edition && STATE.edition.mapsRegion) || "";
    const query = [name, address, region].filter(Boolean).join(", ");
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  // 557935414834 -> (79) 3541-4834 | 5579996333737 -> (79) 99633-3737
  function formatPhoneBR(raw) {
    let d = String(raw || "").replace(/\D/g, "");
    if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return raw;
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeAttr(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // --------------------------------------------------------------------------
  // 2. NOTÍCIAS E UTILIDADE PÚBLICA
  // --------------------------------------------------------------------------
  function renderUtilitySection() {
    const newsList = document.getElementById("utilityNewsList");
    const schedBody = document.getElementById("essentialScheduleBody");

    if (newsList) {
      newsList.innerHTML = STATE.utilityNews
        .map(
          (n) => `
        <article class="news-card ${n.level}">
          <div class="news-meta">
            <span>${n.badge}</span>
            <span>${n.date}</span>
          </div>
          <h3 class="news-title">${n.title}</h3>
          <p style="font-size:0.88rem; color:var(--text-secondary);">${n.summary}</p>
          <span style="font-size:0.74rem; color:var(--text-muted); font-weight:600;">Fonte: ${n.source}</span>
        </article>
      `
        )
        .join("");
    }

    if (schedBody) {
      schedBody.innerHTML = STATE.essentialSchedules
        .map(
          (row) => `
        <tr>
          <td><strong>${row.service}</strong></td>
          <td>${row.schedule}</td>
        </tr>
      `
        )
        .join("");
    }
  }

  // --------------------------------------------------------------------------
  // 3. HISTÓRIAS DE MORADORES
  // --------------------------------------------------------------------------
  function renderPeopleSection() {
    const grid = document.getElementById("peopleStoriesGrid");
    if (!grid) return;

    grid.innerHTML = STATE.peopleStories
      .map(
        (p) => `
      <article class="profile-card">
        <div class="profile-img-wrap" style="background-image:url('${p.image}')">
          <div class="profile-quote-badge">${p.quote}</div>
        </div>
        <div class="profile-body">
          <span class="section-kicker">${p.type}</span>
          <h3 style="font-family:var(--font-serif); font-size:1.22rem; font-weight:800;">${p.name}</h3>
          <span style="font-size:0.78rem; color:var(--text-muted); font-weight:700;">${p.role}</span>
          <p style="font-size:0.88rem; color:var(--text-secondary); margin-top:4px;">${p.story}</p>
        </div>
      </article>
    `
      )
      .join("");
  }

  // --------------------------------------------------------------------------
  // 4. ACHADOS E PROMOÇÕES
  // --------------------------------------------------------------------------
  function renderPromotions() {
    const grid = document.getElementById("promotionsGrid");
    if (!grid) return;

    const w = STATE.whatsappConfig || getDefaultWhatsappConfig();
    const couponTpl = w.couponTemplate || "Olá! Quero usar o cupom *{CUPOM}* ({DESCONTO}) na *{LOJA}* que vi na Tobias Magazine!";

    grid.innerHTML = STATE.promotions
      .map((pr) => {
        const msg = couponTpl
          .replace(/\{CUPOM\}/g, pr.code)
          .replace(/\{DESCONTO\}/g, pr.discount)
          .replace(/\{LOJA\}/g, pr.store);
        return `
      <article class="coupon-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px;">
            <span class="discount-badge">${pr.discount}</span>
            <span style="font-size:0.74rem; color:var(--text-muted); font-weight:700;">${pr.store}</span>
          </div>
          <h3 style="font-family:var(--font-serif); font-size:1.05rem; font-weight:800; margin-bottom:6px;">${pr.title}</h3>
          <span style="font-size:0.76rem; color:var(--brand-secondary); font-weight:700;">⏳ ${pr.validUntil}</span>
        </div>
        <div>
          <div class="coupon-code-box">
            <span>CUPOM: ${pr.code}</span>
            <button class="btn btn-outline" style="padding:4px 10px; font-size:0.75rem;"
                    onclick="window.TobiasApp.copyCoupon('${pr.code}', this)">
              📋 Copiar
            </button>
          </div>
          <a class="btn btn-primary" style="width:100%; margin-top:8px; font-size:0.8rem; padding:8px;"
             href="https://wa.me/${pr.phone}?text=${encodeURIComponent(msg)}"
             target="_blank" rel="noopener">
            Resgatar no WhatsApp →
          </a>
        </div>
      </article>
    `;
      })
      .join("");
  }

  // --------------------------------------------------------------------------
  // 5. AGENDA DE EVENTOS
  // --------------------------------------------------------------------------
  function renderEvents() {
    const grid = document.getElementById("eventsGrid");
    if (!grid) return;

    grid.innerHTML = STATE.events
      .map(
        (ev) => `
      <article class="event-card">
        <div class="event-date-box">
          <span class="day">${ev.day}</span>
          <span class="month">${ev.month}</span>
        </div>
        <div>
          <span class="section-kicker">${ev.category}</span>
          <h3 style="font-family:var(--font-serif); font-size:1.08rem; font-weight:800; margin-bottom:4px;">${ev.title}</h3>
          <p style="font-size:0.84rem; color:var(--text-secondary); margin-bottom:6px;">${ev.description}</p>
          <div class="event-meta">
            <span>🕒 ${ev.time}</span>
            <a href="${buildMapsUrl(ev.mapsUrl, ev.location, "")}" target="_blank" rel="noopener"
               title="Ver ${escapeAttr(ev.location)} no Google Maps">📍 ${ev.location}</a>
          </div>
        </div>
      </article>
    `
      )
      .join("");
  }

  // --------------------------------------------------------------------------
  // 6. CLASSIFICADOS LOCAIS
  // --------------------------------------------------------------------------
  function renderClassifieds() {
    const grid = document.getElementById("classifiedsGrid");
    if (!grid) return;

    grid.innerHTML = STATE.classifieds
      .map(
        (cl) => `
      <article class="classified-card">
        <div>
          <span style="display:inline-block; background:${cl.badgeColor || "#03326f"}; color:${readableOn(cl.badgeColor || "#03326f")}; font-size:0.68rem; font-weight:800; padding:2px 8px; border-radius:4px; text-transform:uppercase; margin-bottom:8px;">
            ${cl.category}
          </span>
          <h3 style="font-family:var(--font-serif); font-size:1.05rem; font-weight:800; margin-bottom:6px;">${cl.title}</h3>
          <p style="font-size:0.84rem; color:var(--text-secondary);">${cl.details}</p>
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; border-top:1px solid var(--border-color); padding-top:10px; margin-top:6px;">
          <span class="classified-price">${cl.price}</span>
          <a class="btn btn-outline" style="padding:6px 11px; font-size:0.76rem;"
             href="https://wa.me/${cl.phone}?text=${encodeURIComponent(`Olá! Vi seu anúncio "${cl.title}" nos Classificados da Tobias Magazine.`)}"
             target="_blank" rel="noopener">
            💬 Falar com Morador
          </a>
        </div>
      </article>
    `
      )
      .join("");
  }

  // --------------------------------------------------------------------------
  // MODO FLIPBOOK INTERATIVO (10 PÁGINAS)
  // --------------------------------------------------------------------------
  function renderFlipbookPage(pageNum) {
    const totalFlipPages = STATE.flipbookPages.length;
    currentFlipPage = Math.max(1, Math.min(totalFlipPages, pageNum));
    const pageData = STATE.flipbookPages[currentFlipPage - 1];

    const stage = document.getElementById("magazineStage");
    const counter = document.getElementById("flipPageCounter");
    const progressFill = document.getElementById("flipProgressFill");
    const dotsContainer = document.getElementById("flipPageDots");

    if (counter) counter.textContent = `Página ${currentFlipPage} de ${totalFlipPages}`;
    if (progressFill) progressFill.style.width = `${(currentFlipPage / totalFlipPages) * 100}%`;
    if (dotsContainer) {
      dotsContainer.innerHTML = STATE.flipbookPages
        .map(
          (p) => `
        <button class="page-dot ${p.pageNumber === currentFlipPage ? "active" : ""}"
                onclick="window.TobiasApp.goToPage(${p.pageNumber})">
          ${p.pageNumber}
        </button>
      `
        )
        .join("");
    }

    if (!stage) return;

    stage.innerHTML = `
      <div class="mag-page">
        <div>
          <div class="mag-page-header">
            <span>TOBIAS MAGAZINE • ${STATE.edition.number.toUpperCase()}</span>
            <span>PÁG. ${pageData.pageNumber}/${totalFlipPages}</span>
          </div>

          <span class="section-kicker">${pageData.section}</span>
          <h2 style="font-family:var(--font-serif); font-size:1.65rem; font-weight:900; line-height:1.15; margin:6px 0 8px;">
            ${pageData.title}
          </h2>
          <p style="font-size:0.95rem; font-weight:700; color:var(--brand-secondary); margin-bottom:14px;">
            ${pageData.subtitle}
          </p>

          <div style="background:var(--bg-subtle); padding:14px; border-radius:10px; border-left:4px solid var(--brand-primary); font-size:0.88rem; margin-bottom:16px;">
            ${pageData.highlight}
          </div>

          ${buildFlipbookPageBody(pageData.visualType)}
        </div>

        <div class="mag-page-footer">
          <span>📱 Deslize ou use os botões</span>
          <button class="btn btn-outline" style="padding:5px 10px; font-size:0.74rem;"
                  onclick="window.TobiasApp.shareWhatsAppEdition()">
            📤 Enviar no WhatsApp
          </button>
        </div>
      </div>
    `;
  }

  function buildFlipbookPageBody(type) {
    switch (type) {
      case "cover":
        return `
          <div style="border-radius:12px; overflow:hidden; height:230px; background:url('${STATE.edition.coverStory.image}') center/cover; display:flex; align-items:flex-end; padding:14px; color:#fff; box-shadow:inset 0 -90px 60px rgba(0,0,0,0.75);">
            <div>
              <span class="tag-badge">Destaque da Quinzena</span>
              <h4 style="font-family:var(--font-serif); font-size:1.15rem; margin-top:6px;">${STATE.edition.coverStory.title}</h4>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:12px; font-size:0.8rem;">
            <div style="background:var(--bg-accent-soft); padding:8px 10px; border-radius:8px;"><strong>Pág. 3:</strong> Cortes de Água & UBS</div>
            <div style="background:var(--bg-accent-soft); padding:8px 10px; border-radius:8px;"><strong>Pág. 5-6:</strong> Guia WhatsApp</div>
            <div style="background:var(--bg-accent-soft); padding:8px 10px; border-radius:8px;"><strong>Pág. 8:</strong> Agenda da Praça</div>
            <div style="background:var(--bg-accent-soft); padding:8px 10px; border-radius:8px;"><strong>Pág. 9:</strong> ${STATE.promotions.length} Cupons de Desconto</div>
          </div>
        `;
      case "editorial":
        return `
          <div style="font-size:0.88rem; display:flex; flex-direction:column; gap:10px;">
            <p>Bem-vindo à <strong>${STATE.edition.number} da Tobias Magazine</strong>! Nossa missão é valorizar quem vive, trabalha e empreende no nosso bairro.</p>
            <p><strong>Formato Enxuto Mobile-First:</strong> Seguindo as melhores práticas de revistas digitais modernas, cada edição tem exatamente <strong>${STATE.flipbookPages.length} páginas</strong> de leitura rápida para você folhear no smartphone.</p>
            <div style="background:var(--ok-bg); color:var(--ok-text); padding:12px; border-radius:8px; font-weight:600;">
              ✓ Periodicidade ${STATE.edition.periodicity} • ✓ Botões Clicáveis para WhatsApp • ✓ QR Code nas Lojas Parceiras
            </div>
          </div>
        `;
      case "utility":
        return STATE.utilityNews
          .slice(0, 3)
          .map(
            (u) => `
          <div style="padding:10px; border:1px solid var(--border-color); border-radius:8px; margin-bottom:8px; font-size:0.83rem;">
            <strong style="color:var(--brand-text);">${u.badge} (${u.date})</strong>
            <div style="font-weight:700; margin:2px 0;">${u.title}</div>
            <div style="color:var(--text-secondary);">${u.summary}</div>
          </div>
        `
          )
          .join("");
      case "coverStory":
        return `<div style="font-size:0.86rem; line-height:1.55;">${STATE.edition.coverStory.fullText}</div>`;
      case "directory1":
        return STATE.directory
          .slice(0, 4)
          .map(
            (b) => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-bottom:1px dashed var(--border-color); font-size:0.84rem;">
            <div>
              <strong>${b.avatar || "🏪"} ${b.name}</strong>
              <div style="font-size:0.75rem; color:var(--text-muted);">${b.address} • ${b.hours}</div>
            </div>
            <a class="btn btn-whatsapp" style="padding:5px 10px; font-size:0.74rem;" href="https://wa.me/${b.phone}" target="_blank">WhatsApp</a>
          </div>
        `
          )
          .join("");
      case "directory2":
        return STATE.directory
          .slice(4, 8)
          .map(
            (b) => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-bottom:1px dashed var(--border-color); font-size:0.84rem;">
            <div>
              <strong>${b.avatar || "⚡"} ${b.name}</strong>
              <div style="font-size:0.75rem; color:var(--text-muted);">${b.category} • ${b.status}</div>
            </div>
            <a class="btn btn-whatsapp" style="padding:5px 10px; font-size:0.74rem;" href="https://wa.me/${b.phone}" target="_blank">Chamar</a>
          </div>
        `
          )
          .join("");
      case "people":
        return STATE.peopleStories
          .map(
            (p) => `
          <div style="padding:9px; background:var(--bg-subtle); border-radius:8px; margin-bottom:8px; font-size:0.82rem;">
            <span style="color:var(--brand-text); font-weight:800; font-size:0.7rem; text-transform:uppercase;">${p.type}</span>
            <div style="font-weight:800;">${p.name}</div>
            <div style="font-style:italic; color:var(--text-secondary);">${p.quote}</div>
          </div>
        `
          )
          .join("");
      case "events":
        return STATE.events
          .map(
            (e) => `
          <div style="display:flex; gap:10px; align-items:center; padding:8px 0; border-bottom:1px solid var(--border-color); font-size:0.83rem;">
            <span style="background:var(--brand-navy); color:#fff; padding:4px 8px; border-radius:6px; font-weight:800; font-family:var(--font-mono);">${e.day}/${e.month}</span>
            <div>
              <strong>${e.title}</strong>
              <div style="font-size:0.75rem; color:var(--text-muted);">${e.time} • ${e.location}</div>
            </div>
          </div>
        `
          )
          .join("");
      case "coupons":
        return STATE.promotions
          .map(
            (c) => `
          <div style="padding:8px 10px; border:1.5px dashed var(--brand-primary); border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; font-size:0.82rem;">
            <div>
              <strong style="color:var(--brand-text);">[${c.discount}] ${c.store}</strong>
              <div style="font-size:0.76rem;">Código: <strong>${c.code}</strong></div>
            </div>
            <button class="btn btn-outline" style="padding:4px 8px; font-size:0.72rem;" onclick="window.TobiasApp.copyCoupon('${c.code}', this)">Copiar</button>
          </div>
        `
          )
          .join("");
      case "backcover":
        return `
          <div style="font-size:0.83rem; display:flex; flex-direction:column; gap:8px;">
            ${STATE.classifieds
              .slice(0, 3)
              .map(
                (cl) => `
              <div style="padding:8px; background:var(--bg-subtle); border-radius:6px;">
                <strong>[${cl.category}]</strong> ${cl.title} — <span style="color:var(--brand-secondary); font-weight:800;">${cl.price}</span>
              </div>
            `
              )
              .join("")}
            <div style="background:var(--brand-navy); color:#fff; padding:12px; border-radius:10px; text-align:center; margin-top:6px;">
              <strong>🚀 Anuncie seu Comércio na Próxima Edição!</strong>
              <p style="font-size:0.78rem; opacity:0.9; margin:4px 0 8px;">Cards fixos, Guia WhatsApp, Publieditorial e Cartaz QR Code para sua vitrine.</p>
              <button class="btn btn-primary" style="font-size:0.78rem; padding:6px 12px;" onclick="window.TobiasApp.switchMode('portal'); location.hash='#anuncie-midia';">
                Ver Tabela e Gerar Cartaz QR Code
              </button>
            </div>
          </div>
        `;
      default:
        return "";
    }
  }

  // ==========================================================================
  // AUTENTICAÇÃO (LOGIN) & PAINEL DE GESTÃO COM CONTROLE DE PERFIS (RBAC)
  // ==========================================================================
  function renderAdminView() {
    const loginGate = document.getElementById("adminLoginGate");
    const protectedArea = document.getElementById("adminProtectedArea");
    if (!loginGate || !protectedArea) return;

    if (!CURRENT_USER) {
      loginGate.style.display = "block";
      protectedArea.style.display = "none";
      renderLoginScreen(loginGate);
    } else {
      loginGate.style.display = "none";
      protectedArea.style.display = "block";
      renderAdminDashboard();
    }
  }

  function renderLoginScreen(container) {
    container.innerHTML = `
      <div class="auth-card">
        <div style="text-align:center; margin-bottom:20px;">
          <span class="tag-badge">Acesso Restrito • Equipe & Colaboradores</span>
          <h2 style="font-family:var(--font-serif); font-size:1.65rem; margin-top:10px;">
            🔐 Login da Central de Gestão
          </h2>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;">
            Entre com seu usuário e senha para acessar os módulos atribuídos ao seu perfil.
          </p>
        </div>

        <form id="cmsLoginForm" style="display:flex; flex-direction:column; gap:12px;">
          <div class="cms-field">
            <label>Usuário (Login)</label>
            <input id="loginUsername" name="username" placeholder="Ex: admin, editor, comercial..." required />
          </div>
          <div class="cms-field">
            <label>Senha</label>
            <input id="loginPassword" type="password" name="password" placeholder="Digite sua senha" required />
          </div>
          <div id="loginErrorMsg" style="display:none; color:var(--urgent-text); background:var(--urgent-bg); padding:8px 12px; border-radius:6px; font-size:0.8rem; font-weight:700;"></div>
          <button type="submit" class="btn btn-primary" style="width:100%; padding:12px; font-size:0.95rem; margin-top:4px;">
            Entrar no Painel de Gestão →
          </button>
        </form>

        <div class="auth-demo-pills">
          <span style="width:100%; font-size:0.74rem; color:var(--text-muted); font-weight:700;">
            ⚡ Preenchimento Rápido para Teste de Perfis (Senha: <code>123</code>):
          </span>
          ${STATE.users
            .map((u) => {
              const r = STATE.roles.find((rl) => rl.id === u.roleId);
              return `
              <button type="button" class="auth-demo-btn" onclick="window.TobiasApp.fillDemoLogin('${u.username}', '${u.password}')">
                👤 <strong>${u.username}</strong> (${r ? r.name : "Perfil"})
              </button>
            `;
            })
            .join("")}
        </div>
      </div>
    `;

    document.getElementById("cmsLoginForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const uName = (fd.get("username") || "").trim().toLowerCase();
      const pass = fd.get("password") || "";

      const found = STATE.users.find(
        (u) => u.username.toLowerCase() === uName && u.password === pass
      );

      if (!found) {
        logAction(
          "🔐 Autenticação",
          "Tentativa de Login Falhou",
          `Tentativa inválida com usuário "${uName}"`,
          { username: uName || "desconhecido", fullName: "Tentativa Não Autorizada", roleId: "" }
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
        const errEl = document.getElementById("loginErrorMsg");
        if (errEl) {
          errEl.style.display = "block";
          errEl.textContent = "✗ Usuário ou senha inválidos. Tente novamente.";
        }
        return;
      }

      saveSession(found);
      const role = getActiveRole();
      logAction(
        "🔐 Autenticação",
        "Login Realizado com Sucesso",
        `Acessou a Central de Gestão com o perfil "${role ? role.name : "Perfil"}"`,
        found
      );
      if (role && role.permissions.length > 0) {
        currentAdminTab = role.permissions[0];
      }
      saveState();
    };
  }

  function renderAdminDashboard() {
    const kpiContainer = document.getElementById("adminKpis");
    const sidebarContainer = document.getElementById("adminSidebarNav");
    const panelContainer = document.getElementById("adminContentPanel");
    const userBadge = document.getElementById("activeUserBadge");
    const permsLabel = document.getElementById("activeUserPermsLabel");
    const exportBtnTop = document.getElementById("exportDataBtnTop");

    if (!kpiContainer || !sidebarContainer || !panelContainer) return;

    const role = getActiveRole();
    const allowedModules = ALL_MODULES.filter((m) => role.permissions.includes(m.id));

    // Garante que a aba ativa pertence às permissões do usuário logado
    if (!role.permissions.includes(currentAdminTab) && allowedModules.length > 0) {
      currentAdminTab = allowedModules[0].id;
    }

    if (userBadge) {
      userBadge.innerHTML = `👤 <strong>${CURRENT_USER.fullName}</strong> • <span style="background:${role.badgeColor || "#ff9c0d"}; color:${readableOn(role.badgeColor || "#ff9c0d")}; padding:2px 8px; border-radius:99px; font-size:0.72rem;">${role.name}</span>`;
    }
    if (permsLabel) {
      permsLabel.textContent = `${role.description} (${allowedModules.length} de ${ALL_MODULES.length} módulos liberados)`;
    }
    if (exportBtnTop) {
      exportBtnTop.style.display = hasPermission("monetization") || hasPermission("users_rbac") ? "inline-flex" : "none";
    }

    const totalRevenue = (STATE.sponsors || []).reduce((acc, s) => acc + (Number(s.amount) || 0), 0);

    kpiContainer.innerHTML = `
      <div class="kpi-card">
        <span class="kpi-num">${STATE.directory.length}</span>
        <span class="kpi-label">🏪 Comércios no Guia</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">${STATE.utilityNews.length}</span>
        <span class="kpi-label">🚨 Avisos Utilidade</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">${STATE.promotions.length}</span>
        <span class="kpi-label">🏷️ Cupons Ativos</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">${(STATE.auditLogs || []).length}</span>
        <span class="kpi-label">📋 Eventos no Log</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">${STATE.roles.length} / ${STATE.users.length}</span>
        <span class="kpi-label">🔐 Perfis / Usuários</span>
      </div>
      ${
        hasPermission("monetization")
          ? `
      <div class="kpi-card">
        <span class="kpi-num" style="color:var(--brand-secondary);">R$ ${totalRevenue}</span>
        <span class="kpi-label">💰 Receita da Edição</span>
      </div>`
          : ""
      }
    `;

    // Renderiza apenas as abas permitidas para o perfil do usuário logado
    sidebarContainer.innerHTML = allowedModules
      .map(
        (m) => `
      <button class="admin-tab-btn ${m.id === currentAdminTab ? "active" : ""}" ${m.id === currentAdminTab ? 'aria-current="page"' : ""}
              onclick="window.TobiasApp.switchAdminTab('${m.id}')">
        <span>${m.label}</span>
        <span>→</span>
      </button>
    `
      )
      .join("");

    if (allowedModules.length === 0) {
      panelContainer.innerHTML = `<p>Seu perfil não possui módulos atribuídos no momento. Solicite liberação ao Administrador.</p>`;
      return;
    }

    if (currentAdminTab === "edition") {
      renderAdminEditionTab(panelContainer);
    } else if (currentAdminTab === "directory") {
      renderAdminDirectoryTab(panelContainer);
    } else if (currentAdminTab === "utility") {
      renderAdminUtilityTab(panelContainer);
    } else if (currentAdminTab === "people") {
      renderAdminPeopleTab(panelContainer);
    } else if (currentAdminTab === "promotions") {
      renderAdminPromotionsTab(panelContainer);
    } else if (currentAdminTab === "events") {
      renderAdminEventsTab(panelContainer);
    } else if (currentAdminTab === "classifieds") {
      renderAdminClassifiedsTab(panelContainer);
    } else if (currentAdminTab === "flipbook") {
      renderAdminFlipbookTab(panelContainer);
    } else if (currentAdminTab === "monetization") {
      renderAdminMonetizationTab(panelContainer, totalRevenue);
    } else if (currentAdminTab === "whatsapp_config") {
      renderAdminWhatsappTab(panelContainer);
    } else if (currentAdminTab === "audit_logs") {
      renderAdminAuditLogsTab(panelContainer);
    } else if (currentAdminTab === "users_rbac") {
      renderAdminRbacTab(panelContainer);
    } else if (currentAdminTab === "inbox") {
      renderAdminInboxTab(panelContainer);
    }
  }

  // --------------------------------------------------------------------------
  // MÓDULO 10: CONFIGURAÇÕES DO WHATSAPP NA PLATAFORMA & CARTAZ QR CODE
  // --------------------------------------------------------------------------
  function renderAdminWhatsappTab(container) {
    const w = STATE.whatsappConfig || getDefaultWhatsappConfig();
    container.innerHTML = `
      <h3 style="font-family:var(--font-serif); font-size:1.45rem; margin-bottom:4px;">
        📲 Configurações do WhatsApp na Plataforma & Cartaz QR Code
      </h3>
      <p style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:18px;">
        Defina os números centrais da Redação e do Comercial, o link do grupo de moradores e os modelos (templates) automáticos de mensagens que abrem quando o leitor clica nos botões de WhatsApp do portal.
      </p>

      <form id="cmsWhatsappConfigForm" class="cms-form-grid two-cols">
        <div class="cms-field">
          <label>📞 WhatsApp Oficial da Redação (Sugestões de Pauta / Reclamações)</label>
          <input name="redacaoPhone" value="${w.redacaoPhone}" placeholder="5579999990000" required />
        </div>
        <div class="cms-field">
          <label>💼 WhatsApp Comercial (Venda de Anúncios & Mídia Kit)</label>
          <input name="comercialPhone" value="${w.comercialPhone}" placeholder="5579999990000" required />
        </div>
        <div class="cms-field full">
          <label>👥 Link do Grupo / Comunidade Oficial do Bairro no WhatsApp</label>
          <input name="groupInviteLink" value="${w.groupInviteLink}" placeholder="https://chat.whatsapp.com/..." required />
        </div>
        <div class="cms-field full">
          <label>📤 Modelo de Mensagem ao Compartilhar Edição nos Grupos ({EDICAO} e {URL})</label>
          <textarea name="shareTemplate" rows="3" required>${w.shareTemplate}</textarea>
        </div>
        <div class="cms-field full">
          <label>🏪 Modelo de Mensagem ao Chamar Loja no Guia ({LOJA} e {EDICAO})</label>
          <input name="storeTemplate" value="${w.storeTemplate}" required />
        </div>
        <div class="cms-field full">
          <label>🏷️ Modelo de Mensagem ao Resgatar Cupom ({CUPOM}, {DESCONTO}, {LOJA})</label>
          <input name="couponTemplate" value="${w.couponTemplate}" required />
        </div>
        <div class="cms-field full">
          <label>🚀 Modelo de Mensagem ao Clicar em "Quero Anunciar" no Mídia Kit</label>
          <input name="commercialTemplate" value="${w.commercialTemplate}" required />
        </div>

        <div class="cms-field full" style="border-top:1px dashed var(--border-color); padding-top:12px; margin-top:4px;">
          <strong style="font-size:0.9rem; color:var(--brand-text);">🖨️ Personalização do Cartaz QR Code de Vitrine (Impressão A4)</strong>
        </div>
        <div class="cms-field">
          <label>Título Principal do Cartaz A4</label>
          <input name="qrPosterTitle" value="${w.qrPosterTitle}" required />
        </div>
        <div class="cms-field">
          <label>URL de Destino do QR Code</label>
          <input name="qrPosterUrl" value="${w.qrPosterUrl}" required />
        </div>
        <div class="cms-field full">
          <label>Rodapé de Instrução do Cartaz</label>
          <input name="qrPosterFooter" value="${w.qrPosterFooter}" required />
        </div>

        <div class="cms-field full" style="display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap;">
          <button type="button" class="btn btn-outline" onclick="window.TobiasApp.shareWhatsAppEdition()">
            📲 Testar Disparo no WhatsApp
          </button>
          <button type="button" class="btn btn-outline" onclick="window.TobiasApp.printPosterA4()">
            🖨️ Testar Impressão do Cartaz A4
          </button>
          <button type="submit" class="btn btn-primary">
            💾 Salvar Configurações do WhatsApp
          </button>
        </div>
      </form>
    `;

    document.getElementById("cmsWhatsappConfigForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      STATE.whatsappConfig = {
        redacaoPhone: fd.get("redacaoPhone").replace(/\D/g, ""),
        comercialPhone: fd.get("comercialPhone").replace(/\D/g, ""),
        groupInviteLink: fd.get("groupInviteLink").trim(),
        shareTemplate: fd.get("shareTemplate"),
        storeTemplate: fd.get("storeTemplate"),
        couponTemplate: fd.get("couponTemplate"),
        commercialTemplate: fd.get("commercialTemplate"),
        qrPosterTitle: fd.get("qrPosterTitle"),
        qrPosterUrl: fd.get("qrPosterUrl"),
        qrPosterFooter: fd.get("qrPosterFooter")
      };
      logAction(
        "📲 Config. WhatsApp",
        "Atualizou Integração WhatsApp",
        `Redação: ${STATE.whatsappConfig.redacaoPhone} | Comercial: ${STATE.whatsappConfig.comercialPhone}`
      );
      saveState();
      alert("✓ Configurações do WhatsApp e Cartaz QR Code atualizadas com sucesso!");
    };
  }

  // --------------------------------------------------------------------------
  // MÓDULO 11: LOGS DE ACESSO E AUDITORIA DE ATIVIDADES POR PERFIL
  // --------------------------------------------------------------------------
  function renderAdminAuditLogsTab(container) {
    const logs = STATE.auditLogs || [];
    const filteredLogs = logs.filter(
      (l) => auditFilterUser === "todos" || l.username === auditFilterUser
    );

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div>
          <h3 style="font-family:var(--font-serif); font-size:1.45rem; margin-bottom:4px;">
            📋 Logs de Acesso & Auditoria de Ações por Perfil (${filteredLogs.length})
          </h3>
          <p style="font-size:0.86rem; color:var(--text-secondary);">
            Rastreabilidade completa: veja quem entrou no sistema, qual perfil utilizou, o horário exato e o que cadastrou, editou ou excluiu.
          </p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-outline" style="padding:7px 12px; font-size:0.78rem;" onclick="window.TobiasApp.exportAuditLogsCsv()">
            📊 Exportar Relatório CSV
          </button>
          <button class="btn btn-outline" style="padding:7px 12px; font-size:0.78rem;" onclick="window.TobiasApp.printAuditLogsA4()">
            🖨️ Imprimir Relatório de Auditoria (A4)
          </button>
          ${
            hasPermission("users_rbac")
              ? `<button class="btn-danger" onclick="window.TobiasApp.clearAuditLogs()">🗑️ Limpar Histórico</button>`
              : ""
          }
        </div>
      </div>

      <!-- Filtro por Usuário / Perfil -->
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; padding:12px; background:var(--bg-subtle); border-radius:8px;">
        <span style="font-size:0.78rem; font-weight:800; color:var(--text-secondary); align-self:center;">Filtrar por Usuário:</span>
        <button class="cat-pill ${auditFilterUser === "todos" ? "active" : ""}" onclick="window.TobiasApp.filterAuditByUser('todos')">
          Todos (${logs.length})
        </button>
        ${STATE.users
          .map(
            (u) => `
          <button class="cat-pill ${auditFilterUser === u.username ? "active" : ""}" onclick="window.TobiasApp.filterAuditByUser('${u.username}')">
            👤 ${u.username}
          </button>
        `
          )
          .join("")}
      </div>

      <div style="overflow-x:auto; border:1px solid var(--border-color); border-radius:10px;">
        <table class="audit-log-table">
          <thead>
            <tr>
              <th>Data / Hora</th>
              <th>Usuário & Nome</th>
              <th>Perfil Ativo</th>
              <th>Módulo</th>
              <th>Ação Realizada</th>
              <th>Detalhes do Registro</th>
            </tr>
          </thead>
          <tbody>
            ${
              filteredLogs.length === 0
                ? `<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--text-muted);">Nenhum registro encontrado para este filtro.</td></tr>`
                : filteredLogs
                    .map(
                      (l) => `
              <tr>
                <td style="font-family:var(--font-mono); font-size:0.74rem; white-space:nowrap;">${l.timestamp}</td>
                <td><strong>${l.fullName}</strong> <br/><span style="font-size:0.72rem; color:var(--text-muted);">@${l.username}</span></td>
                <td><span class="tag-badge" style="font-size:0.65rem; background:var(--brand-navy);">${l.roleName}</span></td>
                <td style="font-weight:700; white-space:nowrap;">${l.module}</td>
                <td><strong style="color:var(--brand-text);">${l.action}</strong></td>
                <td style="color:var(--text-secondary);">${l.details}</td>
              </tr>
            `
                    )
                    .join("")
            }
          </tbody>
        </table>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // MÓDULO 10 (EXCLUSIVO ADMIN): CRIAR PERFIS (ROLES), ATRIBUIÇÕES E USUÁRIOS
  // --------------------------------------------------------------------------
  function renderAdminRbacTab(container) {
    container.innerHTML = `
      <h3 style="font-family:var(--font-serif); font-size:1.45rem; margin-bottom:4px;">
        🔐 Gestão de Perfis de Acesso (RBAC), Atribuições & Usuários
      </h3>
      <p style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:20px;">
        Como <strong>Administrador</strong>, você pode criar novos perfis personalizados, escolher exatamente quais módulos cada perfil pode acessar, criar contas de usuários e alterar sua senha de Administrador.
      </p>

      <!-- BLOCO A: CRIAR NOVO PERFIL COM ATRIBUIÇÕES ESPECÍFICAS -->
      <div style="margin-bottom:28px;">
        <h4 style="font-family:var(--font-serif); font-size:1.18rem; margin-bottom:10px;">
          1️⃣ Criar Novo Perfil & Definir Atribuições (Permissões)
        </h4>
        <form id="cmsCreateRoleForm" class="cms-form-grid two-cols">
          <div class="cms-field">
            <label>Nome do Perfil</label>
            <input name="name" placeholder="Ex: Repórter Fotográfico, Moderador de Ofertas..." required />
          </div>
          <div class="cms-field">
            <label>Cor do Selo do Perfil</label>
            <select name="badgeColor">
              <option value="#1b6b53">🟢 Verde Editorial</option>
              <option value="#03326f">🔵 Azul Institucional</option>
              <option value="#feb202">🟡 Amarelo da Logo</option>
              <option value="#7c3aed">🟣 Roxo Criativo</option>
              <option value="#ff9c0d">🟠 Laranja da Logo</option>
            </select>
          </div>
          <div class="cms-field full">
            <label>Descrição das Responsabilidades do Perfil</label>
            <input name="description" placeholder="Descreva o que este perfil faz na revista..." required />
          </div>
          <div class="cms-field full">
            <label>Selecione as Atribuições (Módulos que este perfil poderá gerenciar):</label>
            <div class="perm-checkbox-grid">
              ${ALL_MODULES.map(
                (m) => `
                <label class="perm-check-label">
                  <input type="checkbox" name="perms" value="${m.id}" ${m.id === "utility" || m.id === "events" ? "checked" : ""} />
                  <span>${m.label}</span>
                </label>
              `
              ).join("")}
            </div>
          </div>
          <div class="cms-field full" style="display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary">+ Criar Perfil com Estas Atribuições</button>
          </div>
        </form>

        <!-- Lista de Perfis Existentes (Com edição rápida de atribuições) -->
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${STATE.roles
            .map(
              (r) => `
            <div class="cms-list-item" style="align-items:flex-start; flex-direction:column;">
              <div style="display:flex; justify-content:space-between; width:100%; align-items:center; flex-wrap:wrap; gap:8px;">
                <div>
                  <span style="background:${r.badgeColor || "#03326f"}; color:${readableOn(r.badgeColor || "#03326f")}; font-size:0.72rem; font-weight:800; padding:3px 9px; border-radius:99px;">
                    ${r.name}
                  </span>
                  <span style="font-size:0.82rem; color:var(--text-secondary); margin-left:8px;">${r.description}</span>
                </div>
                ${
                  r.isSystem
                    ? '<span style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-muted);">Perfil Mestre do Sistema</span>'
                    : `<button class="btn-danger" onclick="window.TobiasApp.deleteRole('${r.id}')">Excluir Perfil</button>`
                }
              </div>

              <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
                ${ALL_MODULES.map((m) => {
                  const active = r.permissions.includes(m.id);
                  return `
                    <button type="button"
                            style="border:1px solid ${active ? "var(--brand-secondary)" : "var(--border-color)"}; background:${active ? "var(--ok-bg)" : "var(--bg-surface)"}; color:${active ? "var(--ok-text)" : "var(--text-muted)"}; font-size:0.72rem; font-weight:700; padding:4px 8px; border-radius:6px; cursor:${r.isSystem && m.id === "users_rbac" ? "not-allowed" : "pointer"};"
                            onclick="window.TobiasApp.toggleRolePermission('${r.id}', '${m.id}')"
                            title="Clique para ativar/desativar esta atribuição neste perfil">
                      ${active ? "✓" : "+"} ${m.label}
                    </button>
                  `;
                }).join("")}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- BLOCO B: CRIAR E GERENCIAR USUÁRIOS / SENHAS -->
      <div style="border-top:2px solid var(--border-color); padding-top:24px;">
        <h4 style="font-family:var(--font-serif); font-size:1.18rem; margin-bottom:10px;">
          2️⃣ Cadastrar Usuários da Equipe & Alterar Senhas
        </h4>
        <form id="cmsCreateUserForm" class="cms-form-grid two-cols">
          <div class="cms-field">
            <label>Nome Completo / Cargo</label>
            <input name="fullName" placeholder="Ex: Carlos • Fotógrafo do Bairro" required />
          </div>
          <div class="cms-field">
            <label>Perfil Atribuído</label>
            <select name="roleId">
              ${STATE.roles.map((r) => `<option value="${r.id}">${r.name}</option>`).join("")}
            </select>
          </div>
          <div class="cms-field">
            <label>Login (Nome de Usuário)</label>
            <input name="username" placeholder="Ex: carlos" required />
          </div>
          <div class="cms-field">
            <label>Senha de Acesso</label>
            <input name="password" type="text" placeholder="Defina a senha" required />
          </div>
          <div class="cms-field full" style="display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary">+ Criar / Atualizar Usuário</button>
          </div>
        </form>

        <div>
          ${STATE.users
            .map((u) => {
              const r = STATE.roles.find((rl) => rl.id === u.roleId);
              return `
              <div class="cms-list-item">
                <div>
                  <strong>👤 ${u.fullName}</strong> (Login: <code>${u.username}</code> • Senha: <code>${u.password}</code>)
                  <div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">
                    Perfil: <strong style="color:var(--brand-text);">${r ? r.name : "Sem perfil"}</strong>
                  </div>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                  <button class="btn btn-outline" style="padding:5px 10px; font-size:0.74rem;"
                          onclick="window.TobiasApp.changeUserPasswordPrompt('${u.id}')">
                    🔑 Alterar Senha
                  </button>
                  ${
                    u.username === "admin"
                      ? ""
                      : `<button class="btn-danger" onclick="window.TobiasApp.deleteUser('${u.id}')">Remover</button>`
                  }
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;

    // Criar novo Perfil com atribuições marcadas
    document.getElementById("cmsCreateRoleForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const selectedPerms = fd.getAll("perms");
      if (selectedPerms.length === 0) {
        alert("Selecione pelo menos 1 atribuição (módulo) para este perfil.");
        return;
      }
      STATE.roles.push({
        id: "role-" + Date.now(),
        name: fd.get("name"),
        badgeColor: fd.get("badgeColor"),
        description: fd.get("description"),
        permissions: selectedPerms,
        isSystem: false
      });
      logAction(
        "🔐 Perfis & Acessos",
        "Criou Novo Perfil",
        `Perfil "${fd.get("name")}" com ${selectedPerms.length} atribuições`
      );
      saveState();
      alert("✓ Novo perfil criado com sucesso!");
    };

    // Criar ou atualizar Usuário
    document.getElementById("cmsCreateUserForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const uName = fd.get("username").trim().toLowerCase();
      const existing = STATE.users.find((u) => u.username.toLowerCase() === uName);
      if (existing) {
        existing.fullName = fd.get("fullName");
        existing.roleId = fd.get("roleId");
        existing.password = fd.get("password");
        if (CURRENT_USER && CURRENT_USER.id === existing.id) {
          saveSession(existing);
        }
        logAction(
          "🔐 Perfis & Acessos",
          "Atualizou Usuário",
          `Conta @${uName} (${fd.get("fullName")})`
        );
      } else {
        STATE.users.push({
          id: "usr-" + Date.now(),
          username: uName,
          password: fd.get("password"),
          fullName: fd.get("fullName"),
          roleId: fd.get("roleId")
        });
        logAction(
          "🔐 Perfis & Acessos",
          "Cadastrou Novo Usuário",
          `Conta @${uName} (${fd.get("fullName")})`
        );
      }
      saveState();
      alert("✓ Usuário salvo com sucesso!");
    };
  }

  // 1. Aba Edição & Capa
  function renderAdminEditionTab(container) {
    const ed = STATE.edition;
    const c = ed.coverStory;
    container.innerHTML = `
      <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:4px;">🗞️ Configurar Edição, Alerta Urgente & Reportagem de Capa</h3>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">Altere o número da edição quinzenal, o aviso vermelho do topo e a matéria principal de capa.</p>
      <form id="cmsEditionForm" class="cms-form-grid two-cols">
        <div class="cms-field">
          <label>Número da Edição</label>
          <input name="number" value="${ed.number}" required />
        </div>
        <div class="cms-field">
          <label>Periodicidade</label>
          <input name="periodicity" value="${ed.periodicity}" required />
        </div>
        <div class="cms-field full">
          <label>⚡ Ticker de Utilidade Pública (Barra no Topo)</label>
          <input name="urgentTicker" value="${ed.urgentTicker}" required />
        </div>
        <div class="cms-field full">
          <label>📍 Cidade / Região para o Google Maps</label>
          <input name="mapsRegion" value="${escapeAttr(ed.mapsRegion || "")}" placeholder="Ex: Tobias Barreto - SE" />
        </div>
        <div class="cms-field">
          <label>Chapéu / Kicker da Capa</label>
          <input name="kicker" value="${c.kicker}" required />
        </div>
        <div class="cms-field">
          <label>Tempo de Leitura</label>
          <input name="readingTime" value="${c.readingTime}" required />
        </div>
        <div class="cms-field full">
          <label>Título da Reportagem de Capa</label>
          <input name="title" value="${c.title}" required />
        </div>
        <div class="cms-field full">
          <label>Subtítulo (Linha Fina da Capa)</label>
          <textarea name="lead" rows="2" required>${c.lead}</textarea>
        </div>
        <div class="cms-field full">
          <label>URL da Foto de Capa</label>
          <input name="image" value="${c.image}" required />
        </div>
        <div class="cms-field full">
          <label>Texto Completo da Reportagem (HTML ou Parágrafos)</label>
          <textarea name="fullText" rows="5" required>${c.fullText.trim()}</textarea>
        </div>
        <div class="cms-field full" style="display:flex; justify-content:flex-end;">
          <button type="submit" class="btn btn-primary">💾 Salvar Capa & Edição</button>
        </div>
      </form>
    `;

    document.getElementById("cmsEditionForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      STATE.edition.number = fd.get("number");
      STATE.edition.periodicity = fd.get("periodicity");
      STATE.edition.urgentTicker = fd.get("urgentTicker");
      STATE.edition.mapsRegion = (fd.get("mapsRegion") || "").trim();
      STATE.edition.coverStory.kicker = fd.get("kicker");
      STATE.edition.coverStory.readingTime = fd.get("readingTime");
      STATE.edition.coverStory.title = fd.get("title");
      STATE.edition.coverStory.lead = fd.get("lead");
      STATE.edition.coverStory.image = fd.get("image");
      STATE.edition.coverStory.fullText = fd.get("fullText");
      logAction(
        "🗞️ Edição & Capa",
        "Editou Capa e Alerta",
        `${fd.get("number")} — "${fd.get("title")}"`
      );
      saveState();
      alert("✓ Edição e Reportagem de Capa atualizadas com sucesso!");
    };
  }

  // 2. Aba Guia do Comércio
  function renderAdminDirectoryTab(container) {
    container.innerHTML = `
      <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:4px;">🏪 Gerenciar Guia do Comércio & Profissionais (${STATE.directory.length})</h3>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">Cadastre novas padarias, farmácias, pet shops, chaveiros ou profissionais liberais e destaque patrocinadores.</p>

      <div id="cmsDirEditBanner" style="display:none; padding:10px 14px; margin-bottom:10px; border-radius:10px; background:var(--bg-accent-soft); border:1px solid var(--brand-primary); font-weight:700;"></div>
      <form id="cmsDirForm" class="cms-form-grid two-cols">
        <div class="cms-field">
          <label>Nome do Comércio / Profissional</label>
          <input name="name" placeholder="Ex: Mercadinho São José" required />
        </div>
        <div class="cms-field">
          <label>Categoria</label>
          <select name="catSlug">
            ${categoryOptionsHtml(true)}
          </select>
        </div>
        <div class="cms-field full">
          <label>Ícone do Comércio (aparece no card do Guia)</label>
          <input type="hidden" name="avatar" value="🏪" />
          <div id="iconPicker" class="icon-picker" role="listbox" aria-label="Escolha o ícone"></div>
        </div>
        <div class="cms-field">
          <label>WhatsApp com DDD (Somente números)</label>
          <input name="phone" placeholder="5579999990000" />
        </div>
        <div class="cms-field">
          <label>Telefone fixo (opcional — botão "Ligar")</label>
          <input name="landline" placeholder="557935410000" />
        </div>
        <div class="cms-field">
          <label>Endereço / Rua</label>
          <input name="address" placeholder="Rua Principal, 120" required />
        </div>
        <div class="cms-field">
          <label>Horário de Funcionamento</label>
          <input name="hours" placeholder="Seg a Sáb • 08h às 19h" required />
        </div>
        <div class="cms-field">
          <label>Status Rápido</label>
          <input name="status" placeholder="Entrega Grátis no Bairro" required />
        </div>
        <div class="cms-field">
          <label>Foto da Fachada (URL da imagem)</label>
          <input name="photo" type="url" placeholder="https://... (horizontal, até ~150 KB)" />
        </div>
        <div class="cms-field">
          <label>Instagram (opcional)</label>
          <input name="instagram" placeholder="@nomedaloja" />
        </div>
        <div class="cms-field">
          <label>Site (opcional)</label>
          <input name="website" type="url" placeholder="https://..." />
        </div>
        <div class="cms-field">
          <label>Link do Google Maps (opcional)</label>
          <input name="mapsUrl" type="url" placeholder="https://maps.app.goo.gl/... (Perfil da Empresa)" />
        </div>
        <div class="cms-field">
          <label>Patrocinador Destaque?</label>
          <select name="sponsored">
            <option value="true">★ Sim (Borda Dourada + Topo)</option>
            <option value="false">Não (Cadastro Normal)</option>
          </select>
        </div>
        <div class="cms-field full">
          <label>Descrição dos Produtos / Serviços</label>
          <textarea name="description" rows="2" required placeholder="Resumo curto para leitura no celular..."></textarea>
        </div>
        <div class="cms-field full" style="display:flex; justify-content:flex-end;">
          <button type="button" id="cmsDirCancel" class="btn btn-outline" style="display:none; margin-right:8px;">Cancelar edição</button>
          <button type="submit" class="btn btn-primary" id="cmsDirSubmit">+ Adicionar ao Guia do Bairro</button>
        </div>
      </form>

      <div class="cms-field full" style="margin:6px 0 12px;">
        <label>🔎 Buscar no Guia para editar (nome, categoria, endereço)</label>
        <input id="cmsDirSearch" placeholder="Digite para filtrar a lista abaixo…" />
      </div>
      <div id="cmsDirList">
        ${STATE.directory
          .map(
            (b) => `
          <div class="cms-list-item" data-q="${escapeAttr(foldText([b.name, b.category, b.address].join(" ")))}">
            <div>
              <strong>${b.avatar} ${escapeHtml(b.name)}</strong> ${b.sponsored ? '<span class="tag-badge" style="font-size:0.65rem;">★ Patrocinado</span>' : ""}
              <div style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(b.category)} • 📍 ${escapeHtml(b.address || "—")} • 📞 ${escapeHtml(b.phone || b.landline || "sem telefone")}${b.hours ? "" : " • ⚠️ sem horário"}</div>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
              <button class="btn btn-primary" style="padding:5px 10px; font-size:0.75rem;" onclick="window.TobiasApp.editBiz('${escapeAttr(b.id)}')">✏️ Editar</button>
              <button class="btn btn-outline" style="padding:5px 10px; font-size:0.75rem;" onclick="window.TobiasApp.toggleBizSponsored('${b.id}')">
                ${b.sponsored ? "Remover Destaque" : "★ Destacar"}
              </button>
              <button class="btn-danger" onclick="window.TobiasApp.deleteItem('directory', '${b.id}')">Excluir</button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    const catLabels = {
      alimentacao: "Padarias & Mercados",
      saude: "Farmácias & Saúde",
      pets: "Pet Shops",
      reparos: "Chaveiros & Reparos",
      profissionais: "Profissionais Liberais",
      restaurantes: "Restaurantes & Lanchonetes",
      hospedagem: "Hospedagem"
    };

    const dirForm = document.getElementById("cmsDirForm");
    // ---- seletor visual de ícones (salva o emoji equivalente; o portal desenha o ícone vetorial) ----
    const pickerEl = document.getElementById("iconPicker");
    const avatarInput = dirForm.elements.avatar;
    const paintPicker = () => {
      const cur = avatarInput.value;
      const opts = (window.TMIcons && TMIcons.picker) || [];
      // emoji exato; se não houver, o primeiro que desenha o mesmo ícone (ex.: 💈 = tesoura)
      let sel = opts.find(([e]) => e === cur);
      if (!sel && cur) sel = opts.find(([e]) => TMIcons.nameOf(e) && TMIcons.nameOf(e) === TMIcons.nameOf(cur));
      const selEmoji = sel ? sel[0] : cur;
      const extra = !sel && cur ? [[cur, "Atual"]] : [];
      pickerEl.innerHTML = extra
        .concat(opts)
        .map(([e, label]) => {
          const nm = window.TMIcons && TMIcons.nameOf(e);
          const ic = nm ? TMIcons.svg(nm) : `<span>${escapeHtml(e)}</span>`;
          return `<button type="button" class="icon-opt ${e === selEmoji ? "active" : ""}" role="option" aria-selected="${e === selEmoji}" data-emoji="${escapeAttr(e)}" title="${escapeAttr(label)}">${ic}<small>${escapeHtml(label)}</small></button>`;
        })
        .join("");
      pickerEl.querySelectorAll(".icon-opt").forEach((btn) => {
        btn.onclick = () => {
          avatarInput.value = btn.getAttribute("data-emoji");
          paintPicker();
        };
      });
    };
    paintPicker();

    // ---- modo edição: preenche o formulário com o comércio escolhido ----
    const editing = editingBizId ? STATE.directory.find((b) => b.id === editingBizId) : null;
    if (editing) {
      ["name", "catSlug", "avatar", "phone", "landline", "address", "hours", "status", "photo", "instagram", "website", "mapsUrl", "description"].forEach((k) => {
        if (dirForm.elements[k]) dirForm.elements[k].value = editing[k] == null ? "" : editing[k];
      });
      dirForm.elements.sponsored.value = editing.sponsored ? "true" : "false";
      if (!avatarInput.value) avatarInput.value = "🏪";
      paintPicker();
      dirForm.querySelectorAll("[required]").forEach((el) => {
        if (el.name !== "name") el.removeAttribute("required"); // na edição, só o nome é obrigatório
      });
      const bn = document.getElementById("cmsDirEditBanner");
      bn.style.display = "block";
      bn.textContent = "✏️ Editando: " + editing.name;
      document.getElementById("cmsDirSubmit").textContent = "💾 Salvar alterações";
      document.getElementById("cmsDirCancel").style.display = "inline-flex";
      document.getElementById("cmsDirCancel").onclick = () => {
        editingBizId = null;
        renderAdminDirectoryTab(container);
      };
      setTimeout(() => bn.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    }

    // busca na lista (filtra sem recarregar, para não perder o que foi digitado)
    const qInput = document.getElementById("cmsDirSearch");
    qInput.oninput = () => {
      const q = foldText(qInput.value);
      document.querySelectorAll("#cmsDirList .cms-list-item").forEach((row) => {
        row.style.display = !q || row.getAttribute("data-q").includes(q) ? "" : "none";
      });
    };

    dirForm.onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const slug = fd.get("catSlug");
      if (editingBizId) {
        const b = STATE.directory.find((x) => x.id === editingBizId);
        if (b) {
          Object.assign(b, {
            name: (fd.get("name") || "").trim(),
            catSlug: slug,
            category: categoryLabel(slug),
            avatar: fd.get("avatar") || b.avatar || "🏪",
            sponsored: fd.get("sponsored") === "true",
            description: fd.get("description") || "",
            address: fd.get("address") || "",
            hours: fd.get("hours") || "",
            phone: (fd.get("phone") || "").replace(/\D/g, ""),
            landline: (fd.get("landline") || "").replace(/\D/g, ""),
            status: fd.get("status") || "",
            photo: (fd.get("photo") || "").trim(),
            mapsUrl: (fd.get("mapsUrl") || "").trim(),
            instagram: (fd.get("instagram") || "").trim().replace(/^@/, ""),
            website: (fd.get("website") || "").trim()
          });
          logAction("🏪 Guia do Comércio", "Editou Comércio/Profissional", b.name);
        }
        editingBizId = null;
        saveState();
        return;
      }
      STATE.directory.unshift({
        id: "biz-" + Date.now(),
        name: fd.get("name"),
        catSlug: slug,
        category: categoryLabel(slug),
        avatar: fd.get("avatar") || "🏪",
        sponsored: fd.get("sponsored") === "true",
        description: fd.get("description"),
        address: fd.get("address"),
        hours: fd.get("hours"),
        phone: (fd.get("phone") || "").replace(/\D/g, ""),
        landline: (fd.get("landline") || "").replace(/\D/g, ""),
        status: fd.get("status"),
        photo: (fd.get("photo") || "").trim(),
        mapsUrl: (fd.get("mapsUrl") || "").trim(),
        instagram: (fd.get("instagram") || "").trim().replace(/^@/, ""),
        website: (fd.get("website") || "").trim()
      });
      logAction(
        "🏪 Guia do Comércio",
        "Cadastrou Comércio/Profissional",
        `${fd.get("name")} (${catLabels[slug] || "Comércio"})`
      );
      saveState();
    };
  }

  // 3. Aba Utilidade Pública
  function renderAdminUtilityTab(container) {
    container.innerHTML = `
      <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:4px;">🚨 Gerenciar Avisos de Utilidade Pública (${STATE.utilityNews.length})</h3>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">Publique alertas sobre falta de água, obras nas ruas, vacinação no posto de saúde e segurança.</p>

      <form id="cmsUtilityForm" class="cms-form-grid two-cols">
        <div class="cms-field">
          <label>Nível de Alerta</label>
          <select name="level">
            <option value="urgent">🔴 Urgente (Água, Luz, Interdição)</option>
            <option value="info">🟢 Informativo (Saúde, Educação)</option>
            <option value="warning">🟡 Atenção (Segurança, Reunião)</option>
          </select>
        </div>
        <div class="cms-field">
          <label>Selo / Categoria</label>
          <input name="badge" placeholder="⚠️ Aviso de Água e Obras" required />
        </div>
        <div class="cms-field">
          <label>Data / Horário do Evento</label>
          <input name="date" placeholder="Sexta-feira • 08h às 12h" required />
        </div>
        <div class="cms-field">
          <label>Fonte Oficial</label>
          <input name="source" placeholder="Associação de Moradores / UBS" required />
        </div>
        <div class="cms-field full">
          <label>Título do Aviso</label>
          <input name="title" placeholder="Manutenção preventiva na rede elétrica..." required />
        </div>
        <div class="cms-field full">
          <label>Explicação Detalhada</label>
          <textarea name="summary" rows="2" required></textarea>
        </div>
        <div class="cms-field full" style="display:flex; justify-content:flex-end;">
          <button type="submit" class="btn btn-primary">+ Publicar Aviso de Utilidade</button>
        </div>
      </form>

      <div>
        ${STATE.utilityNews
          .map(
            (n) => `
          <div class="cms-list-item">
            <div>
              <strong>${n.badge} — ${n.title}</strong>
              <div style="font-size:0.78rem; color:var(--text-muted);">${n.date} • Fonte: ${n.source}</div>
            </div>
            <button class="btn-danger" onclick="window.TobiasApp.deleteItem('utilityNews', '${n.id}')">Excluir</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    document.getElementById("cmsUtilityForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      STATE.utilityNews.unshift({
        id: "ut-" + Date.now(),
        level: fd.get("level"),
        badge: fd.get("badge"),
        date: fd.get("date"),
        title: fd.get("title"),
        summary: fd.get("summary"),
        source: fd.get("source")
      });
      logAction(
        "🚨 Utilidade Pública",
        "Publicou Alerta",
        `${fd.get("badge")}: ${fd.get("title")}`
      );
      saveState();
    };
  }

  // 4. Aba Gente do Bairro & Publieditoriais
  function renderAdminPeopleTab(container) {
    container.innerHTML = `
      <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:4px;">🎙️ Gente do Bairro & Publieditoriais (${STATE.peopleStories.length})</h3>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">Adicione entrevistas com moradores tradicionais, talentos locais ou matérias patrocinadas de novas lojas.</p>

      <form id="cmsPeopleForm" class="cms-form-grid two-cols">
        <div class="cms-field">
          <label>Tipo de Matéria</label>
          <select name="type">
            <option value="Tradição do Bairro">Tradição do Bairro (Morador Antigo)</option>
            <option value="Talento Local">Talento Local (Esporte / Cultura)</option>
            <option value="✨ Publieditorial • Nova Loja no Bairro">✨ Publieditorial (Matéria Patrocinada)</option>
          </select>
        </div>
        <div class="cms-field">
          <label>Título / Nome do Entrevistado ou Loja</label>
          <input name="name" placeholder="Ex: Dona Maria & os Doces Caseiros" required />
        </div>
        <div class="cms-field">
          <label>Subtítulo / Profissão / Endereço</label>
          <input name="role" placeholder="Confeiteira • Moradora há 25 anos" required />
        </div>
        <div class="cms-field">
          <label>URL da Foto</label>
          <input name="image" value="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80" required />
        </div>
        <div class="cms-field full">
          <label>Frase de Destaque (Aspas na Foto)</label>
          <input name="quote" placeholder="“Nosso bairro tem a melhor energia do mundo.”" required />
        </div>
        <div class="cms-field full">
          <label>Resumo da História / Publieditorial</label>
          <textarea name="story" rows="3" required></textarea>
        </div>
        <div class="cms-field full" style="display:flex; justify-content:flex-end;">
          <button type="submit" class="btn btn-primary">+ Publicar História / Publieditorial</button>
        </div>
      </form>

      <div>
        ${STATE.peopleStories
          .map(
            (p) => `
          <div class="cms-list-item">
            <div>
              <strong>[${p.type}] ${p.name}</strong>
              <div style="font-size:0.78rem; color:var(--text-muted);">${p.role}</div>
            </div>
            <button class="btn-danger" onclick="window.TobiasApp.deleteItem('peopleStories', '${p.id}')">Excluir</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    document.getElementById("cmsPeopleForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      STATE.peopleStories.unshift({
        id: "ps-" + Date.now(),
        type: fd.get("type"),
        name: fd.get("name"),
        role: fd.get("role"),
        quote: fd.get("quote"),
        image: fd.get("image"),
        story: fd.get("story")
      });
      logAction(
        "🎙️ Gente & Publieditorial",
        "Publicou Matéria",
        `[${fd.get("type")}] ${fd.get("name")}`
      );
      saveState();
    };
  }

  // 5. Aba Promoções
  function renderAdminPromotionsTab(container) {
    container.innerHTML = `
      <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:4px;">🏷️ Gerenciar Cupons & Promoções (${STATE.promotions.length})</h3>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">Crie ofertas exclusivas para os leitores resgatarem no WhatsApp dos lojistas parceiros.</p>

      <form id="cmsPromoForm" class="cms-form-grid two-cols">
        <div class="cms-field">
          <label>Nome da Loja Parceira</label>
          <input name="store" placeholder="Ex: Açougue Boi de Ouro" required />
        </div>
        <div class="cms-field">
          <label>Selo de Desconto</label>
          <input name="discount" placeholder="15% OFF NO PIX" required />
        </div>
        <div class="cms-field">
          <label>Código do Cupom</label>
          <input name="code" placeholder="CHURRASCO15" required />
        </div>
        <div class="cms-field">
          <label>Validade</label>
          <input name="validUntil" placeholder="Válido até Domingo" required />
        </div>
        <div class="cms-field">
          <label>WhatsApp da Loja (Somente números)</label>
          <input name="phone" placeholder="5579999990001" required />
        </div>
        <div class="cms-field full">
          <label>Descrição da Oferta</label>
          <input name="title" placeholder="Kit Churrasco para 6 pessoas + Pão de Alho Grátis" required />
        </div>
        <div class="cms-field full" style="display:flex; justify-content:flex-end;">
          <button type="submit" class="btn btn-primary">+ Criar Cupom de Desconto</button>
        </div>
      </form>

      <div>
        ${STATE.promotions
          .map(
            (pr) => `
          <div class="cms-list-item">
            <div>
              <strong>[${pr.discount}] ${pr.store} — Cupom: ${pr.code}</strong>
              <div style="font-size:0.78rem; color:var(--text-muted);">${pr.title} (${pr.validUntil})</div>
            </div>
            <button class="btn-danger" onclick="window.TobiasApp.deleteItem('promotions', '${pr.id}')">Excluir</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    document.getElementById("cmsPromoForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const code = fd.get("code").toUpperCase().replace(/\s+/g, "");
      STATE.promotions.unshift({
        id: "pr-" + Date.now(),
        store: fd.get("store"),
        discount: fd.get("discount").toUpperCase(),
        code,
        validUntil: fd.get("validUntil"),
        phone: fd.get("phone").replace(/\D/g, ""),
        title: fd.get("title")
      });
      logAction(
        "🏷️ Cupons & Ofertas",
        "Criou Cupom",
        `Loja: ${fd.get("store")} | Código: ${code}`
      );
      saveState();
    };
  }

  // 6. Aba Agenda
  function renderAdminEventsTab(container) {
    container.innerHTML = `
      <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:4px;">📅 Gerenciar Agenda de Eventos & Lazer (${STATE.events.length})</h3>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">Cadastre feiras livres, festas da igreja, jogos amadores e eventos culturais na praça.</p>

      <form id="cmsEventForm" class="cms-form-grid two-cols">
        <div class="cms-field">
          <label>Dia (Número)</label>
          <input name="day" placeholder="16" maxlength="2" required />
        </div>
        <div class="cms-field">
          <label>Dia da Semana / Mês Abreviado</label>
          <input name="month" placeholder="SÁB" maxlength="4" required />
        </div>
        <div class="cms-field">
          <label>Categoria Cultural</label>
          <input name="category" placeholder="Esporte & Comunidade" required />
        </div>
        <div class="cms-field">
          <label>Horário</label>
          <input name="time" placeholder="16h00 às 20h00" required />
        </div>
        <div class="cms-field full">
          <label>Local no Bairro</label>
          <input name="location" placeholder="Praça Central / Quadra da Escola" required />
        </div>
        <div class="cms-field full">
          <label>Título do Evento</label>
          <input name="title" placeholder="Festival de Pipas & Sorvete na Praça" required />
        </div>
        <div class="cms-field full">
          <label>Descrição Curta</label>
          <textarea name="description" rows="2" required></textarea>
        </div>
        <div class="cms-field full" style="display:flex; justify-content:flex-end;">
          <button type="submit" class="btn btn-primary">+ Adicionar Evento na Agenda</button>
        </div>
      </form>

      <div>
        ${STATE.events
          .map(
            (ev) => `
          <div class="cms-list-item">
            <div>
              <strong>[${ev.day}/${ev.month}] ${ev.title}</strong>
              <div style="font-size:0.78rem; color:var(--text-muted);">🕒 ${ev.time} • 📍 ${ev.location}</div>
            </div>
            <button class="btn-danger" onclick="window.TobiasApp.deleteItem('events', '${ev.id}')">Excluir</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    document.getElementById("cmsEventForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      STATE.events.push({
        id: "ev-" + Date.now(),
        day: fd.get("day"),
        month: fd.get("month").toUpperCase(),
        category: fd.get("category"),
        time: fd.get("time"),
        location: fd.get("location"),
        title: fd.get("title"),
        description: fd.get("description")
      });
      logAction(
        "📅 Agenda Cultural",
        "Adicionou Evento",
        `${fd.get("day")}/${fd.get("month").toUpperCase()} — ${fd.get("title")}`
      );
      saveState();
    };
  }

  // 7. Aba Classificados
  function renderAdminClassifiedsTab(container) {
    container.innerHTML = `
      <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:4px;">📌 Moderar Classificados Locais (${STATE.classifieds.length})</h3>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">Publique ou remova anúncios de imóveis, vagas de emprego, compra/venda e adoção de animais.</p>

      <form id="cmsClassifiedForm" class="cms-form-grid two-cols">
        <div class="cms-field">
          <label>Categoria</label>
          <select name="category">
            <option value="Imóveis • Aluguel Direto">Imóveis • Aluguel Direto</option>
            <option value="Imóveis • Venda">Imóveis • Venda</option>
            <option value="Empregos no Bairro">Empregos no Bairro</option>
            <option value="Doação Responsável Pet">Doação Responsável Pet</option>
            <option value="Compra & Venda">Compra & Venda</option>
            <option value="Serviços & Aulas">Serviços & Aulas</option>
          </select>
        </div>
        <div class="cms-field">
          <label>Preço ou Condição</label>
          <input name="price" placeholder="R$ 850 / mês" required />
        </div>
        <div class="cms-field">
          <label>Título do Anúncio</label>
          <input name="title" placeholder="Aluga-se Kitnet Mobiliada próxima ao ponto final" required />
        </div>
        <div class="cms-field">
          <label>WhatsApp do Anunciante</label>
          <input name="phone" placeholder="5579999990000" required />
        </div>
        <div class="cms-field full">
          <label>Detalhes</label>
          <textarea name="details" rows="2" required></textarea>
        </div>
        <div class="cms-field full" style="display:flex; justify-content:flex-end;">
          <button type="submit" class="btn btn-primary">+ Publicar Classificado</button>
        </div>
      </form>

      <div>
        ${STATE.classifieds
          .map(
            (cl) => `
          <div class="cms-list-item">
            <div>
              <strong>[${cl.category}] ${cl.title} — ${cl.price}</strong>
              <div style="font-size:0.78rem; color:var(--text-muted);">${cl.details}</div>
            </div>
            <button class="btn-danger" onclick="window.TobiasApp.deleteItem('classifieds', '${cl.id}')">Excluir</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    document.getElementById("cmsClassifiedForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      STATE.classifieds.unshift({
        id: "cl-" + Date.now(),
        category: fd.get("category"),
        badgeColor: "#03326f",
        title: fd.get("title"),
        price: fd.get("price"),
        details: fd.get("details"),
        phone: fd.get("phone").replace(/\D/g, "")
      });
      logAction(
        "📌 Classificados",
        "Publicou Classificado",
        `[${fd.get("category")}] ${fd.get("title")} (${fd.get("price")})`
      );
      saveState();
    };
  }

  // 8. Aba Flipbook
  function renderAdminFlipbookTab(container) {
    container.innerHTML = `
      <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:4px;">📖 Editor de Diagramação do Flipbook (${STATE.flipbookPages.length} Páginas)</h3>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">Personalize os títulos, subtítulos e destaques de cada uma das 10 páginas enxutas da revista mobile.</p>

      <div style="display:flex; flex-direction:column; gap:14px;">
        ${STATE.flipbookPages
          .map(
            (p, idx) => `
          <form onsubmit="window.TobiasApp.saveFlipPage(event, ${idx})" style="background:var(--bg-subtle); padding:14px; border-radius:10px; border:1px solid var(--border-color);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <strong style="color:var(--brand-text); font-family:var(--font-mono);">PÁGINA ${p.pageNumber} — ${p.section}</strong>
              <button type="submit" class="btn btn-primary" style="padding:5px 12px; font-size:0.76rem;">Salvar Página ${p.pageNumber}</button>
            </div>
            <div class="cms-form-grid two-cols" style="margin-bottom:0; padding:0; border:none;">
              <div class="cms-field">
                <label>Título da Página</label>
                <input name="title" value="${p.title}" required />
              </div>
              <div class="cms-field">
                <label>Subtítulo</label>
                <input name="subtitle" value="${p.subtitle}" required />
              </div>
              <div class="cms-field full">
                <label>Resumo / Chamada em Destaque</label>
                <input name="highlight" value="${p.highlight}" required />
              </div>
            </div>
          </form>
        `
          )
          .join("")}
      </div>
    `;
  }


  // 13. Caixa de Entrada & Métricas (dados vindos da planilha via servidor)
  let inboxSub = "leads";
  let editingBizId = null;
  const foldText = (t) => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  function renderAdminInboxTab(container) {
    const subs = [
      ["leads", "🚀 Pedidos de anúncio"],
      ["sugestoes", "📝 Sugestões dos moradores"],
      ["metricas", "📊 Métricas"],
      ["guia", "🏪 Guia na planilha"]
    ];
    container.innerHTML = `
      <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:4px;">📥 Caixa de Entrada & Métricas</h3>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px;">Tudo que chega pelo site vai para a sua planilha do Google. Aqui você acompanha, aprova e mede.
        <a href="https://docs.google.com/spreadsheets/d/${SHEET_ID_PUBLIC}/edit" target="_blank" rel="noopener" style="color:var(--brand-text); font-weight:700;">Abrir planilha ↗</a></p>
      ${
        API_URL
          ? ""
          : `<p style="padding:12px; background:var(--bg-accent-soft); border-radius:10px;">Servidor não configurado (<code>config.js</code>).</p>`
      }
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
        ${subs
          .map(
            ([id, label]) =>
              `<button class="btn ${id === inboxSub ? "btn-primary" : "btn-outline"}" data-sub="${id}">${label}</button>`
          )
          .join("")}
      </div>
      <div id="inboxBody"><p style="color:var(--text-secondary);">Carregando…</p></div>
    `;
    container.querySelectorAll("[data-sub]").forEach((b) => {
      b.onclick = () => {
        inboxSub = b.getAttribute("data-sub");
        renderAdminInboxTab(container);
      };
    });
    if (!API_URL) return;
    const body = document.getElementById("inboxBody");
    if (inboxSub === "leads") inboxLeads(body);
    else if (inboxSub === "sugestoes") inboxSuggestions(body);
    else if (inboxSub === "metricas") inboxMetrics(body);
    else inboxGuide(body);
  }

  // Datas vindas da planilha (ISO/UTC) -> horário de Bahia, formato brasileiro
  function fmtDate(v) {
    const t = String(v || "");
    if (!/^\d{4}-\d{2}-\d{2}T/.test(t)) return t;
    const d = new Date(t);
    return isNaN(d) ? t : d.toLocaleString("pt-BR", { timeZone: "America/Bahia", dateStyle: "short", timeStyle: "short" });
  }

  const SHEET_ID_PUBLIC = "1XyQGjJkOFTBxoa2PuwttZ-65fDNvfw4bPSCcMKaE91E";
  const statusSelect = (id, current, options, kind) =>
    `<select data-status="${escapeAttr(id)}" data-kind="${kind}" style="padding:6px; border-radius:8px; border:1px solid var(--border-color);">${options
      .map((o) => `<option ${o === current ? "selected" : ""}>${o}</option>`)
      .join("")}</select>`;

  function bindStatusSelects(root) {
    root.querySelectorAll("select[data-status]").forEach((sel) => {
      sel.onchange = async () => {
        const j = await api("setStatus", { sheet: sel.dataset.kind, id: sel.dataset.status, status: sel.value }, { auth: true });
        syncToast(j && j.ok ? "✓ Status atualizado" : "Erro: " + ((j && j.error) || ""), !(j && j.ok));
      };
    });
  }

  async function inboxLeads(body) {
    const j = await api("list", { sheet: "leads" }, { auth: true });
    if (!j.ok) return (body.innerHTML = `<p>Não foi possível carregar: ${escapeHtml(j.error)}</p>`);
    const rows = j.rows.slice().reverse();
    if (!rows.length) return (body.innerHTML = "<p>Nenhum pedido de anúncio ainda. Quando alguém enviar o formulário \"Quero Anunciar\", aparece aqui.</p>");
    body.innerHTML = rows
      .map(
        (r) => `
      <div class="cms-list-item" style="align-items:flex-start;">
        <div>
          <strong>${escapeHtml(r.Loja)}</strong> <span style="font-size:0.78rem; color:var(--text-muted);">• ${escapeHtml(fmtDate(r.Data))}</span>
          <div style="font-size:0.82rem;">${escapeHtml(r["Responsável"])} • ${escapeHtml(r.Ramo)} • <strong>${escapeHtml(r.Plano)}</strong></div>
          ${r.Mensagem ? `<div style="font-size:0.8rem; color:var(--text-secondary);">“${escapeHtml(r.Mensagem)}”</div>` : ""}
          <a class="btn btn-whatsapp" style="margin-top:6px; padding:5px 10px; font-size:0.76rem;" target="_blank" rel="noopener" href="https://wa.me/${encodeURIComponent(r.WhatsApp)}">WhatsApp ${escapeHtml(formatPhoneBR(r.WhatsApp))}</a>
        </div>
        ${statusSelect(r.ID, r.Status, ["Novo", "Contatado", "Negociando", "Fechado", "Descartado"], "leads")}
      </div>`
      )
      .join("");
    bindStatusSelects(body);
  }

  async function inboxSuggestions(body) {
    const j = await api("list", { sheet: "sugestoes" }, { auth: true });
    if (!j.ok) return (body.innerHTML = `<p>Não foi possível carregar: ${escapeHtml(j.error)}</p>`);
    const rows = j.rows.slice().reverse();
    const pend = rows.filter((r) => r.Status === "Pendente").length;
    if (!rows.length) return (body.innerHTML = "<p>Nenhuma sugestão ainda. Cadastros de negócio e classificados enviados por moradores caem aqui para você aprovar.</p>");
    body.innerHTML =
      `<p style="margin-bottom:10px;"><strong>${pend}</strong> aguardando aprovação.</p>` +
      rows
        .map((r) => {
          let d = {};
          try {
            d = JSON.parse(r.Dados);
          } catch (e) {}
          const line = Object.keys(d)
            .map((k) => `${escapeHtml(k)}: ${escapeHtml(d[k])}`)
            .join(" • ");
          return `
      <div class="cms-list-item" style="align-items:flex-start;">
        <div>
          <strong>${r.Tipo === "biz" ? "🏪" : "📌"} ${escapeHtml(r.Titulo)}</strong>
          <span style="font-size:0.78rem; color:var(--text-muted);">• ${escapeHtml(fmtDate(r.Data))} • ${escapeHtml(r.Status)}</span>
          <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">${line}</div>
        </div>
        ${
          r.Status === "Pendente"
            ? `<div style="display:flex; gap:6px;">
                 <button class="btn btn-primary" data-ap="${escapeAttr(r.ID)}" style="padding:6px 12px;">Aprovar</button>
                 <button class="btn-danger" data-rj="${escapeAttr(r.ID)}">Recusar</button>
               </div>`
            : ""
        }
      </div>`;
        })
        .join("");
    const byId = {};
    rows.forEach((r) => (byId[r.ID] = r));
    body.querySelectorAll("[data-ap]").forEach((b) => {
      b.onclick = async () => {
        const r = byId[b.dataset.ap];
        let d = {};
        try {
          d = JSON.parse(r.Dados);
        } catch (e) {}
        if (r.Tipo === "biz") {
          STATE.directory.unshift({
            id: "biz-" + Date.now(),
            name: d.name,
            catSlug: d.catSlug,
            category: categoryLabel(d.catSlug),
            avatar: "⭐",
            sponsored: false,
            description: d.description,
            address: d.address,
            hours: d.hours,
            phone: String(d.phone || "").replace(/\D/g, ""),
            status: "Novo no Bairro"
          });
        } else {
          STATE.classifieds.unshift({
            id: "cl-" + Date.now(),
            category: d.category,
            badgeColor: "#ff9c0d",
            title: d.title,
            price: d.price,
            details: d.details,
            phone: String(d.phone || "").replace(/\D/g, "")
          });
        }
        logAction("📥 Caixa de Entrada", "Aprovou sugestão", r.Titulo);
        const j2 = await api("setStatus", { sheet: "sugestoes", id: r.ID, status: "Aprovado" }, { auth: true });
        saveState(); // publica o conteúdo novo para todos
        if (j2 && j2.ok && currentAdminTab === "inbox") renderAdminInboxTab(document.getElementById("adminContentPanel"));
      };
    });
    body.querySelectorAll("[data-rj]").forEach((b) => {
      b.onclick = async () => {
        await api("setStatus", { sheet: "sugestoes", id: b.dataset.rj, status: "Recusado" }, { auth: true });
        renderAdminInboxTab(document.getElementById("adminContentPanel"));
      };
    });
  }

  async function inboxMetrics(body) {
    const j = await api("list", { sheet: "metricas" }, { auth: true });
    if (!j.ok) return (body.innerHTML = `<p>Não foi possível carregar: ${escapeHtml(j.error)}</p>`);
    const rows = j.rows.map((r) => ({ e: r.Evento, id: r.ID, n: r.Item, t: Number(r.Total) || 0 }));
    if (!rows.length) return (body.innerHTML = "<p>Ainda sem dados. As contagens aparecem conforme os moradores usam o site.</p>");
    const sum = (e) => rows.filter((r) => r.e === e).reduce((a, r) => a + r.t, 0);
    const kpi = (n, l) => `<div class="kpi-card"><span class="kpi-num">${n}</span><span class="kpi-label">${l}</span></div>`;
    const block = (e, title) => {
      const list = rows.filter((r) => r.e === e).sort((a, b) => b.t - a.t).slice(0, 15);
      if (!list.length) return "";
      return `<h4 style="font-family:var(--font-serif); margin:18px 0 8px;">${title}</h4>` +
        list.map((r) => `<div class="cms-list-item"><span>${escapeHtml(r.n || r.id)}</span><strong>${r.t}</strong></div>`).join("");
    };
    body.innerHTML = `
      <div class="admin-kpis" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:10px;">
        ${kpi(sum("visit"), "👀 Visitas")}
        ${kpi(sum("whatsapp"), "💬 Cliques no WhatsApp")}
        ${kpi(sum("maps"), "📍 Cliques em Como chegar")}
        ${kpi(sum("call"), "📞 Cliques em Ligar")}
        ${kpi(sum("comercial") + sum("anuncie"), "🚀 Interesse em anunciar")}
      </div>
      ${block("whatsapp", "Comércios mais chamados no WhatsApp")}
      ${block("maps", "Comércios mais buscados no mapa")}
      ${block("call", "Comércios mais ligados")}
      <p style="font-size:0.78rem; color:var(--text-muted); margin-top:14px;">Contagens anônimas (sem dados pessoais). Cliques da equipe logada não são contados. Mostre estes números ao lojista para justificar o plano.</p>`;
  }

  function inboxGuide(body) {
    body.innerHTML = `
      <p style="font-size:0.88rem; margin-bottom:12px;">Edite o Guia inteiro como uma tabela: telefone, horário, endereço, foto. A planilha tem uma linha por comércio (aba <strong>Guia</strong>).</p>
      <ol style="font-size:0.85rem; color:var(--text-secondary); margin:0 0 14px 18px; line-height:1.7;">
        <li>Clique em <strong>Enviar Guia para a planilha</strong>.</li>
        <li>Abra a planilha, edite as células (coloque <code>NÃO</code> na coluna <em>ativo</em> para remover um comércio; uma linha nova sem <em>id</em> cria um comércio).</li>
        <li>Volte aqui e clique em <strong>Trazer da planilha para o site</strong>: o Guia é atualizado para todos.</li>
      </ol>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn btn-outline" id="guideUp">⬆️ Enviar Guia para a planilha</button>
        <button class="btn btn-primary" id="guideDown">⬇️ Trazer da planilha para o site</button>
      </div>`;
    const FIELDS = ["name", "catSlug", "avatar", "description", "address", "mapsUrl", "hours", "phone", "landline", "instagram", "website", "photo", "status", "sponsored", "priority"];
    document.getElementById("guideUp").onclick = async () => {
      if (!confirm("Isto substitui o conteúdo da aba Guia da planilha pelo Guia atual do site. Continuar?")) return;
      const rows = STATE.directory.map((b) => {
        const o = { id: b.id };
        FIELDS.forEach((k) => (o[k] = b[k] == null ? "" : b[k]));
        return o;
      });
      const j = await api("saveDirectory", { rows }, { auth: true });
      syncToast(j && j.ok ? `✓ ${j.count} comércios enviados à planilha` : "Erro: " + ((j && j.error) || ""), !(j && j.ok));
    };
    document.getElementById("guideDown").onclick = async () => {
      const j = await api("getDirectory", {}, { auth: true });
      if (!j || !j.ok) return syncToast("Erro: " + ((j && j.error) || ""), true);
      if (!j.rows.length) return alert("A aba Guia está vazia. Envie o Guia para a planilha primeiro.");
      if (!confirm(`Atualizar o site com ${j.rows.length} linhas da planilha?`)) return;
      const byId = new Map(STATE.directory.map((b) => [b.id, b]));
      const next = [];
      let add = 0, upd = 0, del = 0;
      j.rows.forEach((r) => {
        const off = String(r.ativo || "").trim().toUpperCase().startsWith("N");
        const old = r.id ? byId.get(r.id) : null;
        if (off) {
          if (old) del++;
          return;
        }
        if (!String(r.name || "").trim()) return;
        const b = old ? Object.assign({}, old) : { id: r.id || "biz-" + Date.now() + "-" + next.length, avatar: "🏪", sponsored: false };
        FIELDS.forEach((k) => {
          if (k === "sponsored") b.sponsored = String(r[k]).toLowerCase() === "true";
          else if (k === "priority") {
            if (String(r[k]).trim() !== "") b.priority = Number(r[k]) || 0;
            else delete b.priority;
          } else if (String(r[k] || "") !== "") b[k] = r[k];
          else if (old && old[k] === undefined) {
            /* mantém ausente */
          } else b[k] = "";
        });
        b.phone = String(b.phone || "").replace(/\D/g, "");
        b.landline = String(b.landline || "").replace(/\D/g, "");
        b.category = categoryLabel(b.catSlug);
        old ? upd++ : add++;
        next.push(b);
      });
      STATE.directory = next;
      logAction("📥 Caixa de Entrada", "Importou Guia da planilha", `${add} novos, ${upd} atualizados, ${del} removidos`);
      saveState();
      syncToast(`✓ Guia atualizado: ${add} novos, ${upd} atualizados, ${del} removidos`);
    };
  }

  // 9. Aba Receita & Backup
  function renderAdminMonetizationTab(container, totalRevenue) {
    const sponsors = STATE.sponsors || [];
    const kit = STATE.adsKit || getDefaultAdsKit();
    if (API_URL && !sponsorsLoaded && !sponsorsLoading) {
      sponsorsLoading = true;
      loadSponsorsFromSheet().then((ok) => {
        sponsorsLoading = false;
        if (ok && currentAdminTab === "monetization") renderAdminView();
      });
    }
    const sheetNote = !API_URL
      ? ""
      : sponsorsLoaded
      ? `<div style="font-size:0.8rem; color:#15803d; margin-bottom:12px;">✓ Contratos sincronizados com a planilha (aba "Contratos"). Cada alteração é salva lá automaticamente.</div>`
      : `<div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">⏳ Carregando contratos da planilha… (se pedir a senha, é a do servidor)</div>`;
    container.innerHTML = `
      ${sheetNote}
      <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:4px;">💰 Controle de Anunciantes, Receita & Exportação para GitHub</h3>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
        Gerencie os pagamentos dos lojistas parceiros da quinzena (Total atual: <strong style="color:var(--brand-secondary);">R$ ${totalRevenue},00</strong>) e exporte o banco de dados pronto para publicar no GitHub.
      </p>

      <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px; padding:16px; background:var(--bg-accent-soft); border-radius:12px; border:1px solid var(--brand-primary);">
        <button class="btn btn-primary" onclick="window.TobiasApp.exportDataJsFile()">
          ⬇️ Baixar data.js Atualizado (Para GitHub)
        </button>
        <button class="btn btn-outline" onclick="window.TobiasApp.exportBackupJson()">
          📦 Exportar Backup JSON
        </button>
        <label class="btn btn-outline" style="cursor:pointer;">
          📂 Importar Backup JSON
          <input type="file" accept=".json" style="display:none;" onchange="window.TobiasApp.importBackupJson(event)" />
        </label>
        <button class="btn-danger" onclick="window.TobiasApp.resetFactoryDefaults()">
          🔄 Restaurar Padrão de Fábrica
        </button>
      </div>

      <h4 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:4px;">📢 Mídia Kit: Planos, Preços e Textos da seção "Anuncie"</h4>
      <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:12px;">O que você alterar aqui muda o bloco "Coloque sua loja…" do portal e as opções de plano dos contratos abaixo.</p>
      <form id="cmsAdsKitForm" class="cms-form-grid two-cols" style="margin-bottom:26px;">
        <div class="cms-field">
          <label>Selo do topo</label>
          <input name="badge" value="${escapeAttr(kit.badge)}" required />
        </div>
        <div class="cms-field">
          <label>Título</label>
          <input name="title" value="${escapeAttr(kit.title)}" required />
        </div>
        <div class="cms-field full">
          <label>Texto de apresentação (aceita &lt;strong&gt;)</label>
          <textarea name="intro" rows="3" required>${escapeHtml(kit.intro)}</textarea>
        </div>
        ${kit.plans
          .map(
            (p, i) => `
        <div class="cms-field full" style="margin-top:6px;"><strong>Plano ${i + 1}</strong></div>
        <div class="cms-field"><label>Nome do plano</label><input name="name${i}" value="${escapeAttr(p.name)}" required /></div>
        <div class="cms-field"><label>Preço (R$)</label><input type="number" min="0" step="1" name="price${i}" value="${escapeAttr(String(p.price))}" required /></div>
        <div class="cms-field"><label>Período (ex.: quinzena, edição, mês)</label><input name="unit${i}" value="${escapeAttr(p.unit)}" required /></div>
        <div class="cms-field"><label>Selo de destaque (opcional, ex.: Mais escolhido)</label><input name="flag${i}" value="${escapeAttr(p.flag || "")}" /></div>
        <div class="cms-field full"><label>O que está incluso</label><input name="desc${i}" value="${escapeAttr(p.desc)}" required /></div>
        <div class="cms-field full"><label style="display:flex; gap:8px; align-items:center;"><input type="radio" name="featured" value="${i}" ${p.featured ? "checked" : ""} /> Destacar este plano em laranja</label></div>`
          )
          .join("")}
        <div class="cms-field full" style="display:flex; justify-content:flex-end;">
          <button type="submit" class="btn btn-primary">💾 Salvar Planos & Preços</button>
        </div>
      </form>

      <h4 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:10px;">📋 Contratos Publicitários da Quinzena</h4>
      <form id="cmsSponsorForm" class="cms-form-grid two-cols">
        <div class="cms-field">
          <label>Lojista / Anunciante</label>
          <input name="client" placeholder="Ex: Supermercado Preço Bom" required />
        </div>
        <div class="cms-field">
          <label>Plano Contratado</label>
          <select name="plan">
            ${((STATE.adsKit || getDefaultAdsKit()).plans || [])
              .map((p) => `<option value="${escapeAttr(planLabel(p))}" data-price="${p.price}">${escapeHtml(planLabel(p))}</option>`)
              .join("")}
          </select>
        </div>
        <div class="cms-field">
          <label>Valor (R$)</label>
          <input type="number" name="amount" value="120" required />
        </div>
        <div class="cms-field">
          <label>Status do Pagamento (Pix/Boleto)</label>
          <select name="status">
            <option value="Pago">✓ Pago</option>
            <option value="Pendente">⏳ Pendente</option>
          </select>
        </div>
        <div class="cms-field full" style="display:flex; justify-content:flex-end;">
          <button type="submit" class="btn btn-primary">+ Registrar Contrato Publicitário</button>
        </div>
      </form>

      <div>
        ${sponsors
          .map(
            (s) => `
          <div class="cms-list-item">
            <div>
              <strong>${s.client}</strong> — <span style="color:var(--brand-secondary); font-weight:800;">R$ ${s.amount},00</span>
              <div style="font-size:0.78rem; color:var(--text-muted);">${s.plan} • Status: <strong>${s.status}</strong></div>
            </div>
            <button class="btn-danger" onclick="window.TobiasApp.deleteItem('sponsors', '${s.id}')">Remover</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    document.getElementById("cmsAdsKitForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const feat = Number(fd.get("featured"));
      STATE.adsKit = {
        badge: (fd.get("badge") || "").trim(),
        title: (fd.get("title") || "").trim(),
        intro: (fd.get("intro") || "").trim(),
        plans: kit.plans.map((_, i) => ({
          name: (fd.get("name" + i) || "").trim(),
          price: Number(fd.get("price" + i)) || 0,
          unit: (fd.get("unit" + i) || "").trim(),
          desc: (fd.get("desc" + i) || "").trim(),
          flag: (fd.get("flag" + i) || "").trim(),
          featured: i === feat
        }))
      };
      logAction("💰 Receita & Backup", "Atualizou Mídia Kit", STATE.adsKit.plans.map((p) => `${p.name} R$ ${p.price}`).join(" | "));
      saveState();
      alert("✓ Planos e preços atualizados no portal!");
    };

    const planSel = document.querySelector("#cmsSponsorForm select[name=plan]");
    const amtInp = document.querySelector("#cmsSponsorForm input[name=amount]");
    if (planSel && amtInp) {
      const sync = () => {
        const o = planSel.selectedOptions[0];
        if (o && o.dataset.price) amtInp.value = o.dataset.price;
      };
      planSel.onchange = sync;
      sync();
    }

    document.getElementById("cmsSponsorForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      if (!STATE.sponsors) STATE.sponsors = [];
      STATE.sponsors.unshift({
        id: "sp-" + Date.now(),
        client: fd.get("client"),
        plan: fd.get("plan"),
        amount: Number(fd.get("amount")),
        status: fd.get("status")
      });
      logAction(
        "💰 Receita & Backup",
        "Registrou Contrato Publicitário",
        `${fd.get("client")} — R$ ${fd.get("amount")} (${fd.get("status")})`
      );
      saveState();
    };
  }

  // --------------------------------------------------------------------------
  // EVENT LISTENERS E API PÚBLICA
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    const searchInput = document.getElementById("directorySearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        directoryLimit = DIR_PAGE;
        renderDirectory();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (!document.body.classList.contains("flipbook-active")) return;
      if (e.key === "ArrowRight") renderFlipbookPage(currentFlipPage + 1);
      if (e.key === "ArrowLeft") renderFlipbookPage(currentFlipPage - 1);
    });
  }

  window.TobiasApp = {
    toggleTheme,

    editBiz(id) {
      editingBizId = id;
      currentAdminTab = "directory";
      renderAdminView();
    },

    switchMode(mode) {
      scheduleShelfFit();
      const btnPortal = document.getElementById("modePortalBtn");
      const btnFlip = document.getElementById("modeFlipBtn");
      const btnAdmin = document.getElementById("modeAdminBtn");

      document.body.classList.remove("flipbook-active", "admin-active");
      if (btnPortal) btnPortal.classList.remove("active");
      if (btnFlip) btnFlip.classList.remove("active");
      if (btnAdmin) btnAdmin.classList.remove("active");

      if (mode === "flipbook") {
        document.body.classList.add("flipbook-active");
        if (btnFlip) btnFlip.classList.add("active");
      } else if (mode === "admin") {
        document.body.classList.add("admin-active");
        if (btnAdmin) btnAdmin.classList.add("active");
        renderAdminView();
      } else {
        if (btnPortal) btnPortal.classList.add("active");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    fillDemoLogin(username, password) {
      const uEl = document.getElementById("loginUsername");
      const pEl = document.getElementById("loginPassword");
      if (uEl && pEl) {
        uEl.value = username;
        pEl.value = password;
      }
    },

    logoutAdmin() {
      if (CURRENT_USER) {
        logAction("🔐 Autenticação", "Logout Realizado", `Encerrou sessão do usuário @${CURRENT_USER.username}`);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
      }
      saveSession(null);
      renderAdminView();
    },

    switchAdminTab(tabName) {
      if (!hasPermission(tabName)) {
        alert("Seu perfil não possui atribuição para acessar este módulo.");
        return;
      }
      currentAdminTab = tabName;
      renderAdminDashboard();
    },

    filterAuditByUser(username) {
      auditFilterUser = username;
      renderAdminDashboard();
    },

    clearAuditLogs() {
      if (confirm("Deseja limpar o histórico de logs de auditoria?")) {
        STATE.auditLogs = [];
        logAction("📋 Logs & Auditoria", "Reinício do Log", "Histórico limpo pelo Administrador");
        saveState();
      }
    },

    exportAuditLogsCsv() {
      const logs = STATE.auditLogs || [];
      const header = ["Data_Hora", "Usuario", "Nome", "Perfil", "Modulo", "Acao", "Detalhes"];
      const rows = logs.map((l) => [
        `"${l.timestamp}"`,
        `"${l.username}"`,
        `"${l.fullName}"`,
        `"${l.roleName}"`,
        `"${l.module}"`,
        `"${l.action}"`,
        `"${(l.details || "").replace(/"/g, '""')}"`
      ]);
      const csv = [header.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tobias-magazine-auditoria-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },

    selectEdition(editionId, targetMode) {
      const ed = (STATE.editionsCatalog || []).find((e) => e.id === editionId);
      if (!ed) return;
      STATE.activeEditionId = ed.id;
      STATE.edition.number = ed.number;
      STATE.edition.periodicity = ed.periodicity;
      STATE.edition.urgentTicker = ed.urgentTicker;
      STATE.edition.coverStory = JSON.parse(JSON.stringify(ed.coverStory));

      // Sincroniza também a Capa e a Página 4 do Flipbook com a edição escolhida
      if (STATE.flipbookPages && STATE.flipbookPages.length >= 4) {
        STATE.flipbookPages[0].section = `CAPA • ${ed.number.toUpperCase()}`;
        STATE.flipbookPages[0].subtitle = ed.coverStory.title;
        STATE.flipbookPages[0].highlight = ed.coverStory.lead;
        STATE.flipbookPages[3].title = ed.coverStory.title;
        STATE.flipbookPages[3].subtitle = ed.coverStory.kicker;
        STATE.flipbookPages[3].highlight = ed.coverStory.lead;
      }

      logAction("📚 Banca Digital", "Trocou Edição Ativa", `Carregou ${ed.number} (${ed.shortLabel})`);
      saveState();
      if (targetMode === "flipbook") {
        currentFlipPage = 1;
        window.TobiasApp.switchMode("flipbook");
      } else {
        window.TobiasApp.switchMode("portal");
      }
    },

    toggleRolePermission(roleId, permId) {
      const role = STATE.roles.find((r) => r.id === roleId);
      if (!role) return;
      if (role.isSystem && permId === "users_rbac") {
        alert("O perfil Administrador Geral não pode perder a atribuição de Gerenciar Perfis.");
        return;
      }
      let actionDesc = "";
      if (role.permissions.includes(permId)) {
        if (role.permissions.length <= 1) {
          alert("O perfil deve ter pelo menos 1 atribuição ativa.");
          return;
        }
        role.permissions = role.permissions.filter((p) => p !== permId);
        actionDesc = `Removeu atribuição [${permId}] do perfil "${role.name}"`;
      } else {
        role.permissions.push(permId);
        actionDesc = `Concedeu atribuição [${permId}] ao perfil "${role.name}"`;
      }
      logAction("🔐 Perfis & Acessos", "Alterou Atribuição de Perfil", actionDesc);
      saveState();
    },

    deleteRole(roleId) {
      const role = STATE.roles.find((r) => r.id === roleId);
      if (!role || role.isSystem) return;
      logAction("🔐 Perfis & Acessos", "Excluiu Perfil", `Removeu o perfil "${role.name}"`);
      STATE.roles = STATE.roles.filter((r) => r.id !== roleId);
      saveState();
    },

    changeUserPasswordPrompt(userId) {
      const u = STATE.users.find((usr) => usr.id === userId);
      if (!u) return;
      const newPass = prompt(`Digite a nova senha para o usuário "${u.username}":`, u.password);
      if (newPass && newPass.trim().length > 0) {
        u.password = newPass.trim();
        if (CURRENT_USER && CURRENT_USER.id === u.id) {
          saveSession(u);
        }
        logAction("🔐 Perfis & Acessos", "Alterou Senha", `Senha atualizada para o usuário @${u.username}`);
        saveState();
        alert(`✓ Senha de "${u.username}" atualizada com sucesso!`);
      }
    },

    deleteUser(userId) {
      const u = STATE.users.find((usr) => usr.id === userId);
      if (!u || u.username === "admin") return;
      logAction("🔐 Perfis & Acessos", "Removeu Usuário", `Excluiu conta @${u.username} (${u.fullName})`);
      STATE.users = STATE.users.filter((usr) => usr.id !== userId);
      saveState();
    },

    deleteItem(collectionName, id) {
      if (!STATE[collectionName]) return;
      const item = STATE[collectionName].find((i) => i.id === id);
      const itemLabel = item ? item.name || item.title || item.client || item.code || id : id;
      logAction(`🗂️ ${collectionName}`, "Excluiu Registro", `Removeu "${itemLabel}"`);
      STATE[collectionName] = STATE[collectionName].filter((i) => i.id !== id);
      saveState();
    },

    toggleBizSponsored(id) {
      const item = STATE.directory.find((b) => b.id === id);
      if (item) {
        item.sponsored = !item.sponsored;
        logAction(
          "🏪 Guia do Comércio",
          item.sponsored ? "Ativou Destaque Patrocinado" : "Removeu Destaque",
          `Comércio: ${item.name}`
        );
        saveState();
      }
    },

    saveFlipPage(event, index) {
      event.preventDefault();
      const fd = new FormData(event.target);
      if (STATE.flipbookPages[index]) {
        STATE.flipbookPages[index].title = fd.get("title");
        STATE.flipbookPages[index].subtitle = fd.get("subtitle");
        STATE.flipbookPages[index].highlight = fd.get("highlight");
        logAction("📖 Páginas Flipbook", `Editou Página ${index + 1}`, `Novo título: "${fd.get("title")}"`);
        saveState();
        alert(`✓ Página ${index + 1} atualizada no Flipbook!`);
      }
    },

    exportDataJsFile() {
      logAction("💰 Receita & Backup", "Exportou data.js", "Gerou arquivo data.js para atualização no GitHub");
      saveState();
      const content = `// ==========================================================================\n// TOBIAS MAGAZINE — Base de Dados Gerada pelo Painel de Gestão (CMS)\n// ==========================================================================\n\nwindow.TOBIAS_DATA = ${JSON.stringify(STATE, null, 2)};\n`;
      const blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.js";
      a.click();
      URL.revokeObjectURL(url);
    },

    exportBackupJson() {
      logAction("💰 Receita & Backup", "Exportou Backup JSON", "Download completo da base local");
      saveState();
      const blob = new Blob([JSON.stringify(STATE, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tobias-magazine-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },

    importBackupJson(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (imported && imported.edition && imported.directory) {
            STATE = imported;
            logAction("💰 Receita & Backup", "Importou Backup JSON", `Arquivo: ${file.name}`);
            saveState();
            alert("✓ Backup importado com sucesso!");
          } else {
            alert("Arquivo JSON inválido.");
          }
        } catch (err) {
          alert("Erro ao ler o arquivo JSON.");
        }
      };
      reader.readAsText(file);
    },

    resetFactoryDefaults() {
      if (confirm("Tem certeza que deseja restaurar todos os dados originais de fábrica da Edição #14?")) {
        localStorage.removeItem(STORAGE_KEY);
        STATE = loadState();
        renderAll();
      }
    },

    filterCategory(catSlug) {
      currentCategory = catSlug;
      directoryLimit = DIR_PAGE;
      closeCategoryMenu();
      renderDirectory();
    },

    toggleCategoryTiles() {
      categoriesExpanded = !categoriesExpanded;
      renderCategoryPills();
    },

    toggleCategoryMenu(ev) {
      if (ev) ev.stopPropagation();
      const menu = document.querySelector("#categoryPills .cat-menu");
      const btn = document.querySelector("#categoryPills .cat-more-btn");
      if (!menu || !btn) return;
      const open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      if (open) {
        const first = menu.querySelector(".cat-menu-item:not([hidden])");
        if (first) first.focus();
      }
    },

    showMoreDirectory() {
      directoryLimit += DIR_PAGE;
      renderDirectory();
    },

    goToPage(num) {
      renderFlipbookPage(num);
    },

    nextPage() {
      renderFlipbookPage(currentFlipPage + 1);
    },

    prevPage() {
      renderFlipbookPage(currentFlipPage - 1);
    },

    copyCoupon(code, btnEl) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
      }
      const original = btnEl.innerHTML;
      btnEl.textContent = "✓ Copiado!";
      setTimeout(() => {
        btnEl.innerHTML = original;
      }, 1800);
    },

    openStory(storyId) {
      const st = STATE.stories.find((s) => s.id === storyId);
      if (!st) return;
      const modal = document.getElementById("genericModal");
      const content = document.getElementById("genericModalContent");
      if (!modal || !content) return;

      content.innerHTML = `
        <div style="text-align:center; padding:8px 0;">
          <div style="font-size:3rem; margin-bottom:8px;">${st.icon}</div>
          <span class="tag-badge">Story do Bairro</span>
          <h3 style="font-family:var(--font-serif); font-size:1.5rem; margin:12px 0 8px;">${st.title}</h3>
          <p style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:20px;">${st.summary}</p>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <a href="${st.ctaTarget}" class="btn btn-primary" onclick="window.TobiasApp.closeModal(); window.TobiasApp.switchMode('portal');">
              ${st.ctaText} →
            </a>
            <button class="btn btn-outline" onclick="window.TobiasApp.closeModal()">Fechar</button>
          </div>
        </div>
      `;
      modal.classList.add("open");
    },

    openCoverModal() {
      const c = STATE.edition.coverStory;
      const modal = document.getElementById("genericModal");
      const content = document.getElementById("genericModalContent");
      if (!modal || !content) return;

      content.innerHTML = `
        <div>
          <span class="section-kicker">${c.kicker}</span>
          <h2 style="font-family:var(--font-serif); font-size:1.55rem; margin:6px 0 10px;">${c.title}</h2>
          <img src="${c.image}" alt="Capa" style="width:100%; height:220px; object-fit:cover; border-radius:10px; margin-bottom:14px;" />
          <div style="font-size:0.95rem; color:var(--text-main); line-height:1.65;">
            ${c.fullText}
          </div>
          <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <button class="btn btn-whatsapp" onclick="window.TobiasApp.shareWhatsAppEdition()">📤 Compartilhar no WhatsApp</button>
            <button class="btn btn-outline" onclick="window.TobiasApp.closeModal()">Fechar Leitura</button>
          </div>
        </div>
      `;
      modal.classList.add("open");
    },

    openSubmitModal(type) {
      const hpInput = '<input name="hp" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;" aria-hidden="true" />';
      const modal = document.getElementById("genericModal");
      const content = document.getElementById("genericModalContent");
      if (!modal || !content) return;

      if (type === "biz") {
        content.innerHTML = `
          <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:6px;">🏪 Cadastrar Meu Negócio no Guia do Bairro</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px;">${API_URL ? "Preencha os dados abaixo. Nossa equipe confere e publica no Guia da Vizinhança." : "Preencha os dados abaixo para aparecer imediatamente no Guia da Vizinhança."}</p>
          <form id="publicBizForm" style="display:flex; flex-direction:column; gap:10px; position:relative;">
            <input name="hp" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;" aria-hidden="true" />
            <input required name="name" placeholder="Nome da Loja ou Profissional" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <select name="catSlug" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);">
            ${categoryOptionsHtml(true)}
          </select>
            <input required name="address" placeholder="Endereço ou Rua" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <input required name="hours" placeholder="Horário de Atendimento" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <input required name="phone" placeholder="WhatsApp com DDD (ex: 5579999990000)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <textarea required name="description" rows="2" placeholder="O que você oferece para os vizinhos?" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);"></textarea>
            <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:8px;">
              <button type="button" class="btn btn-outline" onclick="window.TobiasApp.closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary">${API_URL ? "Enviar para aprovação" : "Publicar no Guia"}</button>
            </div>
          </form>
        `;
        document.getElementById("publicBizForm").onsubmit = async (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          if (API_URL) {
            const btn = e.target.querySelector("button[type=submit]");
            btn.disabled = true;
            const j = await api("suggest", {
              type: "biz",
              hp: fd.get("hp"),
              fields: {
                name: fd.get("name"), catSlug: fd.get("catSlug"), address: fd.get("address"),
                hours: fd.get("hours"), phone: fd.get("phone"), description: fd.get("description")
              }
            });
            if (j && j.ok) {
              content.innerHTML = `<div style="text-align:center; padding:18px 6px;"><h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:8px;">✓ Recebemos seu cadastro!</h3><p style="color:var(--text-secondary); margin-bottom:16px;">Vamos conferir os dados e publicar no Guia em breve.</p><button class="btn btn-primary" onclick="window.TobiasApp.closeModal()">Fechar</button></div>`;
            } else {
              btn.disabled = false;
              alert("Não foi possível enviar agora: " + ((j && j.error) || "erro") + ". Tente novamente.");
            }
            return;
          }
          STATE.directory.unshift({
            id: "biz-" + Date.now(),
            name: fd.get("name"),
            catSlug: fd.get("catSlug"),
            category: categoryLabel(fd.get("catSlug")),
            avatar: "⭐",
            sponsored: false,
            description: fd.get("description"),
            address: fd.get("address"),
            hours: fd.get("hours"),
            phone: fd.get("phone").replace(/\D/g, ""),
            status: "Novo no Bairro"
          });
          logAction("🏪 Guia do Comércio", "Cadastro via Portal", `Novo negócio: ${fd.get("name")}`);
          saveState();
          window.TobiasApp.closeModal();
        };
      } else if (type === "lead") {
        const plans = ((STATE.adsKit || getDefaultAdsKit()).plans || [])
          .map((p) => `<option value="${escapeAttr(planLabel(p))}">${escapeHtml(planLabel(p))}</option>`)
          .join("");
        const inp = 'style="padding:10px; border-radius:8px; border:1px solid var(--border-color);"';
        content.innerHTML = `
          <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:6px;">🚀 Quero Anunciar na Tobias Magazine</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px;">Conte um pouco sobre seu negócio e entramos em contato pelo WhatsApp.</p>
          <form id="publicLeadForm" style="display:flex; flex-direction:column; gap:10px; position:relative;">
            ${hpInput}
            <input required name="loja" placeholder="Nome da loja ou serviço" ${inp} />
            <input name="responsavel" placeholder="Seu nome" ${inp} />
            <input required name="whatsapp" placeholder="Seu WhatsApp com DDD" inputmode="tel" ${inp} />
            <input name="ramo" placeholder="Ramo (ex.: padaria, salão, farmácia)" ${inp} />
            <select name="plano" ${inp}>${plans}</select>
            <textarea name="mensagem" rows="2" placeholder="Algo que queira nos contar? (opcional)" ${inp}></textarea>
            <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:8px;">
              <button type="button" class="btn btn-outline" onclick="window.TobiasApp.closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary">Enviar pedido</button>
            </div>
          </form>
        `;
        document.getElementById("publicLeadForm").onsubmit = async (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const btn = e.target.querySelector("button[type=submit]");
          btn.disabled = true;
          const j = await api("lead", {
            hp: fd.get("hp"),
            fields: {
              loja: fd.get("loja"), responsavel: fd.get("responsavel"), whatsapp: fd.get("whatsapp"),
              ramo: fd.get("ramo"), plano: fd.get("plano"), mensagem: fd.get("mensagem")
            }
          });
          if (j && j.ok) {
            track("anuncie", "lead", "Pedidos de anúncio enviados");
            content.innerHTML = `<div style="text-align:center; padding:18px 6px;"><h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:8px;">✓ Pedido recebido!</h3><p style="color:var(--text-secondary); margin-bottom:16px;">Em breve entraremos em contato pelo WhatsApp.</p><button class="btn btn-primary" onclick="window.TobiasApp.closeModal()">Fechar</button></div>`;
          } else {
            btn.disabled = false;
            alert("Não foi possível enviar agora: " + ((j && j.error) || "erro") + ". Tente o botão do WhatsApp.");
          }
        };
      } else {
        content.innerHTML = `
          <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:6px;">📌 Publicar Classificado do Morador</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px;">Divulgue imóvel, venda, vaga ou adoção pet gratuitamente no mural do bairro.${API_URL ? " Nossa equipe confere antes de publicar." : ""}</p>
          <form id="publicClassifiedForm" style="display:flex; flex-direction:column; gap:10px; position:relative;">
            <input name="hp" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;" aria-hidden="true" />
            <select name="category" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);">
              <option value="Compra & Venda">Compra & Venda</option>
              <option value="Imóveis • Aluguel/Venda">Imóveis • Aluguel/Venda</option>
              <option value="Empregos no Bairro">Empregos no Bairro</option>
              <option value="Doação Responsável Pet">Doação Responsável Pet</option>
            </select>
            <input required name="title" placeholder="Título do Anúncio" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <input required name="price" placeholder="Preço ou Condição (ex: R$ 800 ou Grátis)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <input required name="phone" placeholder="Seu WhatsApp com DDD" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <textarea required name="details" rows="2" placeholder="Detalhes..." style="padding:10px; border-radius:8px; border:1px solid var(--border-color);"></textarea>
            <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:8px;">
              <button type="button" class="btn btn-outline" onclick="window.TobiasApp.closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary">${API_URL ? "Enviar para aprovação" : "Publicar Anúncio"}</button>
            </div>
          </form>
        `;
        document.getElementById("publicClassifiedForm").onsubmit = async (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          if (API_URL) {
            const btn = e.target.querySelector("button[type=submit]");
            btn.disabled = true;
            const j = await api("suggest", {
              type: "classified",
              hp: fd.get("hp"),
              fields: { category: fd.get("category"), title: fd.get("title"), price: fd.get("price"), phone: fd.get("phone"), details: fd.get("details") }
            });
            if (j && j.ok) {
              content.innerHTML = `<div style="text-align:center; padding:18px 6px;"><h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:8px;">✓ Recebemos seu anúncio!</h3><p style="color:var(--text-secondary); margin-bottom:16px;">Vamos conferir e publicar no mural em breve.</p><button class="btn btn-primary" onclick="window.TobiasApp.closeModal()">Fechar</button></div>`;
            } else {
              btn.disabled = false;
              alert("Não foi possível enviar agora: " + ((j && j.error) || "erro") + ". Tente novamente.");
            }
            return;
          }
          STATE.classifieds.unshift({
            id: "cl-" + Date.now(),
            category: fd.get("category"),
            badgeColor: "#ff9c0d",
            title: fd.get("title"),
            price: fd.get("price"),
            details: fd.get("details"),
            phone: fd.get("phone").replace(/\D/g, "")
          });
          logAction("📌 Classificados", "Anúncio via Portal", `Título: ${fd.get("title")} (${fd.get("price")})`);
          saveState();
          window.TobiasApp.closeModal();
        };
      }
      modal.classList.add("open");
    },

    closeModal() {
      const modal = document.getElementById("genericModal");
      if (modal) modal.classList.remove("open");
    },

    // Integração Dinâmica com as Configurações do WhatsApp
    shareWhatsAppEdition() {
      const w = STATE.whatsappConfig || getDefaultWhatsappConfig();
      const url = w.qrPosterUrl || window.location.href;
      const msg = (w.shareTemplate || "")
        .replace(/\{EDICAO\}/g, STATE.edition.number)
        .replace(/\{URL\}/g, url);
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    },

    contactCommercialWhatsApp() {
      track("comercial", "comercial", "Falar com Comercial (WhatsApp)");
      const w = STATE.whatsappConfig || getDefaultWhatsappConfig();
      const phone = w.comercialPhone || "5579999990000";
      const msg = w.commercialTemplate || "Olá! Quero anunciar meu comércio na Tobias Magazine!";
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    },

    // ========================================================================
    // SISTEMA DEDICADO DE IMPRESSÃO A4 (SEM DESCONFIGURAR O LAYOUT)
    // ========================================================================
    triggerCleanPrint(htmlContent) {
      const printBox = document.getElementById("printableArea");
      if (!printBox) return;
      printBox.innerHTML = htmlContent;
      document.body.classList.add("printing-active");
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.body.classList.remove("printing-active");
          printBox.innerHTML = "";
        }, 400);
      }, 150);
    },

    // 1. Imprimir Cartaz de Vitrine QR Code (1 Página A4 Perfeitamente Centralizada)
    printPosterA4() {
      const w = STATE.whatsappConfig || getDefaultWhatsappConfig();
      logAction("🖨️ Impressão A4", "Imprimiu Cartaz QR Code", `Edição: ${STATE.edition.number}`);
      saveState();

      const html = `
        <div class="print-poster-a4">
          <div style="background:#181614; color:#fff; display:inline-block; padding:6px 18px; border-radius:99px; font-family:monospace; font-size:13px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase;">
            LOJA PARCEIRA OFICIAL • ${STATE.edition.number}
          </div>

          <h1 style="font-family:Georgia, serif; font-size:36px; font-weight:900; margin:16px 0 6px; letter-spacing:-0.02em; color:#03326f;">
            TOBIAS MAGAZINE
          </h1>
          <div style="font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#524d47; margin-bottom:20px;">
            O Jornal & Revista Digital do Nosso Bairro
          </div>

          <div style="background:#f6f7f9; border:2px dashed #03326f; border-radius:14px; padding:18px; margin-bottom:22px;">
            <h2 style="font-family:Georgia, serif; font-size:24px; font-weight:900; color:#181614; margin-bottom:8px;">
              ${w.qrPosterTitle}
            </h2>
            <p style="font-size:15px; color:#524d47; max-width:460px; margin:0 auto;">
              Aponte a câmera do seu celular para o QR Code abaixo e acesse gratuitamente o <strong>Guia do Comércio no WhatsApp</strong>, <strong>Horários do Posto de Saúde</strong>, <strong>Cupons de Desconto</strong> e <strong>Classificados</strong>:
            </p>
          </div>

          <div style="width:230px; height:230px; margin:0 auto 18px; padding:14px; border:4px solid #181614; border-radius:16px; background:#fff;">
            <svg viewBox="0 0 100 100" width="100%" height="100%" fill="#181614">
              <rect x="5" y="5" width="26" height="26" fill="none" stroke="#181614" stroke-width="6"/>
              <rect x="13" y="13" width="10" height="10"/>
              <rect x="69" y="5" width="26" height="26" fill="none" stroke="#181614" stroke-width="6"/>
              <rect x="77" y="13" width="10" height="10"/>
              <rect x="5" y="69" width="26" height="26" fill="none" stroke="#181614" stroke-width="6"/>
              <rect x="13" y="77" width="10" height="10"/>
              <rect x="40" y="8" width="6" height="6"/>
              <rect x="52" y="8" width="6" height="12"/>
              <rect x="40" y="20" width="6" height="12"/>
              <rect x="46" y="38" width="12" height="6"/>
              <rect x="10" y="42" width="18" height="6"/>
              <rect x="34" y="46" width="8" height="16"/>
              <rect x="50" y="50" width="14" height="8"/>
              <rect x="72" y="42" width="18" height="6"/>
              <rect x="78" y="54" width="12" height="12"/>
              <rect x="42" y="70" width="12" height="6"/>
              <rect x="60" y="68" width="8" height="18"/>
              <rect x="40" y="82" width="14" height="10"/>
              <rect x="74" y="76" width="18" height="8"/>
              <rect x="82" y="88" width="10" height="6"/>
            </svg>
          </div>

          <div style="font-family:monospace; font-size:13px; font-weight:800; color:#1b6b53; margin-bottom:8px;">
            🌐 ${w.qrPosterUrl}
          </div>
          <div style="font-size:14px; font-weight:700; color:#181614;">
            📱 ${w.qrPosterFooter} • 📞 Redação WhatsApp: ${w.redacaoPhone}
          </div>
        </div>
      `;
      this.triggerCleanPrint(html);
    },

    // 2. Imprimir Boletim / Edição Completa Diagramada em A4 (Estilo Jornal Impresso para Mural)
    printFullEditionA4() {
      logAction("🖨️ Impressão A4", "Imprimiu Boletim da Edição", `Edição: ${STATE.edition.number}`);
      saveState();

      const c = STATE.edition.coverStory;
      const html = `
        <div class="print-newspaper-sheet">
          <div style="border-bottom:3px solid #181614; padding-bottom:10px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
              <h1 style="font-family:Georgia, serif; font-size:30px; font-weight:900; margin:0; color:#181614;">
                TOBIAS <span style="color:#03326f; font-style:italic;">Magazine</span>
              </h1>
              <div style="font-size:12px; font-weight:700; color:#524d47;">
                JORNAL & GUIA COMUNITÁRIO DO BAIRRO • VERSÃO IMPRESSA PARA MURAL E CONDOMÍNIOS
              </div>
            </div>
            <div style="text-align:right; font-family:monospace; font-size:12px; font-weight:800;">
              <div>${STATE.edition.number}</div>
              <div>${STATE.edition.periodicity}</div>
            </div>
          </div>

          <div style="background:#fef2f2; border:1.5px solid #b91c1c; color:#b91c1c; padding:8px 12px; border-radius:6px; font-size:12px; font-weight:700; margin-bottom:14px;">
            ⚡ ${STATE.edition.urgentTicker}
          </div>

          <div class="print-sheet-block">
            <div style="font-size:11px; font-weight:800; color:#03326f; text-transform:uppercase;">${c.kicker}</div>
            <h2 style="font-family:Georgia, serif; font-size:20px; font-weight:900; margin:4px 0 6px;">${c.title}</h2>
            <p style="font-size:13px; color:#333; margin-bottom:8px;"><strong>${c.lead}</strong></p>
            <div style="font-size:12.5px; color:#222; line-height:1.5;">${c.fullText}</div>
          </div>

          <div class="print-sheet-block">
            <h3 style="font-family:Georgia, serif; font-size:16px; margin-bottom:8px; color:#1b6b53;">
              🏪 Guia Rápido do Comércio & Profissionais do Bairro (WhatsApp)
            </h3>
            <table style="width:100%; border-collapse:collapse; font-size:12px;">
              ${STATE.directory
                .map(
                  (b) => `
                <tr style="border-bottom:1px dashed #ccc;">
                  <td style="padding:5px 2px;"><strong>${b.avatar || ""} ${b.name}</strong> (${b.category})</td>
                  <td style="padding:5px 2px;">📍 ${b.address}</td>
                  <td style="padding:5px 2px; text-align:right; font-family:monospace; font-weight:700;">📞 ${b.phone}</td>
                </tr>
              `
                )
                .join("")}
            </table>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;" class="print-sheet-block">
            <div>
              <h3 style="font-family:Georgia, serif; font-size:15px; margin-bottom:6px; color:#03326f;">
                🏷️ Cupons de Desconto da Quinzena
              </h3>
              ${STATE.promotions
                .map(
                  (p) => `
                <div style="font-size:11.5px; margin-bottom:6px; padding:6px; border:1px dashed #03326f; border-radius:4px;">
                  <strong>[${p.discount}] ${p.store}</strong> — Código: <strong>${p.code}</strong><br/>
                  <span>${p.title}</span>
                </div>
              `
                )
                .join("")}
            </div>
            <div>
              <h3 style="font-family:Georgia, serif; font-size:15px; margin-bottom:6px; color:#03326f;">
                📅 Agenda Cultural & Horários Úteis
              </h3>
              ${STATE.events
                .map(
                  (ev) => `
                <div style="font-size:11.5px; margin-bottom:5px;">
                  • <strong>${ev.day}/${ev.month} (${ev.time}):</strong> ${ev.title} — <em>${ev.location}</em>
                </div>
              `
                )
                .join("")}
            </div>
          </div>

          <div style="text-align:center; font-size:11px; color:#555; margin-top:10px;">
            Acesse a versão interativa no celular: <strong>${(STATE.whatsappConfig && STATE.whatsappConfig.qrPosterUrl) || "https://ebersantana.github.io/TobiasMagazine/"}</strong>
          </div>
        </div>
      `;
      this.triggerCleanPrint(html);
    },

    // 3. Imprimir Relatório de Auditoria de Acessos e Ações em A4
    printAuditLogsA4() {
      const logs = STATE.auditLogs || [];
      const html = `
        <div class="print-newspaper-sheet">
          <h1 style="font-family:Georgia, serif; font-size:22px; margin-bottom:4px;">
            📋 Relatório Oficial de Auditoria & Logs de Acesso — Tobias Magazine
          </h1>
          <p style="font-size:12px; color:#555; margin-bottom:14px;">
            Gerado em: ${new Date().toLocaleString("pt-BR")} • Total de Eventos Registrados: ${logs.length}
          </p>
          <table style="width:100%; border-collapse:collapse; font-size:11px;">
            <thead>
              <tr style="background:#f3efe9; border-bottom:2px solid #181614;">
                <th style="padding:6px; text-align:left;">Data/Hora</th>
                <th style="padding:6px; text-align:left;">Usuário</th>
                <th style="padding:6px; text-align:left;">Perfil</th>
                <th style="padding:6px; text-align:left;">Módulo</th>
                <th style="padding:6px; text-align:left;">Ação</th>
                <th style="padding:6px; text-align:left;">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              ${logs
                .map(
                  (l) => `
                <tr style="border-bottom:1px solid #ddd;">
                  <td style="padding:5px;">${l.timestamp}</td>
                  <td style="padding:5px;"><strong>${l.fullName}</strong> (@${l.username})</td>
                  <td style="padding:5px;">${l.roleName}</td>
                  <td style="padding:5px;">${l.module}</td>
                  <td style="padding:5px;"><strong>${l.action}</strong></td>
                  <td style="padding:5px;">${l.details}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
      this.triggerCleanPrint(html);
    }
  };
})();
