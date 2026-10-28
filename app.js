// ==========================================================================
// TOBIAS MAGAZINE — Lógica Interativa (Portal Mobile-First + Flipbook 10 Pág)
// ==========================================================================

(function () {
  const DATA = window.TOBIAS_DATA;
  let currentCategory = "todos";
  let searchQuery = "";
  let currentFlipPage = 1;
  const totalFlipPages = DATA.flipbookPages.length; // 10 páginas enxutas

  // Inicialização
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    renderTickerAndHero();
    renderStoriesBar();
    renderDirectory();
    renderUtilitySection();
    renderPeopleSection();
    renderPromotions();
    renderEvents();
    renderClassifieds();
    renderFlipbookPage(currentFlipPage);
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
    if (tickerEl) tickerEl.textContent = DATA.edition.urgentTicker;

    const coverEl = document.getElementById("heroCoverBox");
    if (coverEl) {
      const c = DATA.edition.coverStory;
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
            <button class="btn btn-glass" onclick="window.TobiasApp.switchMode('flipbook')">📱 Folhear Revista (10 Pág)</button>
          </div>
        </div>
      `;
    }
  }

  // --------------------------------------------------------------------------
  // STORIES DO BAIRRO (VÍDEOS CURTOS / DESTAQUES RÁPIDOS)
  // --------------------------------------------------------------------------
  function renderStoriesBar() {
    const container = document.getElementById("storiesBar");
    if (!container) return;

    container.innerHTML = DATA.stories
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
  // 1. GUIA DO COMÉRCIO E SERVIÇOS (FILTRO + BUSCA + WHATSAPP)
  // --------------------------------------------------------------------------
  function renderDirectory() {
    const grid = document.getElementById("directoryGrid");
    if (!grid) return;

    const customSaved = JSON.parse(localStorage.getItem("tobias_custom_biz") || "[]");
    const allBiz = [...customSaved, ...DATA.directory];

    const filtered = allBiz.filter((item) => {
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
            <div class="biz-avatar">${biz.avatar}</div>
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
      newsList.innerHTML = DATA.utilityNews
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
      schedBody.innerHTML = DATA.essentialSchedules
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

    grid.innerHTML = DATA.peopleStories
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

    grid.innerHTML = DATA.promotions
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

    grid.innerHTML = DATA.events
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

    const customAds = JSON.parse(localStorage.getItem("tobias_custom_classifieds") || "[]");
    const allAds = [...customAds, ...DATA.classifieds];

    grid.innerHTML = allAds
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
    currentFlipPage = Math.max(1, Math.min(totalFlipPages, pageNum));
    const pageData = DATA.flipbookPages[currentFlipPage - 1];

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
      dotsContainer.innerHTML = DATA.flipbookPages
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
            <span>TOBIAS MAGAZINE • EDIÇÃO #14</span>
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
            📤 Enviar no WhatsApp do Condomínio
          </button>
        </div>
      </div>
    `;
  }

  function buildFlipbookPageBody(type) {
    switch (type) {
      case "cover":
        return `
          <div style="border-radius:12px; overflow:hidden; height:230px; background:url('${DATA.edition.coverStory.image}') center/cover; display:flex; align-items:flex-end; padding:14px; color:#fff; box-shadow:inset 0 -90px 60px rgba(0,0,0,0.75);">
            <div>
              <span class="tag-badge">Destaque da Quinzena</span>
              <h4 style="font-family:var(--font-serif); font-size:1.15rem; margin-top:6px;">Padaria Seu Tobias completa 40 anos de história</h4>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:12px; font-size:0.8rem;">
            <div style="background:var(--bg-accent-soft); padding:8px 10px; border-radius:8px;"><strong>Pág. 3:</strong> Cortes de Água & UBS</div>
            <div style="background:var(--bg-accent-soft); padding:8px 10px; border-radius:8px;"><strong>Pág. 5-6:</strong> Guia WhatsApp</div>
            <div style="background:var(--bg-accent-soft); padding:8px 10px; border-radius:8px;"><strong>Pág. 8:</strong> Agenda da Praça</div>
            <div style="background:var(--bg-accent-soft); padding:8px 10px; border-radius:8px;"><strong>Pág. 9:</strong> 4 Cupons de Desconto</div>
          </div>
        `;
      case "editorial":
        return `
          <div style="font-size:0.88rem; display:flex; flex-direction:column; gap:10px;">
            <p>Bem-vindo à <strong>14ª edição da Tobias Magazine</strong>! Nossa missão é valorizar quem vive, trabalha e empreende no nosso bairro.</p>
            <p><strong>Formato Enxuto Mobile-First:</strong> Seguindo as melhores práticas de revistas digitais modernas, cada edição tem exatamente <strong>10 páginas</strong> de leitura rápida para você folhear no ônibus, na fila do pão ou no sofá de casa.</p>
            <div style="background:var(--ok-bg); color:var(--ok-text); padding:12px; border-radius:8px; font-weight:600;">
              ✓ Periodicidade Quinzenal • ✓ Botões Clicáveis para WhatsApp • ✓ QR Code nas Lojas Parceiras
            </div>
          </div>
        `;
      case "utility":
        return DATA.utilityNews
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
        return `
          <div style="font-size:0.86rem; line-height:1.55;">
            ${DATA.edition.coverStory.fullText}
          </div>
        `;
      case "directory1":
        return DATA.directory
          .slice(0, 4)
          .map(
            (b) => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-bottom:1px dashed var(--border-color); font-size:0.84rem;">
            <div>
              <strong>${b.avatar} ${b.name}</strong>
              <div style="font-size:0.75rem; color:var(--text-muted);">${b.address} • ${b.hours}</div>
            </div>
            <a class="btn btn-whatsapp" style="padding:5px 10px; font-size:0.74rem;" href="https://wa.me/${b.phone}" target="_blank">WhatsApp</a>
          </div>
        `
          )
          .join("");
      case "directory2":
        return DATA.directory
          .slice(4, 8)
          .map(
            (b) => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-bottom:1px dashed var(--border-color); font-size:0.84rem;">
            <div>
              <strong>${b.avatar} ${b.name}</strong>
              <div style="font-size:0.75rem; color:var(--text-muted);">${b.category} • ${b.status}</div>
            </div>
            <a class="btn btn-whatsapp" style="padding:5px 10px; font-size:0.74rem;" href="https://wa.me/${b.phone}" target="_blank">Chamar</a>
          </div>
        `
          )
          .join("");
      case "people":
        return DATA.peopleStories
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
        return DATA.events
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
        return DATA.promotions
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
            ${DATA.classifieds
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
              <strong>🚀 Anuncie seu Comércio na Edição #15!</strong>
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

  // --------------------------------------------------------------------------
  // EVENT LISTENERS E FUNÇÕES PÚBLICAS
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    const searchInput = document.getElementById("directorySearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderDirectory();
      });
    }

    // Teclas esquerda/direita para folhear quando no modo Flipbook
    document.addEventListener("keydown", (e) => {
      if (!document.body.classList.contains("flipbook-active")) return;
      if (e.key === "ArrowRight") renderFlipbookPage(currentFlipPage + 1);
      if (e.key === "ArrowLeft") renderFlipbookPage(currentFlipPage - 1);
    });
  }

  // Expor API global para botões inline
  window.TobiasApp = {
    toggleTheme,

    switchMode(mode) {
      const btnPortal = document.getElementById("modePortalBtn");
      const btnFlip = document.getElementById("modeFlipBtn");
      if (mode === "flipbook") {
        document.body.classList.add("flipbook-active");
        if (btnPortal) btnPortal.classList.remove("active");
        if (btnFlip) btnFlip.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.body.classList.remove("flipbook-active");
        if (btnFlip) btnFlip.classList.remove("active");
        if (btnPortal) btnPortal.classList.add("active");
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
      const st = DATA.stories.find((s) => s.id === storyId);
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
      const c = DATA.edition.coverStory;
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
          <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:6px;">🏪 Cadastrar Comércio ou Serviço Local</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px;">Seu cadastro aparece imediatamente no Guia do Bairro deste dispositivo e pode ser enviado para a redação.</p>
          <form id="addBizForm" style="display:flex; flex-direction:column; gap:10px;">
            <input required name="name" placeholder="Nome da Loja ou Profissional (ex: Seu João Encanador)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <select name="catSlug" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);">
              <option value="alimentacao">Padarias, Mercados & Alimentação</option>
              <option value="saude">Farmácias & Saúde</option>
              <option value="pets">Pet Shops & Veterinária</option>
              <option value="reparos">Chaveiros & Reparos</option>
              <option value="profissionais">Profissionais Liberais (Eletricista, Manicure, etc.)</option>
            </select>
            <input required name="address" placeholder="Endereço ou Rua de Atendimento" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <input required name="hours" placeholder="Horário (ex: Seg a Sáb • 08h às 18h)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <input required name="phone" placeholder="WhatsApp com DDD (somente números, ex: 5579999990000)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <textarea required name="description" rows="3" placeholder="Resumo do que você oferece para os vizinhos..." style="padding:10px; border-radius:8px; border:1px solid var(--border-color);"></textarea>
            <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:8px;">
              <button type="button" class="btn btn-outline" onclick="window.TobiasApp.closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary">Publicar no Guia</button>
            </div>
          </form>
        `;
        document.getElementById("addBizForm").onsubmit = (ev) => {
          ev.preventDefault();
          const fd = new FormData(ev.target);
          const newBiz = {
            id: "biz-custom-" + Date.now(),
            name: fd.get("name"),
            category: "Parceiro da Vizinhança",
            catSlug: fd.get("catSlug"),
            avatar: "⭐",
            sponsored: true,
            description: fd.get("description"),
            address: fd.get("address"),
            hours: fd.get("hours"),
            phone: fd.get("phone").replace(/\D/g, ""),
            status: "Novo no Guia!"
          };
          const list = JSON.parse(localStorage.getItem("tobias_custom_biz") || "[]");
          list.unshift(newBiz);
          localStorage.setItem("tobias_custom_biz", JSON.stringify(list));
          renderDirectory();
          window.TobiasApp.closeModal();
        };
      } else {
        content.innerHTML = `
          <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:6px;">📌 Publicar Classificado do Morador</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px;">Divulgue aluguel, venda, vaga de emprego ou adoção pet gratuitamente no bairro.</p>
          <form id="addClassifiedForm" style="display:flex; flex-direction:column; gap:10px;">
            <select name="category" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);">
              <option value="Compra & Venda">Compra & Venda</option>
              <option value="Imóveis • Aluguel/Venda">Imóveis • Aluguel/Venda</option>
              <option value="Empregos no Bairro">Empregos no Bairro</option>
              <option value="Doação Responsável Pet">Doação Responsável Pet</option>
            </select>
            <input required name="title" placeholder="Título do Anúncio (ex: Vendo Geladeira Frost Free)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <input required name="price" placeholder="Valor ou Condição (ex: R$ 950 ou Adoção Gratuita)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <input required name="phone" placeholder="Seu WhatsApp (ex: 5579999990000)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color);" />
            <textarea required name="details" rows="3" placeholder="Detalhes e localização no bairro..." style="padding:10px; border-radius:8px; border:1px solid var(--border-color);"></textarea>
            <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:8px;">
              <button type="button" class="btn btn-outline" onclick="window.TobiasApp.closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary">Publicar Anúncio</button>
            </div>
          </form>
        `;
        document.getElementById("addClassifiedForm").onsubmit = (ev) => {
          ev.preventDefault();
          const fd = new FormData(ev.target);
          const newAd = {
            id: "cl-custom-" + Date.now(),
            category: fd.get("category"),
            badgeColor: "#d94e1f",
            title: fd.get("title"),
            price: fd.get("price"),
            details: fd.get("details"),
            phone: fd.get("phone").replace(/\D/g, "")
          };
          const list = JSON.parse(localStorage.getItem("tobias_custom_classifieds") || "[]");
          list.unshift(newAd);
          localStorage.setItem("tobias_custom_classifieds", JSON.stringify(list));
          renderClassifieds();
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
      const text = `🗞️ *TOBIAS MAGAZINE — Edição #14 no ar!* \nConfira o Guia do Comércio no WhatsApp, horários do Posto de Saúde, Agenda da Praça e 4 Cupons de Desconto no nosso bairro:\n${url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };
})();
