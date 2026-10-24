# Arquitetura

Este documento descreve a organização do código, os contratos com a API simulada, as políticas de sessão, carrinho e cache, a reconciliação entre REST e Socket.IO, as decisões de UX, as limitações conhecidas e os resultados de performance. Setup, cenários e comandos estão no [`README.md`](./README.md).

## Visão geral

```
Navegador
├── React + TanStack Router (rotas com code splitting automático)
├── TanStack Query (cache de servidor)
│   ├── Axios ──────────────► MSW (service worker) ─► handlers REST
│   └── RealtimeBridge ◄────── Socket.IO Client ◄──── MSW ws.link + @mswjs/socket.io-binding
└── Banco simulado em localStorage (kurio:mock-db), compartilhado por REST e tempo real
```

A aplicação nunca simula respostas ou eventos na interface. Toda leitura e escrita passa pelo Axios ou pelo cliente Socket.IO e é respondida pelo MSW, que guarda o estado em um único banco persistido. Quando um handler REST altera um NFT ou um pedido, o serviço simulado emite o evento correspondente para os sockets conectados.

## Estrutura (Feature-Sliced Design)

```
src/
├── app/        Bootstrap, providers (Query, Router, RealtimeBridge, SessionExpiryHandler), rotas e layouts
├── pages/      Uma pasta por rota: compõe widgets e define título e estados da página
├── widgets/    Blocos de tela: header, catálogo, galeria, carrinho, checkout, recibo, footer…
├── features/   Ações do usuário: add-to-cart, apply-coupon, auth-login, place-order, toggle-favorite…
├── entities/   Modelos de domínio: nft, cart, order, session, user, wallet, favorite (queries e UI básica)
└── shared/     api (Axios, Socket, QueryClient, viewer), contracts (DTOs), config, lib, ui e mocks
```

- Cada slice expõe sua API pública por um `index.ts`. Importar arquivos internos de outro slice é proibido.
- Uma camada só importa camadas abaixo dela (`app → pages → widgets → features → entities → shared`). As duas regras são verificadas pelo ESLint (`no-restricted-imports`).
- `shared/contracts` é a única fonte dos tipos trocados com a API. Os handlers MSW usam os mesmos tipos, então uma mudança de contrato quebra a compilação dos dois lados.
- O MSW e os fixtures ficam em um chunk separado, carregado sob demanda por `enableMocking()` antes da renderização. Com `VITE_ENABLE_MOCKS=false`, esse chunk não é carregado.

## Contratos REST

Base: `VITE_API_URL` (padrão `/api`). Respostas em JSON.

**Cabeçalhos**

| Cabeçalho         | Uso                                                                  |
| ----------------- | -------------------------------------------------------------------- |
| `Authorization`   | `Bearer <token>` quando há sessão                                    |
| `X-Cart-Id`       | ID do carrinho do visitante (UUID em `localStorage`), enviado sempre |
| `Idempotency-Key` | Obrigatório em `POST /orders`                                        |

**Erros** seguem um formato único:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "…", "fields": { "email": "…" } } }
```

Códigos: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `SESSION_EXPIRED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `OUT_OF_STOCK`, `COUPON_INVALID`, `COUPON_EXPIRED`, `QUOTE_OUTDATED`, `IDEMPOTENCY_CONFLICT`, `WALLET_REJECTED`, `UNAVAILABLE` e `INTERNAL_ERROR`. Os formulários mapeiam `fields` para os campos correspondentes; os demais erros aparecem como mensagem do formulário ou toast.

**Endpoints**

