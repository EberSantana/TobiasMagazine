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
    { id: "monetization", label: "💰 9. Receita & Backup", desc: "Contratos publicitários, backup e data.js" },
    { id: "users_rbac", label: "🔐 10. Perfis & Acessos", desc: "Criar perfis, atribuições e usuários (Exclusivo Admin)" }
  ];

  // Perfis padrão pré-configurados (O Administrador pode criar novos perfis personalizados)
  function getDefaultRoles() {
    return [
      {
        id: "role-admin",
        name: "Administrador Geral",
        badgeColor: "#d94e1f",
        description: "Acesso total a todos os módulos, financeiro, exportação e criação de perfis/usuários.",
        permissions: ALL_MODULES.map((m) => m.id),
        isSystem: true
      },
      {
        id: "role-editor",
        name: "Editor de Pauta & Jornalismo",
        badgeColor: "#1b6b53",
        description: "Gerencia Edição & Capa, Utilidade Pública, Gente do Bairro, Agenda Cultural e Páginas do Flipbook.",
        permissions: ["edition", "utility", "people", "events", "flipbook"],
        isSystem: false
      },
      {
        id: "role-comercial",
        name: "Gestor Comercial & Guia",
        badgeColor: "#d99b1f",
        description: "Gerencia Guia do Comércio, Cupons de Promoções, Classificados e Contratos Publicitários.",
        permissions: ["directory", "promotions", "classifieds", "monetization"],
        isSystem: false
      },
      {
        id: "role-colab",
        name: "Colaborador Comunitário",
        badgeColor: "#1f3a60",
        description: "Apoia na atualização de Utilidade Pública, Agenda da Praça e moderação de Classificados.",
        permissions: ["utility", "events", "classifieds"],
        isSystem: false
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

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.edition && parsed.directory) {
          if (!parsed.sponsors) parsed.sponsors = getDefaultSponsors();
          if (!parsed.roles) parsed.roles = getDefaultRoles();
          if (!parsed.users) parsed.users = getDefaultUsers();
          if (!parsed.editionsCatalog || parsed.editionsCatalog.length < 6) {
            parsed.editionsCatalog = JSON.parse(JSON.stringify(window.TOBIAS_DATA.editionsCatalog || []));
          }
          if (!parsed.activeEditionId) parsed.activeEditionId = "ed-14";
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Erro ao carregar estado salvo:", e);
    }
    const clone = JSON.parse(JSON.stringify(window.TOBIAS_DATA));
    clone.sponsors = getDefaultSponsors();
    clone.roles = getDefaultRoles();
    clone.users = getDefaultUsers();
    clone.activeEditionId = "ed-14";
    return clone;
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
  let currentCategory = "todos";
  let searchQuery = "";
  let currentFlipPage = 1;
  let currentAdminTab = "edition";

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
    renderAll();
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
    renderFlipbookPage(currentFlipPage);
    renderAdminView();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    renderAll();
    setupEventListeners();
  });

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

    // 1. Barra horizontal no topo
    const topShelf = document.getElementById("editionsTopShelf");
    if (topShelf) {
      topShelf.innerHTML = catalog
        .map(
          (ed) => `
        <button class="edition-switch-pill ${ed.id === activeId ? "active" : ""}"
                onclick="window.TobiasApp.selectEdition('${ed.id}')">
          🗞️ ${ed.shortLabel}
        </button>
      `
        )
        .join("");
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
              <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
                <span class="tag-badge" style="background:${isCurrent ? "var(--brand-primary)" : "rgba(0,0,0,0.65)"};">
                  ${isCurrent ? "● Lendo Agora" : ed.badge}
                </span>
                <span style="font-family:var(--font-mono); font-size:0.7rem; background:rgba(0,0,0,0.6); padding:3px 8px; border-radius:99px;">
                  ${ed.periodicity}
                </span>
              </div>
              <div>
                <div style="font-family:var(--font-mono); font-size:0.72rem; color:#fcd34d; font-weight:800;">
                  ${ed.number}
                </div>
                <h3 style="font-family:var(--font-serif); font-size:1.08rem; font-weight:800; line-height:1.2; margin-top:2px;">
                  ${ed.coverStory.title}
                </h3>
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

    container.innerHTML = STATE.stories
      .map(
        (st) => `
      <button class="story-item" onclick="window.TobiasApp.openStory('${st.id}')">
        <div class="story-ring">
          <div class="story-avatar">${st.icon}</div>
        </div>
        <span class="story-label">${st.label}</span>
      </button>
    `
      )
      .join("");
  }

  // --------------------------------------------------------------------------
  // 1. GUIA DO COMÉRCIO E SERVIÇOS
  // --------------------------------------------------------------------------
  function renderDirectory() {
    const grid = document.getElementById("directoryGrid");
    if (!grid) return;

    const countAllBtn = document.getElementById("catCountAll");
    if (countAllBtn) countAllBtn.textContent = `Todos (${STATE.directory.length})`;

    const filtered = STATE.directory.filter((item) => {
      const matchCat = currentCategory === "todos" || item.catSlug === currentCategory;
      const q = searchQuery.toLowerCase();
      const matchText =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchCat && matchText;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 32px; background: var(--bg-surface); border-radius: 12px; border: 1px dashed var(--border-color);">
          <p style="font-size:1.05rem; font-weight:700;">Nenhum comércio ou profissional encontrado para "${searchQuery}".</p>
          <p style="color:var(--text-muted); font-size:0.88rem; margin-top:6px;">Tente buscar por padaria, chaveiro, eletricista, farmácia ou pet shop.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map(
        (biz) => `
      <article class="biz-card ${biz.sponsored ? "sponsored" : ""}">
        ${biz.sponsored ? '<span class="sponsored-ribbon">★ Destaque do Bairro</span>' : ""}
        <div>
          <div class="biz-header">
            <div class="biz-avatar">${biz.avatar || "🏪"}</div>
            <div>
              <span class="biz-category">${biz.category}</span>
              <h3 class="biz-name">${biz.name}</h3>
            </div>
          </div>
          <p class="biz-desc" style="margin-top:10px;">${biz.description}</p>
        </div>
        <div>
          <div class="biz-meta">
            <span>📍 ${biz.address}</span>
            <span>🕒 ${biz.hours}</span>
          </div>
          <div class="biz-footer" style="margin-top:12px;">
            <span class="status-dot">● ${biz.status}</span>
            <a class="btn btn-whatsapp" style="padding:7px 12px; font-size:0.8rem;"
               href="https://wa.me/${biz.phone}?text=${encodeURIComponent(`Olá! Vi o contato de *${biz.name}* no Guia da Tobias Magazine e gostaria de atendimento.`)}"
               target="_blank" rel="noopener">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </article>
    `
      )
      .join("");
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

    grid.innerHTML = STATE.promotions
      .map(
        (pr) => `
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
             href="https://wa.me/${pr.phone}?text=${encodeURIComponent(`Olá! Quero usar o cupom *${pr.code}* (${pr.discount}) que vi na Tobias Magazine!`)}"
             target="_blank" rel="noopener">
            Resgatar no WhatsApp →
          </a>
        </div>
      </article>
    `
      )
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
          <div style="font-size:0.76rem; color:var(--text-muted); font-weight:700;">
            🕒 ${ev.time} • 📍 ${ev.location}
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
          <span style="display:inline-block; background:${cl.badgeColor || "#1f3a60"}; color:#fff; font-size:0.68rem; font-weight:800; padding:2px 8px; border-radius:4px; text-transform:uppercase; margin-bottom:8px;">
            ${cl.category}
          </span>
          <h3 style="font-family:var(--font-serif); font-size:1.05rem; font-weight:800; margin-bottom:6px;">${cl.title}</h3>
          <p style="font-size:0.84rem; color:var(--text-secondary);">${cl.details}</p>
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--border-color); padding-top:10px; margin-top:6px;">
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
            <strong style="color:var(--brand-primary);">${u.badge} (${u.date})</strong>
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
            <span style="color:var(--brand-primary); font-weight:800; font-size:0.7rem; text-transform:uppercase;">${p.type}</span>
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
              <strong style="color:var(--brand-primary);">[${c.discount}] ${c.store}</strong>
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
            <input id="loginPassword" type="password" name="password" placeholder="Digite sua senha (padrão: 123)" required />
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
        const errEl = document.getElementById("loginErrorMsg");
        if (errEl) {
          errEl.style.display = "block";
          errEl.textContent = "✗ Usuário ou senha inválidos. Tente novamente.";
        }
        return;
      }

      saveSession(found);
      const role = getActiveRole();
      if (role && role.permissions.length > 0) {
        currentAdminTab = role.permissions[0];
      }
      renderAdminView();
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
      userBadge.innerHTML = `👤 <strong>${CURRENT_USER.fullName}</strong> • <span style="background:${role.badgeColor || "#d94e1f"}; padding:2px 8px; border-radius:99px; font-size:0.72rem;">${role.name}</span>`;
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
        <span class="kpi-num">${STATE.peopleStories.length}</span>
        <span class="kpi-label">🎙️ Matérias & Publis</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">${STATE.promotions.length}</span>
        <span class="kpi-label">🏷️ Cupons Ativos</span>
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
      <button class="admin-tab-btn ${m.id === currentAdminTab ? "active" : ""}"
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
    } else if (currentAdminTab === "users_rbac") {
      renderAdminRbacTab(panelContainer);
    }
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
              <option value="#1f3a60">🔵 Azul Institucional</option>
              <option value="#d99b1f">🟡 Dourado Comercial</option>
              <option value="#7c3aed">🟣 Roxo Criativo</option>
              <option value="#d94e1f">🟠 Terracota Principal</option>
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
                  <span style="background:${r.badgeColor || "#1f3a60"}; color:#fff; font-size:0.72rem; font-weight:800; padding:3px 9px; border-radius:99px;">
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
                    Perfil: <strong style="color:var(--brand-primary);">${r ? r.name : "Sem perfil"}</strong>
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
      } else {
        STATE.users.push({
          id: "usr-" + Date.now(),
          username: uName,
          password: fd.get("password"),
          fullName: fd.get("fullName"),
          roleId: fd.get("roleId")
        });
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
          <label>⚡ Ticker de Utilidade Pública (Barra Vermelha no Topo)</label>
          <input name="urgentTicker" value="${ed.urgentTicker}" required />
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
      STATE.edition.coverStory.kicker = fd.get("kicker");
      STATE.edition.coverStory.readingTime = fd.get("readingTime");
      STATE.edition.coverStory.title = fd.get("title");
      STATE.edition.coverStory.lead = fd.get("lead");
      STATE.edition.coverStory.image = fd.get("image");
      STATE.edition.coverStory.fullText = fd.get("fullText");
      saveState();
      alert("✓ Edição e Reportagem de Capa atualizadas com sucesso!");
    };
  }

  // 2. Aba Guia do Comércio
  function renderAdminDirectoryTab(container) {
    container.innerHTML = `
      <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:4px;">🏪 Gerenciar Guia do Comércio & Profissionais (${STATE.directory.length})</h3>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">Cadastre novas padarias, farmácias, pet shops, chaveiros ou profissionais liberais e destaque patrocinadores.</p>

      <form id="cmsDirForm" class="cms-form-grid two-cols">
        <div class="cms-field">
          <label>Nome do Comércio / Profissional</label>
          <input name="name" placeholder="Ex: Mercadinho São José" required />
        </div>
        <div class="cms-field">
          <label>Categoria</label>
          <select name="catSlug">
            <option value="alimentacao">🥖 Padarias & Mercados</option>
            <option value="saude">💊 Farmácias & Saúde</option>
            <option value="pets">🐾 Pet Shops</option>
            <option value="reparos">🔑 Chaveiros & Reparos</option>
            <option value="profissionais">⚡ Profissionais Liberais</option>
          </select>
        </div>
        <div class="cms-field">
          <label>Ícone (Emoji) & Selo</label>
          <input name="avatar" value="🏪" required />
        </div>
        <div class="cms-field">
          <label>WhatsApp com DDD (Somente números)</label>
          <input name="phone" placeholder="5579999990000" required />
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
          <button type="submit" class="btn btn-primary">+ Adicionar ao Guia do Bairro</button>
        </div>
      </form>

      <div>
        ${STATE.directory
          .map(
            (b) => `
          <div class="cms-list-item">
            <div>
              <strong>${b.avatar} ${b.name}</strong> ${b.sponsored ? '<span class="tag-badge" style="font-size:0.65rem;">★ Patrocinado</span>' : ""}
              <div style="font-size:0.78rem; color:var(--text-muted);">${b.category} • 📍 ${b.address} • 📞 ${b.phone}</div>
            </div>
            <div style="display:flex; gap:8px;">
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
      profissionais: "Profissionais Liberais"
    };

    document.getElementById("cmsDirForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const slug = fd.get("catSlug");
      STATE.directory.unshift({
        id: "biz-" + Date.now(),
        name: fd.get("name"),
        catSlug: slug,
        category: catLabels[slug] || "Comércio Local",
        avatar: fd.get("avatar") || "🏪",
        sponsored: fd.get("sponsored") === "true",
        description: fd.get("description"),
        address: fd.get("address"),
        hours: fd.get("hours"),
        phone: fd.get("phone").replace(/\D/g, ""),
        status: fd.get("status")
      });
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
      STATE.promotions.unshift({
        id: "pr-" + Date.now(),
        store: fd.get("store"),
        discount: fd.get("discount").toUpperCase(),
        code: fd.get("code").toUpperCase().replace(/\s+/g, ""),
        validUntil: fd.get("validUntil"),
        phone: fd.get("phone").replace(/\D/g, ""),
        title: fd.get("title")
      });
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
        badgeColor: "#1f3a60",
        title: fd.get("title"),
        price: fd.get("price"),
        details: fd.get("details"),
        phone: fd.get("phone").replace(/\D/g, "")
      });
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
              <strong style="color:var(--brand-primary); font-family:var(--font-mono);">PÁGINA ${p.pageNumber} — ${p.section}</strong>
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

  // 9. Aba Receita & Backup
  function renderAdminMonetizationTab(container, totalRevenue) {
    const sponsors = STATE.sponsors || [];
    container.innerHTML = `
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

      <h4 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:10px;">📋 Contratos Publicitários da Quinzena</h4>
      <form id="cmsSponsorForm" class="cms-form-grid two-cols">
        <div class="cms-field">
          <label>Lojista / Anunciante</label>
          <input name="client" placeholder="Ex: Supermercado Preço Bom" required />
        </div>
        <div class="cms-field">
          <label>Plano Contratado</label>
          <select name="plan">
            <option value="Plano Guia & Rodapé (R$ 49)">Plano Guia & Rodapé (R$ 49)</option>
            <option value="Destaque Página Inteira (R$ 120)">Destaque Página Inteira (R$ 120)</option>
            <option value="Publieditorial + Reels (R$ 220)">Publieditorial + Reels (R$ 220)</option>
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

    switchMode(mode) {
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
      if (role.permissions.includes(permId)) {
        if (role.permissions.length <= 1) {
          alert("O perfil deve ter pelo menos 1 atribuição ativa.");
          return;
        }
        role.permissions = role.permissions.filter((p) => p !== permId);
      } else {
        role.permissions.push(permId);
      }
      saveState();
    },

    deleteRole(roleId) {
      const role = STATE.roles.find((r) => r.id === roleId);
      if (!role || role.isSystem) return;
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
        saveState();
        alert(`✓ Senha de "${u.username}" atualizada com sucesso!`);
      }
    },

    deleteUser(userId) {
      const u = STATE.users.find((usr) => usr.id === userId);
      if (!u || u.username === "admin") return;
      STATE.users = STATE.users.filter((usr) => usr.id !== userId);
      saveState();
    },

    deleteItem(collectionName, id) {
      if (!STATE[collectionName]) return;
      STATE[collectionName] = STATE[collectionName].filter((item) => item.id !== id);
      saveState();
    },

    toggleBizSponsored(id) {
      const item = STATE.directory.find((b) => b.id === id);
      if (item) {
        item.sponsored = !item.sponsored;
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
        saveState();
        alert(`✓ Página ${index + 1} atualizada no Flipbook!`);
      }
    },

    exportDataJsFile() {
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

    filterCategory(catSlug, btnEl) {
      currentCategory = catSlug;
      document.querySelectorAll(".cat-pill").forEach((el) => el.classList.remove("active"));
      if (btnEl) btnEl.classList.add("active");
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
      const original = btnEl.textContent;
      btnEl.textContent = "✓ Copiado!";
      setTimeout(() => {
        btnEl.textContent = original;
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
          <span class="tag-badge">Story do Bairro • ⏱️ ${st.duration}</span>
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
      const modal = document.getElementById("genericModal");
      const content = document.getElementById("genericModalContent");
      if (!modal || !content) return;

      if (type === "biz") {
        content.innerHTML = `
          <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:6px;">🏪 Cadastrar Meu Negócio no Guia do Bairro</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px;">Preencha os dados abaixo para aparecer imediatamente no Guia da Vizinhança.</p>
          <form id="publicBizForm" style="display:flex; flex-direction:column; gap:10px;">
            <input required name="name" placeholder="Nome da Loja ou Profissional" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <select name="catSlug" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);">
              <option value="alimentacao">Padarias & Mercados</option>
              <option value="saude">Farmácias & Saúde</option>
              <option value="pets">Pet Shops</option>
              <option value="reparos">Chaveiros & Reparos</option>
              <option value="profissionais">Profissionais Liberais</option>
            </select>
            <input required name="address" placeholder="Endereço ou Rua" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <input required name="hours" placeholder="Horário de Atendimento" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <input required name="phone" placeholder="WhatsApp com DDD (ex: 5579999990000)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <textarea required name="description" rows="2" placeholder="O que você oferece para os vizinhos?" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);"></textarea>
            <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:8px;">
              <button type="button" class="btn btn-outline" onclick="window.TobiasApp.closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary">Publicar no Guia</button>
            </div>
          </form>
        `;
        document.getElementById("publicBizForm").onsubmit = (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          STATE.directory.unshift({
            id: "biz-" + Date.now(),
            name: fd.get("name"),
            catSlug: fd.get("catSlug"),
            category: "Parceiro Local",
            avatar: "⭐",
            sponsored: false,
            description: fd.get("description"),
            address: fd.get("address"),
            hours: fd.get("hours"),
            phone: fd.get("phone").replace(/\D/g, ""),
            status: "Novo no Bairro"
          });
          saveState();
          window.TobiasApp.closeModal();
        };
      } else {
        content.innerHTML = `
          <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:6px;">📌 Publicar Classificado do Morador</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px;">Divulgue imóvel, venda, vaga ou adoção pet gratuitamente no mural do bairro.</p>
          <form id="publicClassifiedForm" style="display:flex; flex-direction:column; gap:10px;">
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
              <button type="submit" class="btn btn-primary">Publicar Anúncio</button>
            </div>
          </form>
        `;
        document.getElementById("publicClassifiedForm").onsubmit = (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          STATE.classifieds.unshift({
            id: "cl-" + Date.now(),
            category: fd.get("category"),
            badgeColor: "#d94e1f",
            title: fd.get("title"),
            price: fd.get("price"),
            details: fd.get("details"),
            phone: fd.get("phone").replace(/\D/g, "")
          });
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

    shareWhatsAppEdition() {
      const url = window.location.href;
      const text = `🗞️ *TOBIAS MAGAZINE — ${STATE.edition.number} no ar!* \nConfira o Guia do Comércio no WhatsApp, horários do Posto de Saúde, Agenda da Praça e Cupons de Desconto no nosso bairro:\n${url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };
})();
