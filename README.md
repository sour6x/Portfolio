# Raj Narayanan — Portfolio

A React portfolio with an animated PCB aesthetic, copper traces, scroll-driven current, and selected electronics and embedded systems projects.

## Run locally

Requires Node.js and pnpm 11.25.0.

```sh
pnpm install
pnpm dev
```

Open the localhost address printed by Vite.

## Production build

```sh
pnpm build
```

## GitHub Pages

```sh
pnpm build:pages
```

Commit the updated `docs/` directory. GitHub Pages serves `main` → `/docs` at `https://sour6x.github.io/Portfolio/` when publishing is enabled. This build sets the `/Portfolio/` asset base; localhost development continues to use `/`.

## Edit content

- `src/main.jsx`: introduction, resume details, projects, and links.
- `src/style.css`: base layout and responsive styling.
- `src/circuit.css`: scroll trace and project section animations.
- `src/hero.css`: headline and chip animations.
- `src/readability.css`: text contrast, readable sizing, responsive controls, and focus states.
- `src/ScrollCircuit.jsx` and `src/roots.css`: connected copper roots spanning the page, with scroll-driven growth and protected reading areas.
- `public/`: resume, favicon, and project images.

## Official frontend skills

Project-local skills from [Anthropic](https://github.com/anthropics/skills/tree/main/skills/frontend-design) and [OpenAI](https://github.com/openai/plugins/tree/main/plugins/build-web-apps/skills/frontend-app-builder) are installed under `.agents/skills/`. They are available for future project work. Read `AGENTS.md` and `DESIGN.md` for the established PCB visual system and readability requirements.

Animations respect the visitor's reduced-motion preference. Project images and descriptions come from the owner's project repositories; this portfolio does not certify prototype performance.

