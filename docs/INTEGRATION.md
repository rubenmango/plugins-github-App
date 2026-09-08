# Integration — Plugins / GitHub App

This package is a **design delivery** of a working prototype that spans two product repos.

## Modes to implement

| Mode | Behavior | Review panel? |
|---|---|---|
| **Pull open (V1)** | Load `.mmd` from GitHub into unified editor; link `owner/repo[/pr]` | No |
| **Push write (V1)** | Write current diagram back to Git path/branch | No |
| **PR review (additive)** | Diff highlights + Discard/Approve + Push stages | Yes — same editor |

Do not require review chrome for open-only pull/push.

## Source map

| Piece | Prototype path | Copy from this package |
|---|---|---|
| Review action bar | `Unified-editor-Onboarding/src/lib/components/ReviewActionBar.svelte` | `src/components/ReviewActionBar.svelte` |
| Branch / PR pill | `…/DiagramBranchPill.svelte` | `src/components/DiagramBranchPill.svelte` |
| Dashboard PR tag | `…/RepoPrTag.svelte` | `src/components/RepoPrTag.svelte` |
| Review seed + params | `…/lib/review/githubReviewSeed.ts` | `src/lib/review/githubReviewSeed.ts` |
| Saved diagrams + `linkedRepo` | `…/lib/stores/savedDiagrams.svelte.ts` | `src/lib/stores/savedDiagrams.svelte.ts` |
| Fake PR HTML | `mermaid-sync-service/src/reviewPrDemo.ts` | `src/reviewPrDemo.ts` |
| Login gate | `…/reviewLanding.ts` | `src/reviewLanding.ts` |
| Demo diagrams | `…/demoDiagrams.ts` | `src/demoDiagrams.ts` |

Also wire (not fully duplicated here — live in host apps):

- `DiagramStage.svelte` — top `data-review-action-dock` + bottom AI dock; soft-dismiss on sparkle
- `+page.svelte` — `branchState` machine, `githubReview`, push → `merged`
- `dashboard/+page.svelte` — Personal vs GitHub sections + Connect CTA
- `reviewRoutes.ts` — `/pr`, `/review`, mimic → unified editor URL, `pr=1`→`356` remap

## Icons

Copy from `assets/icons/` into the editor `static/icons/`:

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
- [ ] Mimic sign-in lands in review mode with green added nodes
- [ ] Discard / Approve float **top-center**; AI sparkle **bottom-center**
- [ ] Pill shows `#356 +N -M` while pending; toggles Design/Code
- [ ] Approve → Push → purple “Pushed to” → merged purple merge icon
- [ ] Sparkle soft-dismisses; pill restarts unfinished review
- [ ] Hard Discard exits review fully
- [ ] Connect GitHub repo tile is logo-branded

## Demo URLs

```
http://localhost:3000/mermaid-sync/pr?owner=rubenmango&repo=mermaid-bot-sandbox&pr=356&file=pr-review-architecture.mmd
http://localhost:5173/?review=1&owner=rubenmango&repo=mermaid-bot-sandbox&pr=356&file=pr-review-architecture.mmd
http://localhost:5173/dashboard
```
