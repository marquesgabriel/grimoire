# Grimoire

[![CI](https://github.com/marquesgabriel/grimoire/actions/workflows/ci.yml/badge.svg)](https://github.com/marquesgabriel/grimoire/actions/workflows/ci.yml)
[![Content: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Code: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE-CODE)

A spellbook of [Claude Code](https://code.claude.com) skills and reusable
knowledge, kept in one place so they can be used in any project instead of
being copied (and drifting) between repositories.

See [INDEX.md](INDEX.md) for everything in here.

## Structure

Items are grouped by maturity first, then by type:

```
library/      Ready to use. The only folder published as a plugin.
incubator/    Works, but still being shaped (tied to one project, or needs a rewrite).
graveyard/    Retired or abandoned. Kept with an epitaph, in case it's worth bringing back.
```

Inside each one, items live in a folder per type: `skills/` today, with room
for others (such as `docs/`) as the grimoire grows.

## Using the skills

The `library/` folder is published as the `grimoire` plugin through this
repository's plugin marketplace:

```bash
claude plugin marketplace add marquesgabriel/grimoire
claude plugin install grimoire@grimoire
```

Skills are then available with the plugin prefix, for example
`/grimoire:gathering-requirements`. Claude Code also picks them up
automatically when a request matches a skill's description.

To make a project suggest the plugin to everyone who opens it, add this to
the project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "grimoire": {
      "source": { "source": "github", "repo": "marquesgabriel/grimoire" }
    }
  },
  "enabledPlugins": {
    "grimoire@grimoire": true
  }
}
```

Items in `incubator/` and `graveyard/` aren't published. To try one, copy its
folder into a project's `.claude/skills/`.

Skills are written in English, but talk to you in your own language.

## License

- **Content** (skills, docs and everything else that isn't code):
  [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE).
  You can use, adapt and share it, including commercially, as long as you
  give credit and say what you changed.
- **Code** (scripts and workflows): [MIT](LICENSE-CODE).

### How to credit

When you republish or adapt something from here, a line like this is enough:

> Based on [Grimoire](https://github.com/marquesgabriel/grimoire) by Gabriel
> Marques, licensed under CC BY 4.0. Changes: _what you changed_.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Work is tracked on the
[Grimoire Roadmap](https://github.com/users/marquesgabriel/projects/5) board.
