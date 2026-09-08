# Decisions — Plugins / GitHub App

## Pull vs Push (must stay clear)

| Direction | Meaning | V1 without review? |
|---|---|---|
| **Pull** | Git → Mermaid: open a repo `.mmd` (or PR file) in the unified editor | **Yes** — just open |
| **Push** | Mermaid → Git: write the diagram back to the repo / branch | **Yes** — save/write without Discard/Approve |
| **Review panel** | Additive editor chrome when the entry was a PR *diff* (diff counts, Approve, Push stages) | Optional layer on the same editor |

They share one GitHub connection and one editor shell. Review is not a separate app.

## Product decisions (aligned)

| Decision | Choice | Why |
|---|---|---|
| Dual direction | Pull and push are first-class; review is optional | Matches plugins (GitHub App) ↔ platform (Mermaid AI) |
| V1 thin loop | Open-only both ways is shippable | Deliver value before full PR review instrumentation |
| Review surface | Same **unified editor** (+ panel when needed) | One chrome; design iterates on real shell |
| Versioning (v1) | **One diagram per PR review** when in review mode | Avoid version-history complexity |
| PR number (demo) | **`#356`** (remap historic `pr=1`) | Demo consistency |
| Status colors | GitHub green → purple | Familiar to engineers (Martin / Dario) |
| Action placement | **Top-center** Discard/Approve when reviewing | Status + actions on same plane (Martin, Jul 23) |
| AI during review | Sparkle **bottom-center**; soft-dismiss | Chat stays available; unfinished review restartable |
| Dashboard | **GitHub sidebar** + branded Connect CTA | Don’t mix linked diagrams with Personal (Wilson / Martin) |

## Roads not taken

| Idea | Verdict | Note |
|---|---|---|
| Review-only product (no open-only) | Rejected | V1 can open without PR chrome |
| Split DiffPane beside canvas | Parked | Pill toggles Design/Code on one canvas |
| Full version history on merge | Later | Eng investigation |
| Combine pill + actions into one control | Partial | Co-located at top |
| Multi-repo composer chips | Out of scope here | Dario’s AI→GitHub journey |
| Hard-exit on AI sparkle | Rejected | Soft-dismiss keeps context |

## Naming

- Product label: **Plugins / GitHub App**
- Delivery repo: **`plugins-github-App`**
- Linked status: `LinkedRepo.status` = `open` | `merged`
- Branch pill tone: `review` | `merged`
