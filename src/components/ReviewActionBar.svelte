<script lang="ts">
  // Floating review / push cluster — Figma Plugin file stages:
  //   344:26912 accept or decline
  //   344:26810 after push (ready)
  //   355:33028 ready + close (hover)
  //   344:26831 pushing…
  //   344:26866 unable to push
  //   344:26585 / 344:26848 pushed to (open PR — github purple)
  import { base } from '$app/paths';

  export type ReviewBarStage = 'review' | 'ready' | 'pushing' | 'success' | 'error';

  interface Props {
    stage?: ReviewBarStage;
    branchNumber?: string;
    onDiscard?: () => void;
    onApprove?: () => void;
    onPush?: () => void;
    /** Ready/error → back to Discard / Approve. */
    onBackToReview?: () => void;
  }

  let {
    stage = 'review',
    branchNumber = '#356',
    onDiscard,
    onApprove,
    onPush,
    onBackToReview,
  }: Props = $props();

  const canDismiss = $derived(stage === 'ready' || stage === 'error');
</script>

<div
  class="review-action-bar group relative flex h-12 items-center rounded-xl border border-storm-grey-200 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08)] {canDismiss
    ? 'gap-3 px-3'
    : 'gap-2 px-2'}"
  data-review-action-bar
  data-stage={stage}
  data-node-id={stage === 'review'
    ? '344:26912'
    : stage === 'ready'
      ? '355:33028'
      : stage === 'pushing'
        ? '344:26831'
        : stage === 'error'
          ? '344:26866'
          : '344:26848'}
>
  {#if stage === 'review'}
    <button
      type="button"
      class="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-black/10 bg-transparent px-2.5 font-recursive-sans text-[14px] font-medium leading-5 tracking-[-0.2px] text-[#242329] transition-colors hover:bg-storm-grey-50"
      onclick={onDiscard}
    >
      Discard
    </button>
    <button
      type="button"
      class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-status-success px-3 font-recursive-sans text-[14px] font-semibold leading-5 text-white transition-colors hover:bg-seaweed-green-800"
      onclick={onApprove}
    >
      Approve
      <span
        class="inline-flex items-center justify-center rounded px-1 font-recursive-sans text-[14px] font-normal leading-5 text-status-success bg-seaweed-green-25"
      >
        ⌘⏎
      </span>
    </button>
  {:else if stage === 'ready'}
    <!-- Figma 355:33028 — close_small leads the row on hover -->
    <button
      type="button"
      class="review-action-bar__close -mr-3 inline-flex h-5 w-0 shrink-0 items-center justify-center overflow-hidden opacity-0 pointer-events-none transition-[width,opacity,margin] duration-200 ease-out group-hover:mr-0 group-hover:w-5 group-hover:opacity-100 group-hover:pointer-events-auto focus-visible:mr-0 focus-visible:w-5 focus-visible:opacity-100 focus-visible:pointer-events-auto"
      aria-label="Back to review"
      data-node-id="355:33056"
      onclick={onBackToReview}
    >
      <img src="{base}/icons/close-small.svg" alt="" width="20" height="20" class="size-5 shrink-0" />
    </button>
    <button
      type="button"
      class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-storm-grey-200 bg-storm-grey-50 px-3 font-recursive-sans text-[14px] font-semibold leading-5 text-deep-purple-800 transition-colors hover:bg-storm-grey-100"
      onclick={onPush}
    >
      Push to repo
      <span
        class="inline-flex items-center justify-center rounded border border-status-success bg-seaweed-green-25 px-1 font-recursive-sans text-[14px] font-normal leading-5 text-status-success"
      >
        ⌘⏎
      </span>
    </button>
    <span
      class="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-status-success bg-seaweed-green-25 px-3 text-[12px] text-status-success"
    >
      {branchNumber}
      <img
        src="{base}/icons/octicon-git-pull-request.svg"
        alt=""
        width="16"
        height="16"
        class="size-4"
      />
    </span>
  {:else if stage === 'pushing'}
    <span class="font-recursive-sans text-[14px] leading-none text-deep-purple-800">Pushing..</span>
    <span
      class="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-status-success bg-seaweed-green-25 px-3 text-[12px] text-status-success"
    >
      {branchNumber}
      <img
        src="{base}/icons/octicon-git-pull-request.svg"
        alt=""
        width="16"
        height="16"
        class="size-4"
      />
    </span>
  {:else if stage === 'error'}
    <button
      type="button"
      class="review-action-bar__close -mr-3 inline-flex h-5 w-0 shrink-0 items-center justify-center overflow-hidden opacity-0 pointer-events-none transition-[width,opacity,margin] duration-200 ease-out group-hover:mr-0 group-hover:w-5 group-hover:opacity-100 group-hover:pointer-events-auto focus-visible:mr-0 focus-visible:w-5 focus-visible:opacity-100 focus-visible:pointer-events-auto"
      aria-label="Back to review"
      onclick={onBackToReview}
    >
      <img src="{base}/icons/close-small.svg" alt="" width="20" height="20" class="size-5 shrink-0" />
    </button>
    <span class="font-recursive-sans text-[14px] leading-none text-deep-purple-800"
      >Unable to push</span
    >
    <span
      class="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-storm-grey-100 bg-[#cf222e] px-3 text-[12px] text-white"
    >
      {branchNumber}
      <img
        src="{base}/icons/octicon-git-pull-request-closed.svg"
        alt=""
        width="16"
        height="16"
        class="size-4"
      />
    </span>
  {:else}
    <!-- Figma 344:26585 — open PR purple after successful push -->
    <span class="font-recursive-sans text-[14px] leading-none text-deep-purple-800">Pushed to</span>
    <span
      class="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-github-purple-600 bg-storm-grey-25 px-3 text-[12px] text-github-purple-600"
      data-node-id="344:26590"
    >
      {branchNumber}
      <span
        class="size-4 shrink-0 bg-github-purple-600"
        style="mask: url('{base}/icons/octicon-git-pull-request.svg') center / contain no-repeat; -webkit-mask: url('{base}/icons/octicon-git-pull-request.svg') center / contain no-repeat;"
        aria-hidden="true"
      ></span>
    </span>
  {/if}
</div>

<style>
  @media (prefers-reduced-motion: reduce) {
    .review-action-bar__close {
      transition: none;
    }
  }
</style>
