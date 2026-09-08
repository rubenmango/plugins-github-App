# Integration — Plugins / GitHub App

This **public** Pages package is handoff only (slide · screenshots · live stepper ·
password gate). **Product source is private.**

## Where the code lives

| | |
|---|---|
| **Private Mermaid repo** | [`Mermaid-Chart/app-team`](https://github.com/Mermaid-Chart/app-team) (org access required) |
| **Canonical `src/`** | [`handoffs/plugins-github-App/src/`](https://github.com/Mermaid-Chart/app-team/tree/main/handoffs/plugins-github-App/src) |
| **This package** | Visual delivery only — https://rubenmango.github.io/plugins-github-App/ |

```bash
git clone git@github.com:Mermaid-Chart/app-team.git
cd app-team/handoffs/plugins-github-App
```

## Modes to implement

| Mode | Behavior | Review panel? |
|---|---|---|
| **Pull open (V1)** | Load `.mmd` from GitHub into unified editor; link `owner/repo[/pr]` | No |
| **Push write (V1)** | Write current diagram back to Git path/branch | No |
| **PR review (additive)** | Diff highlights + Discard/Approve + Push stages | Yes — same editor |

Do not require review chrome for open-only pull/push.

## Source map

| Piece | Copy from private handoff |
|---|---|
| Review action bar | `src/components/ReviewActionBar.svelte` |
| Branch / PR pill | `src/components/DiagramBranchPill.svelte` |
| Dashboard PR tag | `src/components/RepoPrTag.svelte` |
| Review seed + params | `src/lib/review/githubReviewSeed.ts` |
| Saved diagrams + `linkedRepo` | `src/lib/stores/savedDiagrams.svelte.ts` |
| Fake PR HTML | `src/reviewPrDemo.ts` |
| Login gate | `src/reviewLanding.ts` |
| Demo diagrams | `src/demoDiagrams.ts` |

Also wire (live in host apps, not fully duplicated in the handoff):

- `DiagramStage.svelte` — top `data-review-action-dock` + bottom AI dock; soft-dismiss on sparkle
- `+page.svelte` — `branchState` machine, `githubReview`, push → `merged`
- `dashboard/+page.svelte` — Personal vs GitHub sections + Connect CTA
- `reviewRoutes.ts` — `/pr`, `/review`, mimic → unified editor URL, `pr=1`→`356` remap

## Icons

From this Pages package `assets/icons/` → editor `static/icons/`:

- `github.svg`, `octicon-git-pull-request.svg`, `octicon-git-merge.svg`, `octicon-git-pull-request-closed.svg`, `close-small.svg`

## Tokens

```css
--color-storm-grey-25: #fcfcfd;
--color-status-success: #058565;
--color-github-purple-500: #9266e3;
--color-github-purple-600: #8250df;
--color-seaweed-green-25: #f8fffc;
```

## Acceptance checklist

### V1 open-only
- [ ] Pull: open a GitHub `.mmd` in the unified editor without Discard/Approve
- [ ] Push: write that diagram back to Git without review chrome
- [ ] Vice versa: create in Mermaid → connect repo → push up
- [ ] Linked diagrams land under dashboard **GitHub**, not Personal

### Review layer (additive)
- [ ] Fake PR CTA opens login gate with **#356** meta link
- [ ] Editor shows Discard / Approve top-center; AI sparkle bottom-center
- [ ] Approve → Push to repo → Pushed to (purple) → merged pill/tag
- [ ] Soft-dismiss via AI keeps `githubReview` for restart; Discard clears fully
