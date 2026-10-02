# Kalshi Markdown Docs

An automated repository that downloads and archives all Kalshi documentation from their sitemap as markdown.

Updated nightly via GitHub Actions. Pages are written to `docs/`. A file is only rewritten when its content changes upstream, and pages Kalshi removes are deleted, so each commit's diff shows exactly what changed in the docs. To sync locally, run `bun run update.ts`.

## Usage

### Agent Skill (Recommended)

Install as an [Agent Skill](https://agentskills.io/) for AI coding agents:

```bash
npx add-skill justrhoto/kalshi-docs
```

Supports [Mux](https://mux.coder.com/), Claude Code, Cursor, Codex, OpenCode, and [20+ other agents](https://github.com/vercel-labs/add-skill#available-agents).

### Git Submodule

Alternatively, add as a git submodule:

```bash
git submodule add https://github.com/justrhoto/kalshi-docs.git docs/kalshi
git submodule update --init --recursive
```

## Documentation Structure

All mirrored pages live under `docs/`, at a path mirroring their upstream URL: replace
`https://docs.kalshi.com/` with `docs/` and append `.md`.

```
docs/api-reference/orders/create-order-v2.md    REST API endpoints
docs/getting_started/*.md                       quickstarts and concepts
docs/websockets/*.md                            WebSocket channels
docs/fix/*.md, docs/margin-rest/*.md, ...       FIX and margin APIs
docs/asyncapi.yaml                              WebSocket API schema (AsyncAPI)
docs/changelog.md                               API changelog
SKILL.md                                        agent skill entry point
update.ts                                       the sync script
```

## License

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

To the extent possible under law, the person who associated CC0 with this work has waived all copyright and related or neighboring rights to this work. This work is published from: United States.

This applies to the automation tooling and the downloaded documentation. Note that Kalshi's original documentation may be subject to their own terms.
