---
name: playtesting-games
description: Testa o jogo Earth Driller de ponta a ponta — sobe o dev server, dirige a UI real via Playwright (clique de minerar, animação, compra de upgrades/automações incluindo bulk buy, avanço de profundidade, prestígio, conquistas), roda uma simulação numérica das fórmulas reais de custo/produção para estimar o tempo até o 1º prestígio, e entrega um relatório de feedback (bugs, UX, balanceamento). Use esta skill sempre que o usuário pedir para "testar o jogo", "jogar e dar feedback", "validar essa mudança no jogo", "fazer um playtest", ou depois de mudanças relevantes de gameplay/UI/balanceamento quando fizer sentido propor um teste.
---

# Game Tester — Earth Driller

## Objetivo

Jogar o jogo de verdade (não só rodar a suíte de testes automatizados) e devolver feedback acionável: bugs concretos e reproduzíveis, observações de UX, e uma leitura de balanceamento fundamentada nas fórmulas reais do código — não em achismo.

Isso complementa, não substitui, a suíte de testes (`npm run test:coverage`) e o lint/typecheck. Rode esses primeiro se houver mudança de código recente sem verificação — não faz sentido playtestar algo que não builda.

## Pré-requisitos (uma vez por máquina)

`playwright` e `tsx` já são devDependencies do projeto. Falta só o binário do Chromium, que não vai pro `node_modules`:

```bash
npx playwright install chromium
```

Se isso falhar por falta de rede, avise o usuário — o teste funcional depende de um browser real.

## Parte 1 — Teste funcional/UX (Playwright)

### Subir o dev server

```bash
npm run dev > /tmp/game-tester-dev.log 2>&1 &
timeout 30 bash -c 'until curl -sf http://localhost:5173 >/dev/null; do sleep 1; done'
```

Ao final, sempre limpar: `lsof -ti:5173 -sTCP:LISTEN | xargs -r kill`. Não use `pkill -f` com padrão amplo — pode matar a própria sessão do agente.

### Dirigir via Playwright

Não existe `chromium-cli` neste ambiente — use o pacote `playwright` diretamente (já instalado). Escreva um script Node ad-hoc (`.mjs`, em `/tmp`) que importe `{ chromium }` de `"playwright"`, rode com `chromium.launch({ args: ["--no-sandbox"] })`, e capture erros de console (`page.on("console", ...)` filtrando `type() === "error"` e `page.on("pageerror", ...)`) — sempre reporte esses erros no relatório final, mesmo que a UI "pareça" funcionar.

### Pular o grind: seedar o save via localStorage

O estado salvo fica em `localStorage["earth-driller-save"]` (chave `SAVE_KEY` em `src/lib/persistence.ts`), como um JSON com este formato exato (ver `serializeGameState`):

```json
{
  "money": "5000",
  "depthLevel": 4,
  "upgrades": { "reinforced-pickaxe": 5, "servo-motors": 3 },
  "automations": { "hand-crank-drill": 4 },
  "achievements": { "first-click": true },
  "prestigeCount": 0,
  "language": "pt-BR"
}
```

`money` é string (não number) porque vira `Decimal`. `depthLevel` é o índice 0-based em `DEPTH_LEVELS` (o último índice, hoje `DEPTH_LEVELS.length - 1`, é quando o jogador está pronto pra prestigiar). Confira `src/features/upgrades/catalog.ts` e `src/features/automation/catalog.ts` para os ids válidos de upgrades/automações antes de montar o JSON.

Para injetar antes do app montar (senão o `useGamePersistence` já rodou com o save vazio):

```js
await page.addInitScript((save) => {
  localStorage.setItem("earth-driller-save", JSON.stringify(save));
}, seedState);
await page.goto("http://localhost:5173");
```

Teste pelo menos três estágios: **early game** (sem seed, save vazio), **mid game** (alguns upgrades/automações, profundidade intermediária) e **late game** (perto do último nível de profundidade, dinheiro alto o bastante pra bulk buy x100/Max fazer diferença visível, e para exercitar o fluxo de prestígio).

