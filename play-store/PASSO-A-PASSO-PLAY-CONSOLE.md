# Tobias Magazine na Google Play — passo a passo

Tempo estimado: 1 tarde para preparar tudo, e de 2 a 3 semanas até a publicação (por causa do teste fechado de 14 dias e da análise do Google).
Regras da Google mudam: onde estiver escrito "confirme", confira na tela da Play Console.

## Valores prontos para copiar

| Campo | Valor |
|---|---|
| Endereço do portal | https://ebersantana.github.io/TobiasMagazine/ |
| Nome do app | Tobias Magazine |
| Nome curto / do ícone | Tobias Magazine |
| ID do pacote (não muda nunca mais) | `io.github.ebersantana.tobiasmagazine` |
| Versão / código da versão | 1.0.0 / 1 |
| Cor da barra de status | `#03326F` |
| Cor de fundo da abertura | `#F6F7F9` |
| Modo de exibição | Standalone (tela cheia) |
| Notificações, localização, Play Billing | Desligados |
| Política de privacidade | https://ebersantana.github.io/TobiasMagazine/privacidade.html |

Textos, ícone 512, imagem de destaque, capturas, respostas de "Segurança dos dados" e classificação etária: veja `FICHA-GOOGLE-PLAY.md` e os arquivos desta pasta.

---

## Parte A — Gerar o pacote do app (PWABuilder, cerca de 15 min)

O portal já passou na checagem de instalabilidade do Chrome (manifesto, ícones, capturas, atalhos e service worker).

1. Acesse **pwabuilder.com**, cole o endereço do portal e clique em **Start**.
2. Espere a análise. Os itens obrigatórios (manifesto, service worker, HTTPS) devem aparecer em verde. Avisos opcionais podem ser ignorados.
3. Clique em **Package for stores** > **Android** > **Generate Package** (opção Google Play).
4. Preencha com os valores da tabela acima. Em **Signing key**, escolha **Create new** e informe seu nome, organização (pode ser o seu nome) e país (BR).
5. Marque **Include source code** (facilita atualizações futuras) e baixe o arquivo `.zip`.
6. **Guarde o zip em dois lugares seguros (por exemplo, no Drive e em um pen drive).** Dentro dele estão a chave `signing.keystore` e as senhas (`signing-key-info.txt`). Sem elas não é possível atualizar o app. Nunca coloque esses arquivos em repositório público.
7. Conteúdo do zip: o arquivo `.aab` é o que vai para a Play Store; o `.apk` serve para instalar direto no seu celular e testar.

## Parte B — Tirar a barra do navegador (Digital Asset Links)

Sem esta parte o app funciona, mas mostra a barra de endereço no topo.

O Android procura o arquivo na raiz do endereço (`ebersantana.github.io/.well-known/assetlinks.json`), mas o portal está em uma subpasta. Por isso é preciso um repositório para a raiz.

1. Siga o `LEIA-ME-assetlinks.md` (pasta `site-raiz-assetlinks`) para criar o repositório `EberSantana.github.io`.
2. Depois que o app estiver cadastrado na Play Console, abra **Configuração > Integridade do app > Assinatura de apps** e copie a **impressão digital SHA-256** da *chave de assinatura do app*.
3. Abra o `signing-key-info.txt` do PWABuilder e copie o SHA-256 da *chave de upload*.
4. Cole as duas impressões digitais no `assetlinks.json` (substituindo os dois "COLE_AQUI") e salve no GitHub.
5. Confira em: `https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://ebersantana.github.io&relation=delegate_permission/common.handle_all_urls`. O resultado deve listar o seu pacote.
6. Reinstale o app no celular. A barra do navegador deve sumir.

## Parte C — Play Console

1. **Criar a conta de desenvolvedor** em play.google.com/console/signup.
   - Taxa única de cerca de US$ 25 (confirme o valor atual).
   - Conta **pessoal** é mais simples. Conta de **organização** (IFS ou empresa júnior) exige CNPJ e número D-U-N-S.
   - O Google pede documento com foto e confirmação por um aparelho Android. A verificação pode levar alguns dias.
   - A conta fica em nome de quem a criou; decida antes se será sua ou da futura empresa júnior.
2. **Criar o app**: nome Tobias Magazine, idioma Português (Brasil), tipo App, gratuito.
3. **Configuração do app** (lista de tarefas no painel):
   - Política de privacidade: cole o endereço da tabela.
   - Acesso ao app: todas as funções disponíveis sem login.
   - Anúncios: o app não contém anúncios.
   - Classificação de conteúdo: questionário, respostas na ficha (resultado esperado: Livre).
   - Público-alvo: 18 anos ou mais (não marque crianças).
   - Segurança dos dados: use a tabela da ficha.
   - Se aparecer a declaração de **app de notícias**, declare como publicação local própria do Prof. Eber Santana.
   - Demais declarações (governo, finanças, saúde): responda "não".
4. **Ficha principal da loja**: categoria Notícias e revistas; cole os textos; envie o ícone 512, a imagem de destaque 1024×500 e as capturas (mínimo 2); informe o e-mail de contato (ele aparece publicamente).
5. **Teste fechado** (Testes > Teste fechado > Criar versão):
   - Envie o `.aab` e aceite o uso da Assinatura de apps do Google.
   - Crie a lista de testadores com e-mails de Gmail (alunos e colegas) e compartilhe o link de adesão.
   - Contas pessoais novas costumam precisar de **12 testadores por 14 dias seguidos** (confirme a regra atual). Peça que cada um abra o app de vez em quando.
6. **Solicitar acesso à produção** quando a Play Console liberar o botão, respondendo ao breve questionário sobre o teste.
7. **Produção** (Produção > Criar versão): envie o `.aab`, escreva as notas da versão (use o texto de "Novidades" da ficha) e envie para análise. A análise leva de alguns dias a cerca de uma semana.

## Depois de publicado

- Mudanças de conteúdo e de visual no portal aparecem no app sozinhas, sem nova versão na loja.
- Só é preciso um novo `.aab` se mudar o ícone, as cores do manifesto ou o nome. Nesse caso, aumente o **código da versão** (2, 3…) e use a mesma chave de assinatura.
- Responda às avaliações na Play Console e revise a política de privacidade se o portal passar a coletar outros dados.

## Antes de enviar (não pule)

1. Trocar o conteúdo de exemplo (Seu Tobias, cupons, notícia da Ótica) por conteúdo real. A Google reprova informação enganosa.
2. Trocar as senhas padrão da Gestão e confirmar a senha real no Apps Script.
3. Testar o `.apk` em um celular Android real.
4. Ter o repositório da raiz publicado (parte B), senão o app abre com a barra do navegador.

## Se der problema

| Sintoma | Provável causa |
|---|---|
| App abre com barra de endereço | `assetlinks.json` ausente, com impressão digital errada ou com outro ID de pacote |
| Play reprova por "app que é só um site" | Falta valor próprio; destaque o funcionamento sem internet, o guia local e o conteúdo exclusivo na descrição |
| Não consigo atualizar o app | Chave `signing.keystore` perdida; por isso o backup em dois lugares |
| Teste fechado não conta dias | Menos de 12 testadores ativos ou adesão não concluída pelo link |
