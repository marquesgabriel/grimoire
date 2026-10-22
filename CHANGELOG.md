# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com/); versions
follow [SemVer](https://semver.org/). Each version entry merged into `main`
becomes a tag and a GitHub release automatically.

## [v1.1.0] — 2026-10-21
### Adicionado
- Library: `curating-resume` promovida do incubator. Agora é genérica: lê os dados de cada projeto em `docs/RESUME.md` (com modelo em `resume-project.template.md`, oferecido quando o arquivo não existe) e confirma cada fato com quem está usando, em vez de um dono fixo. O modo de adaptar à vaga continua provisório (#9).

## [v1.0.0] — 2026-10-21
### Adicionado
- Estrutura do Grimoire: `library` (publicada como o plugin `grimoire`), `incubator` e `graveyard`, com índice, licenças (CC BY 4.0 para conteúdo, MIT para código), marketplace de plugins do Claude Code, validação no CI e release automática.
- Library: `gathering-requirements` e `writing-user-stories`, traduzidas para o inglês, respondendo no idioma do usuário.
- Incubator: `coding-user-stories`, `scaffolding-projects` e `curating-resume`; doc `review-conventions`.
- Graveyard: `reviewing-code` (substituída pelo `/code-review` nativo + convenções no projeto), `writing-image-prompts` e `playtesting-games`, cada uma com epitáfio.