| Método e rota                                | Descrição                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------ |
| `GET /nfts`                                  | Catálogo paginado (`search`, `tab`, filtros, `sort`, `page`, `pageSize`) |
| `GET /nfts/:nftId`                           | Detalhe com edições, preço, disponibilidade e `version`                  |
| `POST /auth/register`                        | Cria a conta e a sessão; une o carrinho do visitante                     |
| `POST /auth/login`                           | Abre a sessão; une o carrinho do visitante                               |
| `GET /auth/session`                          | Sessão atual (usuário e `expiresAt`)                                     |
| `POST /auth/logout`                          | Encerra a sessão                                                         |
| `GET /cart`                                  | Carrinho do usuário ou do visitante, com status de cada item             |
| `GET /cart/quote`                            | Cotação do checkout com `fingerprint` dos valores                        |
| `POST /cart/items`                           | Adiciona edição e quantidade                                             |
| `PATCH /cart/items/:itemId`                  | Altera a quantidade                                                      |
| `DELETE /cart/items/:itemId`                 | Remove o item                                                            |
| `POST /cart/acknowledge`                     | Confirma que o usuário viu as mudanças de preço e estoque                |
| `PUT /cart/coupon`                           | Aplica cupom                                                             |
| `DELETE /cart/coupon`                        | Remove o cupom                                                           |
| `GET /favorites`                             | IDs favoritados                                                          |
| `PUT` / `DELETE /favorites/:id`              | Inclui ou remove (idempotentes)                                          |
| `GET` / `PATCH /profile`                     | Lê ou altera o perfil                                                    |
| `PUT` / `DELETE /profile/avatar`             | Envia ou remove o avatar                                                 |
| `POST /profile/password`                     | Troca a senha (exige a senha atual)                                      |
| `GET /wallets`                               | Carteiras principal e secundária                                         |
| `PUT /wallets/:slot`                         | Salva a carteira `primary` ou `secondary`                                |
| `GET` / `POST` / `DELETE /wallet-connection` | Estado, conexão e desconexão da carteira no checkout                     |
| `POST /orders`                               | Cria o pedido a partir da cotação (idempotente)                          |
| `GET /orders/:orderId`                       | Pedido do usuário (snapshot); `404` para pedidos de outro usuário        |
| `POST /newsletter`                           | Inscrição na newsletter                                                  |
| `GET /health`                                | Verificação de saúde                                                     |

## Eventos em tempo real

Socket.IO no caminho `/realtime/`, transporte `websocket`. Todo evento tem o mesmo envelope:

```ts
{
  eventId: string           // único por emissão
  type: 'nft.updated' | 'order.updated'
  resource: { type: 'nft' | 'order'; id: string }
  version: number           // versão do recurso, crescente
  occurredAt: string        // ISO 8601
  data: …
}
```

| Evento          | Direção            | Dados                                                         | Destinatários       |
| --------------- | ------------------ | ------------------------------------------------------------- | ------------------- |
| `session.join`  | cliente → servidor | `{ token }`                                                   | —                   |
| `session.leave` | cliente → servidor | —                                                             | —                   |
| `nft.updated`   | servidor → cliente | `nftId`, `priceEth`, `previousPriceEth`, `available`, edições | Todos os clientes   |
| `order.updated` | servidor → cliente | `orderId`, `userId`, `status`                                 | Só o dono do pedido |

O cliente entra na sala do usuário com `session.join` a cada conexão e a cada login, e sai com `session.leave` no logout. Assim, eventos de pedido nunca chegam a outro usuário.

## Reconciliação entre REST e Socket.IO

O REST é a fonte da verdade; o socket só acelera a atualização. A lógica fica em `app/providers/RealtimeBridge.tsx`:

1. **Ao conectar e a cada reconexão**, as queries de NFTs, carrinho e pedidos são invalidadas. Eventos perdidos durante a queda ou antes da primeira conexão são recuperados pelo REST.
2. **Duplicatas:** os últimos 200 `eventId` processados são guardados e o mesmo evento nunca é aplicado duas vezes.
3. **Fora de ordem:** cada recurso guarda a maior `version` vista, considerando também a versão já presente no cache do detalhe. Eventos com versão igual ou menor são descartados.
4. **Aplicação:** `nft.updated` atualiza o detalhe e as listas no cache sem nova requisição. Se o NFT está no carrinho, mostra um toast (preço mudou, esgotou ou estoque reduzido) e invalida o carrinho para receber o status de cada item calculado pelo servidor.
5. **Pedidos:** `order.updated` atualiza o pedido no cache. Quando o status vira `confirmed`, o carrinho é recarregado, porque o servidor removeu os itens comprados. Pedidos `pending` também são consultados a cada 5 s enquanto a tela está aberta, o que cobre uma queda do socket na hora da liquidação.
6. O estado da conexão é exposto em `<html data-realtime="connected|disconnected">`, usado pelos testes para sincronizar.

## Política de sessão

