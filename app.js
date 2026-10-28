// ==========================================================================
// TOBIAS MAGAZINE — Lógica Interativa + Painel Completo de Gestão (CMS Local)
// ==========================================================================

(function () {
  const STORAGE_KEY = "tobias_cms_state_v1";

  // Carrega estado salvo no CMS ou clona a base padrão do data.js
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.edition && parsed.directory) {
          if (!parsed.sponsors) parsed.sponsors = getDefaultSponsors();
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Erro ao ler estado salvo, usando padrão:", e);
    }
    const clone = JSON.parse(JSON.stringify(window.TOBIAS_DATA));
    clone.sponsors = getDefaultSponsors();
    return clone;
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

  let STATE = loadState();
  let currentCategory = "todos";
  let searchQuery = "";
  let currentFlipPage = 1;
  let currentAdminTab = "edition";

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
    renderAll();
  }

  function renderAll() {
    renderTickerAndHero();
    renderStoriesBar();
    renderDirectory();
    renderUtilitySection();
    renderPeopleSection();
    renderPromotions();
    renderEvents();
    renderClassifieds();
    renderFlipbookPage(currentFlipPage);
    renderAdminDashboard();
  }

  // Inicialização
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
  // TICKER & HERO DE CAPA
  // --------------------------------------------------------------------------
  function renderTickerAndHero() {
    const tickerEl = document.getElementById("urgentTickerText");
    if (tickerEl) tickerEl.textContent = STATE.edition.urgentTicker;

    const editionMetaEl = document.getElementById("headerEditionMeta");
    if (editionMetaEl) {
      editionMetaEl.innerHTML = `📍 <strong>${STATE.edition.number} • ${STATE.edition.periodicity}</strong> • Leitura Mobile-First (${STATE.flipbookPages.length} Páginas)`;
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
  // 3. HISTÓRIAS DE MORADORES (GENTE DO BAIRRO & PUBLIEDITORIAL)
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
  // 4. ACHADOS E PROMOÇÕES (CUPONS COPIÁVEIS)
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
  // 5. AGENDA DE EVENTOS E LAZER
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
  // MODO FLIPBOOK INTERATIVO (10 PÁGINAS ENXUTAS PARA CELULAR)
  // --------------------------------------------------------------------------
  function renderFlipbookPage(pageNum) {
    const totalFlipPages = STATE.flipbookPages.length;
    currentFlipPage = Math.max(1, Math.min(totalFlipPages, pageNum));
    const pageData = STATE.flipbookPages[currentFlipPage - 1];

    const stage = document.getElementById("magazineStage");
    const counter = document.getElementById("flipPageCounter");
    const progressFill = document.getElementById("flipProgressFill");
    const dotsContainer = document.getElementById("flipPageDots");

    if (counter) {
      counter.textContent = `Página ${currentFlipPage} de ${totalFlipPages}`;
    }
    if (progressFill) {
      progressFill.style.width = `${(currentFlipPage / totalFlipPages) * 100}%`;
    }
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
  // PAINEL DE GESTÃO / CMS EDITORIAL (ADMIN)
  // ==========================================================================
  function renderAdminDashboard() {
    const kpiContainer = document.getElementById("adminKpis");
    const panelContainer = document.getElementById("adminContentPanel");
    if (!kpiContainer || !panelContainer) return;

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
        <span class="kpi-num">${STATE.events.length + STATE.classifieds.length}</span>
        <span class="kpi-label">📅 Eventos & Anúncios</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num" style="color:var(--brand-secondary);">R$ ${totalRevenue}</span>
        <span class="kpi-label">💰 Receita da Edição</span>
      </div>
    `;

    // Atualiza estado visual das abas laterais
    document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === currentAdminTab);
    });

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
    }
  }

  // 1. Aba Edição, Alerta Topo e Reportagem de Capa
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

  // 2. Aba Guia do Comércio e Profissionais
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

  // 3. Aba Utilidade Pública e Horários Fixos
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

  // 5. Aba Achados & Promoções (Cupons)
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

  // 6. Aba Agenda de Eventos & Lazer
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

  // 7. Aba Classificados Locais
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

  // 8. Aba Editor das 10 Páginas do Flipbook
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

  // 9. Aba Monetização, Anunciantes, Backup JSON e Exportação data.js
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
        renderAdminDashboard();
      } else {
        if (btnPortal) btnPortal.classList.add("active");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    switchAdminTab(tabName) {
      currentAdminTab = tabName;
      renderAdminDashboard();
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
      if (type === "biz") {
        window.TobiasApp.switchMode("admin");
        window.TobiasApp.switchAdminTab("directory");
      } else {
        window.TobiasApp.switchMode("admin");
        window.TobiasApp.switchAdminTab("classifieds");
      }
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
