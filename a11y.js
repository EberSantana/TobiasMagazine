/* Tobias Magazine — camada de acessibilidade (WCAG 2.1 AA / eMAG / Lei 10.098) */
(function () {
  "use strict";
  var uid = 0;
  // 1) Rótulos acessíveis para campos sem <label> (usa placeholder/título/opção)
  function labelFields(root) {
    var fields = (root || document).querySelectorAll("input, select, textarea");
    fields.forEach(function (el) {
      if (el.type === "hidden" || el.type === "submit" || el.type === "button") return;
      if (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby")) return;
      if (el.labels && el.labels.length) return;
      var wrap = el.closest("label");
      if (wrap) return;
      var txt = el.getAttribute("placeholder") || el.getAttribute("title") || "";
      if (!txt) {
        var prev = el.previousElementSibling;
        if (prev && /^(LABEL|SPAN|DIV|STRONG|H\d)$/.test(prev.tagName) && prev.textContent.trim().length < 80) txt = prev.textContent.trim();
      }
      if (!txt && el.parentElement) {
        var l = el.parentElement.querySelector("label");
        if (l && l.textContent.trim()) { if (!l.id) l.id = "lbl-auto-" + (++uid); el.setAttribute("aria-labelledby", l.id); return; }
      }
      if (!txt && el.name) txt = el.name.replace(/[-_]/g, " ");
      if (!txt && el.tagName === "SELECT") txt = "Selecionar opção";
      if (txt) el.setAttribute("aria-label", txt);
    });
    (root || document).querySelectorAll("button, a").forEach(function (b) {
      if (b.textContent.trim() || b.getAttribute("aria-label") || b.getAttribute("aria-labelledby")) return;
      var t = b.getAttribute("title");
      if (t) b.setAttribute("aria-label", t);
    });
  }
  // 2) Modal: role=dialog, foco, Esc e retorno do foco
  var lastFocus = null;
  function setupModal() {
    var m = document.getElementById("genericModal");
    if (!m) return;
    var box = document.getElementById("genericModalContent") || m;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    new MutationObserver(function () {
      var open = m.classList.contains("open");
      if (open) {
        if (!box.getAttribute("aria-label") && !box.getAttribute("aria-labelledby")) {
          var h = box.querySelector("h1,h2,h3");
          if (h) { if (!h.id) h.id = "modal-title-auto"; box.setAttribute("aria-labelledby", h.id); }
          else box.setAttribute("aria-label", "Janela de diálogo");
        }
        if (!m.dataset.wasOpen) { lastFocus = document.activeElement; m.dataset.wasOpen = "1"; }
        box.setAttribute("tabindex", "-1");
        labelFields(box);
        var f = box.querySelector("input:not([type=hidden]), select, textarea, button");
        (f || box).focus();
      } else if (m.dataset.wasOpen) {
        delete m.dataset.wasOpen;
        box.removeAttribute("aria-labelledby");
        if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
      }
    }).observe(m, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && m.classList.contains("open")) {
        if (window.TobiasApp && window.TobiasApp.closeModal) window.TobiasApp.closeModal(); else m.classList.remove("open");
      }
      if (e.key === "Tab" && m.classList.contains("open")) {
        var els = box.querySelectorAll("a[href],button:not([disabled]),input:not([type=hidden]):not([disabled]),select,textarea,[tabindex]:not([tabindex='-1'])");
        if (!els.length) return;
        var first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
  // 3) Skip link move o foco para o conteúdo
  function setupSkip() {
    var s = document.getElementById("skipLink");
    if (!s) return;
    s.addEventListener("click", function (e) {
      var adminVisible = document.getElementById("gestao-conteudo") && document.getElementById("gestao-conteudo").offsetParent !== null;
      var t = document.getElementById(adminVisible ? "gestao-conteudo" : "conteudo");
      if (t) { e.preventDefault(); t.setAttribute("tabindex", "-1"); t.focus(); t.scrollIntoView(); }
    });
  }
  var pending = false;
  function schedule() {
    if (pending) return; pending = true;
    setTimeout(function () { pending = false; labelFields(document); }, 80);
  }
  function init() {
    setupModal(); setupSkip(); labelFields(document);
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
