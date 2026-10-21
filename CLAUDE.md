# Grimoire — instruções para o agente

Repositório público de skills e conhecimento reutilizável. Antes de mudar
algo, leia `README.md`, `CONTRIBUTING.md` e `INDEX.md`.

- Toda mudança vai por branch + PR contra a `main`. Nunca faça merge: o
  Gabriel revisa.
- Commits em português (Conventional Commits); issues, PRs e conteúdo em
  inglês. Sem atribuição ao Claude em commits e PRs.
- Skills em inglês, com nome no gerúndio, sem versão, e com a regra de
  responder no idioma do usuário.
- Ao adicionar, mover ou aposentar algo, atualize o `INDEX.md` e rode
  `node scripts/validate.mjs` e `claude plugin validate .`.
- Repositório público: nada de nome de cliente, caminho interno ou
  credencial.
- Tarefas no board "Grimoire Roadmap" (projeto 5).
