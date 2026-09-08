<script lang="ts">
  // Branch / review status pill beside DiagramNameCard.
  // Figma: Plugin uAXScfeDW4A1wSTKv37T85
  //   344:26753 / 344:26790 — open / In Review (green + PR)
  //   355:33118 — review pending with +added / -removed
  //   357:35415 — merged (purple + merge)
  // Click (while showing diff counts) toggles Diff review ↔ Design.
  import { base } from '$app/paths';

  export type BranchPillTone = 'review' | 'merged';

  interface Props {
    branchNumber?: string;
    /** idle = branch id (State4); pending = "In Review" (Default) */
    state?: 'idle' | 'pending';
    /** Override the default idle / "In Review" copy (e.g. "Push to github"). */
    label?: string;
    /** When set (review before accept/discard), show `#N +A -R` like Figma 355:33118. */
    addedCount?: number | null;
    removedCount?: number | null;
    /** Diff review (code) view is currently open. */
    diffActive?: boolean;
    /** review = green open PR; merged = purple + merge icon (Figma 357:35415). */
    tone?: BranchPillTone;
    onclick?: () => void;
  }

  let {
    branchNumber = '#356',
    state = 'idle',
    label: labelOverride,
    addedCount = null,
    removedCount = null,
    diffActive = false,
    tone = 'review',
    onclick,
  }: Props = $props();

  let isPending = $derived(state === 'pending');
  let isMerged = $derived(tone === 'merged');
  let showDiff = $derived(
    typeof addedCount === 'number' && typeof removedCount === 'number',
  );
  let label = $derived(labelOverride ?? (isPending ? 'In Review' : branchNumber));
  let ariaLabel = $derived(
    showDiff
      ? `${branchNumber} +${addedCount} -${removedCount} — ${diffActive ? 'back to design' : 'open Diff review'}`
      : isMerged
        ? `Merged ${label}`
        : isPending
          ? `${label} — click to view changes`
          : `Branch ${label}`,
  );

  let shellClass = $derived(
    isMerged
      ? 'border-github-purple-500 bg-storm-grey-25 text-github-purple-600 hover:bg-storm-grey-50 active:bg-storm-grey-50'
      : 'border-status-success bg-seaweed-green-25 text-status-success hover:bg-seaweed-green-50 active:bg-seaweed-green-50',
  );
</script>

<button
  type="button"
  class="inline-flex h-8 items-center justify-center gap-2 rounded-lg border py-1 pl-3 pr-2 transition-colors {shellClass} {diffActive
    ? 'ring-2 ring-deep-purple-400/40'
    : ''}"
  aria-label={ariaLabel}
  aria-pressed={showDiff ? diffActive : undefined}
  data-node-id={isMerged ? '357:35415' : showDiff ? '355:33118' : '344:26753'}
  data-state={isMerged
    ? 'merged'
    : showDiff
      ? diffActive
        ? 'diff-open'
        : 'review-diff'
      : isPending
        ? 'review'
        : 'branch'}
  data-tone={tone}
  {onclick}
>
  {#if showDiff}
    <span
      class="font-recursive-sans flex shrink-0 items-center gap-1.5 text-[12px] leading-none whitespace-nowrap"
    >
      <span class="text-status-success">{branchNumber}</span>
      <span class="text-status-success">+{addedCount}</span>
      <span class="text-[#eb1328]">-{removedCount}</span>
    </span>
  {:else}
    <span
      class="font-recursive-sans shrink-0 text-[12px] leading-none whitespace-nowrap {isMerged
        ? 'text-github-purple-600'
        : 'text-status-success'}"
    >
      {label}
    </span>
  {/if}
  <span class="relative flex size-6 shrink-0 items-center justify-center" aria-hidden="true">
    {#if isMerged}
      <img
        src="{base}/icons/octicon-git-merge.svg"
        alt=""
        width="14"
        height="14"
        class="size-[14px]"
      />
    {:else}
      <img
        src="{base}/icons/octicon-git-pull-request.svg"
        alt=""
        width="14"
        height="14"
        class="size-[14px]"
      />
    {/if}
  </span>
</button>