- O login devolve um token opaco com validade de **8 horas**, guardado em `localStorage` (`kurio:session-token`) junto do ID do usuário. A sessão sobrevive a refresh e a novas abas.
- Rotas privadas (`/profile`, `/wallets`, `/favorites`, `/checkout` e `/orders/:id`) passam pelo guard `_authenticated`. Ele confirma a sessão com `GET /auth/session` (cache de 5 min) e, se não houver sessão, redireciona para `/login?redirect=<destino>`.
- Se a API responder `401` com `SESSION_EXPIRED` ou `UNAUTHENTICATED` para uma requisição que enviou token, o interceptor do Axios emite uma falha de autenticação. O `SessionExpiryHandler` encerra a sessão e leva ao login com `reason=expired` (mensagem "Sua sessão expirou") e com o destino preservado.
- No login, no logout e na expiração, todo o cache privado é descartado. As chaves privadas do Query começam com `['private', viewerId]`, então os dados de um usuário nunca aparecem para outro, mesmo durante a troca.
- O rascunho do checkout fica em `sessionStorage` por usuário (`kurio:checkout-draft:<id>`). Se a sessão expira no checkout, os dados preenchidos voltam depois do novo login.
- As senhas são guardadas no banco simulado apenas como hash SHA-256 com salt por usuário.

## Estado do carrinho

- O carrinho vive no servidor. O cliente só guarda o `X-Cart-Id` do visitante; o carrinho de quem está logado pertence ao usuário.
- No login ou cadastro, o carrinho do visitante é unido ao do usuário: as quantidades são somadas respeitando o estoque, e o cupom do visitante é mantido se o usuário não tiver um.
- Cada item guarda o preço do momento em que foi adicionado. O servidor compara com o preço e o estoque atuais e devolve um status: `ok`, `price_changed`, `quantity_reduced` ou `unavailable`. A interface destaca o item, e o usuário precisa confirmar a mudança (`POST /cart/acknowledge`) antes de seguir.
- A query do carrinho usa `staleTime: 0`, porque preço e estoque mudam fora do controle do usuário.
- **Checkout:** `GET /cart/quote` devolve totais e um `fingerprint`. O pedido é criado com esse fingerprint. Se algo mudou desde a revisão, o servidor responde `QUOTE_OUTDATED` (ou `OUT_OF_STOCK`), o carrinho é recarregado e o usuário revisa de novo.
- **Idempotência:** a `Idempotency-Key` é gerada por tentativa (assinatura de cotação, carteira, rede e dados do colecionador) e guardada em `sessionStorage`. Cliques repetidos, timeouts com nova tentativa automática (até 2) e reenvios depois de refresh usam a mesma chave e recebem o mesmo pedido. Reutilizar a chave com outro conteúdo devolve `IDEMPOTENCY_CONFLICT`.
- O pedido é um snapshot: guarda linhas, preços, desconto, colecionador e carteira do momento da compra. Mudanças posteriores no catálogo não alteram o recibo. Só o que foi comprado sai do carrinho.

## Estratégia de cache e retry

| Dado            | Configuração                                                                 |
| --------------- | ---------------------------------------------------------------------------- |
| Padrão          | `staleTime` 30 s, `gcTime` 5 min, refetch ao focar a janela                  |
| Catálogo        | `keepPreviousData` na paginação e nos filtros; o estado completo fica na URL |
| Detalhe do NFT  | Atualizado pelo socket em tempo real e reconciliado com REST a cada conexão  |
| Carrinho        | `staleTime: 0`                                                               |
| Sessão          | `staleTime` 5 min                                                            |
| Pedido pendente | Consulta a cada 5 s até sair de `pending`                                    |
| Favoritos       | Atualização otimista com rollback e toast em caso de erro                    |

- **Retry de queries:** até 2 tentativas apenas para falhas de rede e respostas 5xx, com o backoff padrão do Query. Erros 4xx nunca são repetidos. Esgotadas as tentativas, a tela mostra o erro com "Tentar novamente".
- **Mutations:** sem retry automático, exceto a criação de pedido em caso de timeout, que é segura por causa da idempotência.
- **Axios:** timeout de 10 s. Antes de qualquer requisição, o cliente espera o service worker do MSW ficar pronto (`whenApiReady`).
- **Respostas fora de ordem:** cada combinação de filtros é uma chave própria de query, e o Query cancela pelo `AbortSignal` as requisições que deixam de ser observadas. Uma resposta antiga nunca sobrescreve a consulta atual.

