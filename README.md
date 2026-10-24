# Kurio — Marketplace de NFTs

Marketplace de NFTs com catálogo, detalhe, favoritos, carrinho, checkout com carteira simulada, recibo de pedido e área da conta (perfil, senha e carteiras). Todo o backend é simulado no navegador com **MSW** (REST e Socket.IO), com dados persistidos em `localStorage`, cenários determinísticos e eventos em tempo real.

**Stack:** React 19, TypeScript, Vite 8, TanStack Router, TanStack Query, Axios, Socket.IO Client, React Hook Form + Zod, Tailwind CSS 4, Radix UI, MSW 2 e Playwright.

A organização do código e as decisões técnicas estão em [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Requisitos

- Node.js **22.12** ou superior (exigência do Vite 8)
- npm 10 ou superior

## Setup

```bash
npm ci
npm run dev
```

A aplicação abre em `http://localhost:5173` já com os mocks ativos. Não há backend real nem serviço externo: um checkout limpo do repositório é suficiente.

## Variáveis de ambiente

Definidas em `.env` (versionado, sem segredos):

| Variável            | Padrão | Descrição                                                                  |
| ------------------- | ------ | -------------------------------------------------------------------------- |
| `VITE_API_URL`      | `/api` | Base das chamadas REST feitas pelo Axios                                   |
| `VITE_SOCKET_URL`   | vazio  | Origem do servidor Socket.IO; vazio usa a mesma origem da aplicação        |
| `VITE_ENABLE_MOCKS` | `true` | Ativa o MSW (REST + Socket.IO). Necessário também no build de demonstração |

Para sobrescrever localmente, crie um `.env.local` (ignorado pelo git).

## Credenciais fictícias

| Usuário     | E-mail             | Senha      |
| ----------- | ------------------ | ---------- |
| Nova Sato   | `nova@kurio.dev`   | `kurio123` |
| Rafael Lima | `rafael@kurio.dev` | `kurio123` |

Use as duas contas para conferir o isolamento de dados entre usuários (favoritos, carrinho, pedidos e carteiras). Novas contas podem ser criadas em `/register`. As senhas são guardadas apenas como hash com salt, nunca em texto puro.

### Cupons

| Código     | Efeito                       |
| ---------- | ---------------------------- |
| `KURIO10`  | 10% de desconto              |
| `GENESIS5` | 5% de desconto               |
| `EXPIRADO` | Cupom vencido (retorna erro) |

Qualquer outro código é rejeitado como inválido.

## Comandos

| Comando                   | Descrição                                                   |
| ------------------------- | ----------------------------------------------------------- |
| `npm run dev`             | Desenvolvimento com mocks e hot reload                      |
| `npm run build`           | Verificação de tipos e build de produção em `dist/`         |
| `npm run preview`         | Serve o build de produção em `http://localhost:4173`        |
| `npm run typecheck`       | Verificação de tipos (`tsc -b`)                             |
| `npm run lint`            | ESLint (inclui regras de importação entre camadas do FSD)   |
| `npm run format:check`    | Prettier em modo de verificação (`npm run format` corrige)  |
| `npm run knip`            | Detecta arquivos, exports e dependências sem uso            |
| `npm run check`           | Executa typecheck, lint, format:check e knip em sequência   |
| `npm run test:e2e`        | Suíte Playwright completa (desktop e mobile)                |
| `npm run test:e2e:ui`     | Playwright em modo interativo                               |
| `npm run test:e2e:update` | Regera as imagens de referência da regressão visual         |
| `npm run test:e2e:report` | Abre o último relatório HTML do Playwright                  |
| `npm run lighthouse`      | Build e auditoria Lighthouse (mobile e desktop, 3 medições) |

## Cenários de mock

O cenário ativo vale para toda a aplicação e fica salvo em `localStorage` (`kurio:mock-scenario`).

| Cenário            | Comportamento                                                     |
| ------------------ | ----------------------------------------------------------------- |
| `default`          | Latência realista e todas as operações com sucesso                |
| `slow`             | Todas as respostas levam 2,5 s                                    |
| `variable-latency` | Latência entre 100 ms e 2,5 s, com respostas fora de ordem        |
| `offline`          | Falha de conexão em todas as requisições                          |
| `server-error`     | HTTP 500 em todas as requisições                                  |
| `empty-catalog`    | Catálogo sem resultados                                           |
| `session-expired`  | Toda requisição autenticada retorna sessão expirada               |
| `favorites-error`  | Inclusão e remoção de favoritos falham com 503                    |
| `price-change`     | O preço sobe 10% cerca de 4 s depois de o item entrar no carrinho |
| `sold-out`         | A edição esgota cerca de 4 s depois de entrar no carrinho         |
| `wallet-rejected`  | A carteira recusa a conexão no checkout                           |
| `order-timeout`    | A criação do pedido responde depois do timeout do cliente         |
| `payment-declined` | O pagamento é recusado depois de o pedido ser criado              |

### Selecionar um cenário

Pela URL, em qualquer rota (o parâmetro é aplicado e removido da barra de endereço):

```
http://localhost:5173/?scenario=sold-out
```

Ou pelo console do navegador:

```js
__kurioMocks.setScenario('price-change')
__kurioMocks.getScenario()
```

Para voltar ao normal, use `?scenario=default`.

### Reset dos dados

`?mock-reset` restaura o banco simulado (usuários, catálogo, carrinhos, pedidos e favoritos) ao estado inicial. Pode ser combinado com um cenário:

```
http://localhost:5173/?mock-reset&scenario=default
```

Pelo console: `__kurioMocks.reset()`. Limpar o `localStorage` do site tem o mesmo efeito e também encerra a sessão.

### Controles de tempo real

Disponíveis em `window.__kurioMocks` para disparar eventos pelo servidor simulado, sem atalhos na interface:

| Controle                                       | Efeito                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| `raisePrice(nftId, editionId, percent)`        | Altera o preço de uma edição e emite o evento para os clientes conectados |
| `setAvailability(nftId, editionId, available)` | Altera o estoque de uma edição (`0` esgota)                               |
| `replayLastEvent()`                            | Reenvia o último evento com outro `eventId` (teste de duplicidade)        |
| `replayLastEvent({ stale: true })`             | Reenvia uma versão anterior do recurso (teste de evento fora de ordem)    |
| `dropConnections()`                            | Derruba as conexões Socket.IO para testar a reconexão                     |
| `expireSessions()`                             | Expira todas as sessões ativas                                            |

Exemplo: `__kurioMocks.raisePrice('nft-001', 'nft-001-e50', 15)`. O ID da edição é o ID do NFT seguido de `e1`, `e10`, `e50` ou `open` (a edição `e50` existe em todos os NFTs).

## Como reproduzir os fluxos de falha

| Fluxo                             | Como reproduzir                                                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Carregamento lento e skeletons    | `?scenario=slow` e navegue pelo catálogo, detalhe e carrinho                                                     |
| Respostas fora de ordem           | `?scenario=variable-latency` e troque de página ou filtro rapidamente; vale sempre a última consulta             |
| Erro de servidor e nova tentativa | `?scenario=server-error`; aguarde as tentativas automáticas, volte para `default` e clique em “Tentar novamente” |
| Sem conexão                       | `?scenario=offline` em qualquer tela                                                                             |
| Catálogo vazio                    | `?scenario=empty-catalog`                                                                                        |
| Sessão expirada                   | Entre, ative `?scenario=session-expired` ou rode `__kurioMocks.expireSessions()` e navegue para uma rota privada |
| Expiração no checkout             | Preencha o checkout, rode `__kurioMocks.expireSessions()` e confirme; depois do login o rascunho é restaurado    |
| Falha ao favoritar                | `?scenario=favorites-error` e clique no coração; a alteração otimista é desfeita                                 |
| Preço alterado no carrinho        | `?scenario=price-change`, adicione um item e aguarde cerca de 4 s no carrinho                                    |
| Item esgotado no carrinho         | `?scenario=sold-out`, adicione um item e aguarde cerca de 4 s                                                    |
| Carteira recusada                 | `?scenario=wallet-rejected` e clique em “Confirmar compra” no checkout                                           |
| Timeout na criação do pedido      | `?scenario=order-timeout` e confirme o pedido; a nova tentativa reutiliza a chave de idempotência                |
| Pagamento recusado                | `?scenario=payment-declined` e confirme o pedido; o recibo passa de pendente para recusado                       |
| Cliques repetidos na confirmação  | Clique várias vezes em “Confirmar pedido”; apenas um pedido é criado                                             |
| Reconexão do tempo real           | `__kurioMocks.dropConnections()`; o cliente reconecta e reconcilia os dados via REST                             |
| Evento duplicado ou antigo        | `__kurioMocks.replayLastEvent()` ou `replayLastEvent({ stale: true })`; nenhum dos dois altera a interface       |
| Cupom inválido ou vencido         | Use `INVALIDO` ou `EXPIRADO` no resumo do carrinho                                                               |

## Testes E2E

```bash
npx playwright install chromium   # primeira vez
npm run test:e2e
```

O Playwright faz o build e sobe o preview em `http://localhost:4173` automaticamente. Os testes rodam em dois projetos: **desktop-chromium** (1440 × 900) e **mobile-chromium** (iPhone 13, 390 px).

| Arquivo                          | Cobertura                                                             |
| -------------------------------- | --------------------------------------------------------------------- |
| `01-catalog.spec.ts`             | Busca, filtros, ordenação, paginação e estado na URL                  |
| `02-nft-detail.spec.ts`          | Detalhe, edições, esgotado, limite de quantidade, 404 e acesso direto |
| `03-auth-session.spec.ts`        | Cadastro, login, rota protegida, expiração, logout e troca de usuário |
| `04-favorites.spec.ts`           | Favoritos otimistas, falha com rollback e persistência                |
| `05-cart.spec.ts`                | Quantidades, estoque, cupons e persistência do carrinho               |
| `06-purchase.spec.ts`            | Compra completa, recibo e snapshot do pedido                          |
| `07-order-failures.spec.ts`      | Carteira recusada, timeout, pagamento recusado e idempotência         |
| `08-account.spec.ts`             | Perfil, avatar, senha e carteiras, incluindo erros da API             |
| `09-realtime-checkout.spec.ts`   | Preço e estoque alterados em tempo real durante a compra              |
| `10-realtime-resilience.spec.ts` | Reconexão, eventos duplicados e antigos, pedido pendente e isolamento |
| `11-keyboard-a11y.spec.ts`       | Navegação por teclado, foco em diálogos e semântica                   |
| `12-loading-errors.spec.ts`      | Skeletons, movimento reduzido, falhas e nova tentativa                |
| `visual.spec.ts`                 | Regressão visual de início, detalhe, carrinho e checkout              |

Cada teste começa com dados limpos e relógio fixo (`page.clock`). Fluxos dependentes de tempo (expiração da sessão, liquidação do pedido, gatilhos de preço e estoque) avançam o relógio em vez de esperar. Os testes de tempo real passam pelo cliente Socket.IO e os de REST pelos handlers MSW.

Em falhas, o relatório HTML (`playwright-report/`) inclui trace, screenshot e vídeo. Para rodar só uma parte:

```bash
npx playwright test tests/e2e/05-cart.spec.ts --project=desktop-chromium
```

As imagens de referência ficam em `tests/e2e/__screenshots__/`. Depois de uma mudança visual intencional, regere com `npm run test:e2e:update`.

## Lighthouse

```bash
npm run lighthouse
```

Faz o build, sobe o preview na porta 4174 e audita o início (`/`) e o detalhe (`/nft/nft-001`) nos perfis mobile e desktop, com três medições por página e o cenário padrão dos mocks. A configuração está em `lighthouse.config.json`. Os relatórios HTML/JSON e o resumo com as medianas são gerados em `lighthouse-reports/`, que não é versionado. Os resultados e a análise estão em [`ARCHITECTURE.md`](./ARCHITECTURE.md#performance).

## Deploy

Publicado no **Railway** como build estático do Vite (`railway.json`). O Railpack executa `npm run build` e serve `dist/` com fallback de rotas para `index.html`, então o acesso direto e o refresh funcionam em qualquer rota. Os mocks e o tempo real ficam ativos na versão publicada.

```bash
railway login
railway up
```

URL pública:[ _a Marketplace de NFTs](https://marketplace-de-nfts-production.up.railway.app/)
