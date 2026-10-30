# Repositório da raiz (necessário para o app abrir em tela cheia)

O Android só tira a barra do navegador do app se o arquivo `assetlinks.json` estiver na RAIZ do endereço:
`https://ebersantana.github.io/.well-known/assetlinks.json`

Como o portal fica em `ebersantana.github.io/TobiasMagazine/` (repositório de projeto), a raiz precisa de um repositório próprio:

1. No GitHub, crie um repositório PÚBLICO chamado exatamente `EberSantana.github.io`.
2. Envie para ele o conteúdo desta pasta (`index.html`, `.nojekyll` e a pasta `.well-known`). Atenção: a pasta `.well-known` começa com ponto; no envio pelo navegador, use "Add file > Upload files" arrastando a pasta, ou use o git.
3. Em Settings > Pages, publique a partir da branch `main`, pasta `/ (root)`.
4. Abra `https://ebersantana.github.io/.well-known/assetlinks.json` e confira que o arquivo aparece.
5. Depois do primeiro envio do app à Play Console, troque os dois "COLE_AQUI..." pelas impressões digitais SHA-256 (ver PASSO-A-PASSO, parte B) e salve.

Se um dia o portal tiver domínio próprio, o arquivo passa a ficar nesse domínio e este repositório deixa de ser necessário.
