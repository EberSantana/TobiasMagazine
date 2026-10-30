/* PWA: registra o service worker e oferece a instalação do app (Android e iPhone). */
(function () {
  "use strict";
  var KEY = "tm_pwa_aviso";
  function lido() { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function marcar() { try { localStorage.setItem(KEY, "1"); } catch (e) {} }
  function instalado() { return (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true; }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
  if (instalado()) return;

  var evento = null;
  function aviso(texto, botao, acao) {
    if (lido() || document.getElementById("pwaAviso")) return;
    var d = document.createElement("div");
    d.id = "pwaAviso"; d.className = "pwa-aviso"; d.setAttribute("role", "region"); d.setAttribute("aria-label", "Instalar aplicativo");
    var p = document.createElement("p"); p.textContent = texto; d.appendChild(p);
    if (botao) { var b = document.createElement("button"); b.type = "button"; b.className = "pwa-instalar"; b.textContent = botao; b.onclick = function () { acao(); d.remove(); }; d.appendChild(b); }
    var f = document.createElement("button"); f.type = "button"; f.className = "pwa-fechar"; f.textContent = "Agora não"; f.onclick = function () { marcar(); d.remove(); };
    d.appendChild(f); document.body.appendChild(d);
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); evento = e;
    setTimeout(function () {
      aviso("Instale o Tobias Magazine no seu celular e abra como um aplicativo.", "Instalar", function () {
        evento.prompt(); evento.userChoice.finally(marcar);
      });
    }, 4000);
  });
  window.addEventListener("appinstalled", function () { marcar(); var a = document.getElementById("pwaAviso"); if (a) a.remove(); });

  var ua = navigator.userAgent || "";
  var iphone = /iPhone|iPad|iPod/.test(ua) && !window.MSStream;
  var safari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  if (iphone && safari) {
    setTimeout(function () { aviso("Para instalar no iPhone: toque em Compartilhar e depois em “Adicionar à Tela de Início”.", null, null); }, 5000);
  }
})();
