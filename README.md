# Plugins / GitHub App — Developer Delivery

Shareable handoff for the **GitHub App → Mermaid.AI PR review** mimic
(plugins ↔ platform bridge).

Repo name: **`plugins-github-App`** (GitHub cannot use `/` in repo names; the
product label is still *Plugins / GitHub App*).

| | |
|---|---|
| **Notion-plain** | [`docs/notion-plain-docs.mdc`](./docs/notion-plain-docs.mdc) · [template](./docs/notion-plain-template.html) |
| **Taste layer** | [`docs/ruben-taste-layer.mdc`](./docs/ruben-taste-layer.mdc) |
| **Figma** | [Plugin file](https://www.figma.com/design/uAXScfeDW4A1wSTKv37T85/Plugin) — see [`FIGMA.md`](./FIGMA.md) |
| **HTML delivery** | [`index.html`](./index.html) (+ GitHub Pages once enabled) |
| **Live JS** | [`assets/live-review.js`](./assets/live-review.js) — stage stepper for review chrome |
| **Product source** | [`src/components/`](./src/components/) · [`src/lib/`](./src/lib/) · sync excerpts in [`src/`](./src/) |
| **Decisions** | [`docs/DECISIONS.md`](./docs/DECISIONS.md) |
| **Integration** | [`docs/INTEGRATION.md`](./docs/INTEGRATION.md) |
| **Screenshots** | [`assets/screenshots/`](./assets/screenshots/) |

---

## Quick start

```bash
open index.html
```

### Local product demo (two processes)

```bash
# Unified editor + tunnel
cd "/path/to/Unified-editor-Onboarding" && ./share-tunnel.sh

# Sync / gate / fake PR
cd ~/mermaid-sync-service && npm start
```

| Surface | URL |
|---|---|
| Editor | http://localhost:5173 |
| Tunnel | https://repost-polymer-ambitious.ngrok-free.dev |
| Fake PR entry | http://localhost:3000/mermaid-sync/pr?owner=rubenmango&repo=mermaid-bot-sandbox&pr=356&file=pr-review-architecture.mmd |

---

## User flows covered

1. **PR comment → Open full review** (fake GitHub Conversation)
2. **Login gate** (Sign in with GitHub / mimic)
3. **Unified editor review** — green added nodes, `#356 +N -M` pill, Discard / Approve **top-center**, AI sparkle **bottom-center**
4. **Approve → Push to repo → Pushed to** (purple open-PR chip) → **merged** pill
5. **Soft-dismiss** via AI sparkle; pill restarts unfinished review
6. **Dashboard** — Personal vs **GitHub → Connected repos** + **Connect GitHub repo** CTA

---

## What’s in this repo

```
plugins-github-App/
├── index.html
├── assets/live-review.js
├── assets/screenshots/
├── assets/icons/
├── src/components/          ReviewActionBar, DiagramBranchPill, RepoPrTag
├── src/lib/review/          githubReviewSeed, branchDiffSplit
├── src/lib/stores/          savedDiagrams
├── src/reviewPrDemo.ts …    sync-service excerpts
├── docs/
└── README.md
```

---

## Created for

Mermaid Chart **Plugins × Platform** design → engineering handoff (Product × Design Weekly, 2026-07-23 feedback applied).