## Decisões de UX

- **Skeletons** com as mesmas dimensões do conteúdo final (sem layout shift). O efeito shimmer é desligado com `prefers-reduced-motion`.
- **Estado na URL:** busca, aba, filtros, ordenação e página ficam na query string, então refresh, voltar/avançar e links compartilhados restauram a mesma tela.
- **Login como diálogo** quando a ação parte de uma página pública (favoritar, por exemplo). As rotas privadas usam a página `/login` com `redirect`.
- **Revisão do pedido** em diálogo antes da confirmação, com o total final. O botão de confirmar fica travado enquanto a requisição está em andamento.
- **Mudanças em tempo real** aparecem em toasts não bloqueantes e como destaque no item do carrinho. O usuário nunca paga um valor diferente do que revisou.
- **Itens fora do escopo** do desafio (páginas editoriais, suporte, atividade e ofertas) aparecem como em breve, com `aria-disabled` e o título "Em breve", em vez de links que simulam sucesso.
- **Acessibilidade:** skip link, foco preso e devolvido nos diálogos e folhas, mensagens de erro associadas aos campos com `aria-describedby`, foco no primeiro campo inválido, regiões vivas para toasts, recibo e carregamentos, e título da aba por página.

## Desvios do Figma

O layout segue o Figma em 390, 768 e 1440 px. Os elementos abaixo não têm referência direta no arquivo e foram desenhados com os tokens e componentes existentes:

- Estados de carregamento (skeletons), erro com nova tentativa, vazio e página 404.
- Toasts de tempo real e de erro, e o destaque de itens alterados no carrinho.
- Diálogos de login e de revisão do pedido, e o status pendente ou recusado no recibo.
- Estilos de foco visível para navegação por teclado.

## Limitações

- **Backend simulado no navegador:** os dados vivem no `localStorage` de cada navegador. Não há compartilhamento entre dispositivos ou navegadores, e limpar os dados do site reinicia tudo.
- **Tempo real só na própria aba:** o servidor Socket.IO é emulado pelo MSW interceptando o WebSocket da página. Um evento gerado em uma aba não chega a outras abas abertas. Cada aba tem seu servidor simulado, e as alterações se propagam entre abas só pelo REST (o banco persistido é compartilhado).
- **Transporte só `websocket`:** o MSW intercepta o WebSocket, mas não o long-polling HTTP do Engine.IO. Por isso o cliente não usa o fallback por polling. Com um servidor real, basta incluir `polling` em `transports`.
- **Caminho `/realtime/`:** o MSW intercepta conexões para `/realtime/` na mesma origem (ou na origem de `VITE_SOCKET_URL`). Em produção sem mocks, o servidor precisa expor o Socket.IO nesse caminho.
- **Primeiro carregamento:** o service worker do MSW precisa ser registrado antes da primeira requisição. Em navegadores sem suporte a service workers ou em modo que os bloqueia, a aplicação não carrega dados.
- **Carteira e pagamento** são simulados: hashes de transação e links do explorador são fictícios.

## Testes

- **Playwright E2E**, em `tests/e2e`, em dois projetos (desktop 1440 × 900 e iPhone 13). São 12 specs por categoria do desafio e uma de regressão visual.
- **Isolamento:** cada teste usa um contexto novo do navegador, com `localStorage` limpo e banco recriado a partir dos fixtures.
- **Determinismo:** o relógio é fixado com `page.clock`. Os cenários são escolhidos pelo `localStorage` antes do carregamento ou por `window.__kurioMocks` em tempo de execução. Gatilhos de tempo (expiração em 8 h, liquidação do pedido, mudança de preço e esgotamento) são acelerados com `clock.fastForward`, sem esperas reais.
- **Caminho real:** REST passa pelos handlers MSW, e o tempo real pelo cliente Socket.IO. Os controles apenas disparam ações no servidor simulado, que emite os eventos.
- **As verificações observam a interface:** são feitas por papéis e nomes acessíveis, o que também valida a semântica.
- **Diagnóstico:** relatório HTML, e trace, screenshot e vídeo em falhas. Há 1 retry, para absorver falhas raras do service worker sob muitos workers paralelos; elas aparecem como `flaky` no relatório.
- **Qualidade estática:** `npm run check` executa `tsc -b`, ESLint (com as regras do FSD e jsx-a11y), Prettier e knip.

