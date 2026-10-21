# Epitaph: playtesting-games

**Was:** `game-tester`, in `incremental-game` (Earth Driller), never
committed there. Retired on 2026-10-21. Apart from the name, the only change
is the script path in the usage lines.

**Why it was retired:** it was built entirely around Earth Driller: its
dev server, its save format in `localStorage`, its selectors, its upgrade
and automation catalogs, and a balance simulation that imports the game's
own formulas. The project has been inactive since August 2026.

**What replaced it:** nothing.

**To bring it back:** it's one of the better-made skills, so it's a good
candidate for a generic "playtest" skill if game projects come back. Keep the
approach and read the specifics from the project:

- drive the real UI with Playwright and always report console errors;
- skip the grind by seeding the save before the app mounts, and test early,
  mid and late game;
- simulate balance with the game's real formulas (`scripts/simulate-balance.ts`
  is the reference), with a range of player speeds instead of a single point;
- report bugs, UX notes and balance in separate sections.
