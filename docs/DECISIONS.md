# Decisions — Plugins / GitHub App review mimic

## Product decisions (aligned)

| Decision | Choice | Why |
|---|---|---|
| Review surface | **Unified editor**, not HTML `reviewEditor` | One chrome for Mermaid AI; design iterates on real shell |
| Versioning (v1) | **One diagram per PR review** | Avoid version-history complexity for first release |
| PR number | **`#356`** (remap historic `pr=1`) | Demo consistency across gate, pill, tags |
| Status colors | GitHub green → purple | Familiar to engineers (Martin / Dario) |
| Action placement | **Top-center** Discard/Approve | Status + actions on same plane (Martin, Jul 23) |
| AI during review | Sparkle **bottom-center**; soft-dismiss | Chat stays available; unfinished review restartable via pill |
| Dashboard | **GitHub sidebar section** + branded Connect CTA | Don’t mix linked diagrams with Personal (Wilson / Martin) |

## Roads not taken

| Idea | Verdict | Note |
|---|---|---|
| Split DiffPane beside canvas | Parked (`ENABLE_BRANCH_DIFF_SPLIT = false`) | Pill toggles Design/Code on one canvas |
| Full version history on merge | Later | Grouping / history needs eng investigation |
| Combine pill + actions into one control | Partial | Co-located at top; not a single component yet |
| Multi-repo composer chips | Out of scope for this mimic | Dario’s AI→GitHub journey |
| Hard-exit on AI sparkle | Rejected | Soft-dismiss keeps `githubReview` for restart |

## Naming

- Product label: **Plugins / GitHub App**
- Delivery repo: **`plugins-github-App`** (slash illegal in GitHub repo names)
- Linked status: `LinkedRepo.status` = `open` | `merged`
- Branch pill tone: `review` | `merged`
