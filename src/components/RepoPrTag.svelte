<script lang="ts">
  // Linked-to-repo PR chip.
  // Figma: 344:26738 (open — green) · 357:35415 (merged — purple) — `status` variant.
  // Search meta: same shell as Connection / Shared chips — `meta` variant.
  import { base } from '$app/paths';

  export type RepoPrStatus = 'open' | 'merged';
  export type RepoPrVariant = 'status' | 'meta';

  interface Props {
    /** e.g. "#356" or "356" */
    pr: string;
    /** open = green PR icon; merged = purple merge icon. Ignored for `meta`. */
    status?: RepoPrStatus;
    /**
     * `status` — icon chip; # reveals on hover (dashboard cards).
     * `meta` — Connection-style label chip (search); always shows #.
     */
    variant?: RepoPrVariant;
    /** When set, chip is a button (search drill-in). */
    onclick?: (e: MouseEvent) => void;
  }

  let { pr, status = 'open', variant = 'status', onclick }: Props = $props();

  let label = $derived(pr.startsWith('#') ? pr : `#${pr}`);
  let isMerged = $derived(status === 'merged');
  let isMeta = $derived(variant === 'meta');
</script>

{#if isMeta}
  {#if onclick}
    <button
      type="button"
      class="flex h-6 shrink-0 items-center rounded border border-storm-grey-50 px-2 text-[12px] font-medium text-storm-grey-400 transition-colors hover:border-storm-grey-100 hover:text-storm-grey-600"
      data-variant="meta"
      title={`${label} · Linked to repository`}
      {onclick}
    >
      {label}
    </button>
  {:else}
    <span
      class="flex h-6 shrink-0 items-center rounded border border-storm-grey-50 px-2 text-[12px] font-medium text-storm-grey-400"
      data-variant="meta"
      title={`${label} · Linked to repository`}
    >
      {label}
    </span>
  {/if}
{:else}
  <span
    class="group/pr-tag inline-flex h-7 shrink-0 items-center justify-center gap-0 overflow-hidden rounded-lg border px-2 font-recursive-sans text-[12px] leading-none whitespace-nowrap transition-[gap,padding] duration-150 hover:gap-1 hover:px-2.5 group-hover/row:gap-1 group-hover/row:px-2.5 {isMerged
      ? 'border-github-purple-500 bg-storm-grey-25 text-github-purple-600'
      : 'border-status-success bg-seaweed-green-25 text-status-success'}"
    data-node-id={isMerged ? '357:35415' : '344:26738'}
    data-status={status}
    data-variant="status"
    title={isMerged ? `${label} · Merged pull request` : `${label} · Linked to repository`}
  >
    <span
      class="max-w-0 overflow-hidden opacity-0 transition-[max-width,opacity] duration-150 group-hover/pr-tag:max-w-[4rem] group-hover/pr-tag:opacity-100 group-hover/row:max-w-[4rem] group-hover/row:opacity-100"
      aria-hidden="true"
    >
      {label}
    </span>
    {#if isMerged}
      <img
        src="{base}/icons/octicon-git-merge.svg"
        alt=""
        width="12"
        height="12"
        class="size-3 shrink-0"
      />
    {:else}
      <img
        src="{base}/icons/octicon-git-pull-request.svg"
        alt=""
        width="12"
        height="12"
        class="size-3 shrink-0"
      />
    {/if}
    <span class="sr-only">{label}</span>
  </span>
{/if}