## Performance

Auditoria com `npm run lighthouse` (configuração em `lighthouse.config.json` e `scripts/lighthouse.ts`): build de produção servido pelo `vite preview`, cenário `default` dos mocks, três medições por página e perfil, mediana de cada categoria. Os perfis usam o throttling simulado padrão do Lighthouse (mobile: Moto G Power, 4G lento e CPU 4×; desktop: preset desktop).

**Ambiente:** Lighthouse 13.5.0, Chrome Headless 156, Node 24.18, Windows 11, Intel i7-13620H.

| Perfil  | Página         | Performance | Accessibility | Best Practices | SEO |    LCP |   CLS |   TBT |
| ------- | -------------- | ----------: | ------------: | -------------: | --: | -----: | ----: | ----: |
| mobile  | `/`            |       74 ⚠️ |           100 |            100 | 100 | 4,96 s | 0,001 | 89 ms |
| mobile  | `/nft/nft-001` |       77 ⚠️ |           100 |            100 | 100 | 4,51 s | 0,000 | 61 ms |
| desktop | `/`            |          98 |           100 |            100 | 100 | 1,02 s | 0,002 |  0 ms |
| desktop | `/nft/nft-001` |          98 |           100 |            100 | 100 | 1,01 s | 0,000 |  0 ms |

Metas: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95 e SEO ≥ 90. Todas são atingidas no desktop. No mobile, só Performance fica abaixo.

### Otimizações aplicadas

- Code splitting por rota (TanStack Router) e agrupamento das dependências em poucos chunks (`vendor`, `app`, `socket-*`). A primeira carga passou de cerca de 60 requisições de script para 12, o que reduziu o FCP mobile de 4,3 s para 3,5 s.
- Imagem LCP com `preload` e `fetchpriority="high"`, `srcset` em WebP (480 e 960 px), dimensões explícitas e `loading="lazy"` abaixo da dobra.
- Fontes self-hosted (`@fontsource`, só o subset latin e três pesos), com `font-display: swap`.
- `main` com altura mínima da viewport. Antes, o rodapé aparecia no topo enquanto o chunk da rota carregava e era empurrado depois (CLS 0,19 no detalhe desktop, agora 0,000).
- Skeletons com as dimensões finais, sem layout shift no carregamento de dados.
- O cliente Socket.IO é carregado sob demanda, depois da API ficar pronta.

### Por que o mobile fica abaixo de 90

O LCP de ambas as páginas é a imagem do NFT. O arquivo já está em cache pelo preload (atraso de carga de cerca de 10 ms), mas o elemento só pode ser renderizado depois que os dados chegam. O tempo dominante é o _element render delay_, causado por duas cadeias que existem só por causa da arquitetura exigida no desafio:

1. **Servidor simulado no navegador:** antes da primeira resposta da API, o navegador precisa baixar e executar o chunk do MSW (cerca de 170 KB gzip; mais da metade é `msw`, `tough-cookie` e a árvore de sufixos públicos do `tldts`, dependências internas do MSW) e registrar o service worker. Em produção, com uma API real, esse chunk não existe (`VITE_ENABLE_MOCKS=false`).
2. **Renderização só no cliente:** sem SSR, o primeiro conteúdo depende de baixar e executar React, TanStack Router/Query e o código da rota. Com CPU 4× mais lenta, isso leva o FCP a cerca de 3,5 s.

TBT (< 100 ms) e CLS (≈ 0) estão dentro das metas, e o desktop atinge 98. A diferença no mobile vem da latência de rede e CPU simulada sobre essas duas cadeias. Os caminhos para chegar a 90 seriam SSR/pré-renderização do shell (TanStack Start) ou servir os dados iniciais sem o MSW, e as duas opções fogem da stack e do modelo de mocks pedidos. Não foram feitas simplificações exclusivas para a auditoria: as imagens, as fontes, os mocks e o tempo real da entrega estão ativos durante as medições.

Os relatórios HTML/JSON de cada medição e o resumo (`summary.md` e `summary.json`) são gerados em `lighthouse-reports/`.