### Checklist do que exercitar e observar

- **Minerar**: clicar no botão, dinheiro sobe, número flutuante aparece, e o slot de animação central troca do frame vermelho pro azul e volta (classe `.mining-animation-sprite`, ver `src` mudando).
- **Clique rápido/repetido**: clicar várias vezes seguidas rápido — a animação não deve travar fora do frame de repouso nem quebrar visualmente.
- **Loja de upgrades e automações**: comprar no modo x1; trocar pra x10/x100/Máx (`.quantity-selector button`) e conferir que o texto do botão de compra mostra a quantidade e o custo total corretos; com saldo insuficiente pra quantidade cheia, o botão deve ficar desabilitado (não deve comprar parcial).
- **Avanço de profundidade**: no early game, confirmar que o botão de avançar aparece desabilitado com a razão certa (dinheiro ou equipamento insuficiente); no mid/late game, confirmar que avança e atualiza o texto de camada/nível.
- **Conquistas**: no estágio com `achievements` seedado, confirmar que aparecem marcadas como desbloqueadas; no early game, confirmam que aparecem como pendentes.
- **Prestígio**: no save late-game (último nível de profundidade), o botão de prestigiar deve habilitar, abrir confirmação, e após confirmar resetar dinheiro/upgrades/automações mantendo conquistas e o bônus permanente.
- **Idioma**: trocar o seletor de idioma e conferir que os textos mudam sem quebrar layout (sem `undefined`/chave de tradução crua aparecendo na tela).
- **Responsivo**: repetir pelo menos o teste de mineração + loja num viewport mobile (`page.setViewportSize({width: 390, height: 844})`) — confirmar que as 3 áreas (minerar / animação / lojas) continuam acessíveis sem cortar conteúdo (isso é um risco conhecido registrado no backlog, vale atenção extra).
- **Console**: zero erros de console em qualquer um dos passos acima.

Tire screenshot (`page.screenshot`) nos momentos-chave (tela inicial, bulk buy ativo, prestígio) para anexar/descrever no relatório.

## Parte 2 — Simulação de balanceamento

```bash
npx tsx .claude/skills/playtesting-games/scripts/simulate-balance.ts [clicksPerSecond]
```

`clicksPerSecond` é opcional (padrão 2). O script importa as fórmulas reais de custo/produção de `src/features/upgrades`, `src/features/automation`, `src/features/depth` e `src/features/mining` e simula um jogador guloso (sempre compra o que dá mais $/seg por $ gasto) sem progresso offline, imprimindo o tempo de jogo ativo até cada camada e até o 1º prestígio, traduzido em dias sob algumas premissas de tempo de sessão diária.

Rode com pelo menos 2 valores de `clicksPerSecond` (ex: 1 e 3) para ter uma faixa, não um ponto único — jogadores clicam em ritmos diferentes.

Compare o resultado com **RNF03** (`docs/requisitos-earth-driller.md`): meta de ~1 semana de jogo até o 1º prestígio. O script é uma aproximação (assume compra gulosa perfeita, sem economizar de propósito) — trate divergências grandes (ordens de magnitude) como sinal real de rebalanceamento necessário; divergências pequenas (2x pra mais ou menos) são esperadas visto o modelo ser simplificado.

## Relatório final

Estruture a resposta ao usuário em português, com estas seções (omita as que não tiverem achados):

1. **Resumo** — 1-2 frases: o jogo está jogável de ponta a ponta? algo bloqueante?
2. **Bugs encontrados** — um item por bug: o que acontece, passos pra reproduzir, e se possível o arquivo/componente suspeito.
3. **Observações de UX** — coisas que funcionam mas incomodam ou confundem (não são bugs).
4. **Balanceamento** — números da simulação, comparados à meta do RNF03, com a ressalva do modelo.
5. **Erros de console** — se houve algum, mesmo que a UI parecesse OK.

Ao final, limpe: mate o dev server, apague scripts/screenshots temporários que tiver criado em `/tmp`.
