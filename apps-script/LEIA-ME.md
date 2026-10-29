# Servidor de dados (Google Apps Script)

1. Abra o projeto em script.google.com, apague o conteúdo de `Code.gs` e cole o de `apps-script/Code.gs`.
2. Troque `TROQUE-ESTA-SENHA` por uma senha só sua.
3. Implantar → Nova implantação → tipo **App da Web** → Executar como: **Eu** → Quem tem acesso: **Qualquer pessoa** → Implantar. Autorize o acesso ao Drive.
4. Copie o link terminado em `/exec` e cole em `config.js` (`apiUrl`).
5. No Gestão, ao salvar algo, o site pede a senha uma vez por sessão e publica para todos.

Ao alterar o `Code.gs` depois, use Implantar → Gerenciar implantações → Editar → Nova versão (o link continua o mesmo).
