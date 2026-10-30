#!/bin/bash
# Atualiza o número de versão dos arquivos (styles.css, scripts) no index.html,
# para o celular baixar a versão nova em vez do cache. Rode antes de cada publicação.
cd "$(dirname "$0")"
V=$(date +%Y%m%d%H%M)
sed -i -E "s#(href=\"styles\.css)(\?v=[0-9]+)?\"#\1?v=$V\"#; s#(src=\"(icons|config|data|app|a11y|pwa)\.js)(\?v=[0-9]+)?\"#\1?v=$V\"#" index.html
echo "Versão aplicada: $V"
