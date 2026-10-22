# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com/); versions
follow [SemVer](https://semver.org/). Each version entry merged into `main`
becomes a tag and a GitHub release automatically.

## [v1.2.0] — 2026-10-22
### Adicionado
- Library: `scaffolding-projects` promovida do incubator, reescrita como padrão genérico (montar um projeto novo ou auditar um existente), sem o estado datado dos projetos e com a regra de PRs dependentes do CONTRIBUTING.

### Alterado
- Incubator: `coding-user-stories` reescrita para implementar as histórias ela mesma, com uma issue no board e uma branch + PR por história (#6); continua no incubator até o primeiro uso real.
- Doc `review-conventions`: o exemplo aponta para o `docs/REVIEW-CONVENTIONS.md` real do mtg.
- README: instalação com `claude plugin install grimoire` e atualização com `claude plugin marketplace update grimoire` + `claude plugin update grimoire`.

## [v1.1.0] — 2026-10-21
### Adicionado
- Library: `curating-resume` promovida do incubator. Agora é genérica: lê os dados de cada projeto em `docs/RESUME.md` (com modelo em `resume-project.template.md`, oferecido quando o arquivo não existe) e confirma cada fato com quem está usando, em vez de um dono fixo. O modo de adaptar à vaga continua provisório (#9).

## [v1.0.0] — 2026-10-21
### Adicionado
- Estrutura do Grimoire: `library` (publicada como o plugin `grimoire`), `incubator` e `graveyard`, com índice, licenças (CC BY 4.0 para conteúdo, MIT para código), marketplace de plugins do Claude Code, validação no CI e release automática.
- Library: `gathering-requirements` e `writing-user-stories`, traduzidas para o inglês, respondendo no idioma do usuário.
- Incubator: `coding-user-stories`, `scaffolding-projects` e `curating-resume`; doc `review-conventions`.
- Graveyard: `reviewing-code` (substituída pelo `/code-review` nativo + convenções no projeto), `writing-image-prompts` e `playtesting-games`, cada uma com epitáfio.
