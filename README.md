# Plugins / GitHub App — Developer Delivery

Shareable handoff for **GitHub ↔ Mermaid.AI**: **pull** diagrams from Git into
Mermaid, **push** them back, and optionally run a **PR review panel** in the
same unified editor.

Repo name: **`plugins-github-App`** (GitHub cannot use `/` in repo names; the
product label is still *Plugins / GitHub App*).

| | |
|---|---|
| **Notion-plain** | [`docs/notion-plain-docs.mdc`](./docs/notion-plain-docs.mdc) · [template](./docs/notion-plain-template.html) |
| **Taste layer** | [`docs/ruben-taste-layer.mdc`](./docs/ruben-taste-layer.mdc) |
| **Figma** | [Plugin file](https://www.figma.com/design/uAXScfeDW4A1wSTKv37T85/Plugin) — see [`FIGMA.md`](./FIGMA.md) |
| **HTML delivery** | [`index.html`](./index.html) · https://rubenmango.github.io/plugins-github-App/ |
| **Live JS** | [`assets/live-review.js`](./assets/live-review.js) — review/push chrome stepper |
| **Product source** | [`src/components/`](./src/components/) · [`src/lib/`](./src/lib/) · sync excerpts in [`src/`](./src/) |
| **Decisions** | [`docs/DECISIONS.md`](./docs/DECISIONS.md) — **pull vs push** called out first |
| **Integration** | [`docs/INTEGRATION.md`](./docs/INTEGRATION.md) |
| **Screenshots** | [`assets/screenshots/`](./assets/screenshots/) |

---

## Pull vs Push (read this first)

| | **Pull** (Git → Mermaid) | **Push** (Mermaid → Git) |
|---|---|---|
| Job | Open a repo diagram in Mermaid | Write Mermaid changes back to Git |
| V1 without PR review | **Yes** — just open | **Yes** — save/write to path/branch |
| With review panel | Entry was a PR *diff* → Discard/Approve / Push stages on the same editor | After Approve, push sends the accepted after |

**Vice versa:** start in Mermaid → connect GitHub → push a diagram up, still without requiring review chrome.

The prototype’s live stepper demos the **review + push** layer; open-only is the thinner V1 path on the same shell.

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

**A — V1 open-only:** pull open → edit → optional push back (no review panel).

**B — PR review + push (mimic):**
1. PR comment → Open full review → login gate
2. Unified editor review (top actions, bottom AI)
3. Approve → Push → merged
4. Dashboard GitHub section + Connect CTA

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
