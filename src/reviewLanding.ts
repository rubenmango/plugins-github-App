import { esc, headTags, MERMAID_LOGO, GITHUB_ICON } from "./theme";
import type { ReviewContext } from "./reviewContext";
import { buildReviewEditorUrl } from "./reviewContext";

/**
 * The review **login gate** (Figma "Review this diagram change" modal).
 *
 * Clicking the PR comment's review link lands here. The single call to action
 * is **Sign in with GitHub** — the playground / "open anonymously" fallback was
 * removed (per Kasey/Martin). Signing in creates the review doc in the user's
 * account and drops them straight into the web review editor. Free users are
 * NOT blocked here; the only paywall is the 3-diagram free limit, enforced on
 * the editor route.
 */

const CARD_CSS = `
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    font: 15px/1.5 var(--font-sans);
    background: radial-gradient(130% 130% at 50% -10%, #211532 0%, #0c0a14 60%);
    padding: 24px; color: var(--foreground);
  }
  .card {
    width: 100%; max-width: 500px; background: var(--card);
    border: 1px solid var(--border); border-radius: var(--radius-card); overflow: hidden;
    box-shadow: 0 30px 70px rgba(0,0,0,.5);
  }
  .body { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 32px; }
  h1 {
    font-family: var(--font-display); font-weight: 500; font-size: 34px; line-height: 40px;
    letter-spacing: -0.68px; margin: 0; color: var(--foreground); text-align: center;
  }
  p.sub { margin: -12px 0 0; color: var(--muted-foreground); font-size: 15px; text-align: center; }
  .separator { width: 339px; max-width: 100%; height: 1px; background: var(--border); }
  .meta-box { width: 100%; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 2px 16px; }
  .meta {
    display: flex; justify-content: space-between; gap: 12px; align-items: center;
    padding: 11px 0; font-size: 14px; border-top: 1px solid var(--border);
  }
  .meta:first-child { border-top: 0; }
  .meta span { color: var(--muted-foreground); }
  .meta code { font-family: var(--font-mono); color: var(--foreground); font-size: 13px; }
  .meta a { color: var(--foreground); text-decoration: none; font-weight: 500; }
  .meta a:hover { color: #E0095F; }
  .actions { width: 100%; display: flex; flex-direction: column; gap: 8px; }
  a.btn {
    display: flex; align-items: center; justify-content: center; gap: 12px;
    height: 48px; padding: 8px 16px; border-radius: var(--radius-md);
    font-family: var(--font-sans); font-size: 16px; line-height: 24px; font-weight: 500;
    text-decoration: none; transition: filter .15s ease, background .15s ease;
  }
  a.btn:active { transform: translateY(1px); }
  a.github { background: #1f2328; color: #fff; border: 1.5px solid #1f2328; }
  a.github:hover { filter: brightness(1.25); }
  .legal {
    margin: 0; font-family: var(--font-display); font-size: 12px; line-height: 18px;
    letter-spacing: .24px; color: #707070; text-align: center;
  }
  .footer {
    background: var(--footer-bg); border-top: 1px solid var(--border);
    padding: 24px; text-align: center;
    font-size: 15px; letter-spacing: -0.3px; color: var(--muted-foreground);
  }
`;

export interface LoginGateOptions {
  /** When true, CTA skips real OAuth (local design preview). */
  mimic?: boolean;
}

/**
 * Render the login-gate HTML. `signInUrl` is the server route that begins the
 * OAuth handshake (or the mimic continue route when previewing locally).
 */
export function renderLoginGate(
  ctx: ReviewContext,
  signInUrl: string,
  opts: LoginGateOptions = {},
): string {
  const editorUrl = buildReviewEditorUrl(ctx);
  const prUrl = `https://github.com/${ctx.owner}/${ctx.repo}/pull/${ctx.pr}`;

  const fileRow = ctx.file
    ? `<div class="meta"><span>Diagram</span><code>${esc(ctx.file)}</code></div>`
    : "";
  const refRow = ctx.ref
    ? `<div class="meta"><span>Change</span><code>${esc(ctx.ref.slice(0, 7))}</code></div>`
    : "";

  const mimicBanner = opts.mimic
    ? `<p class="sub" style="margin-top:-8px;font-size:13px;color:#07b88c">Local preview — same UI, no real GitHub OAuth</p>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
${headTags("Review this diagram change — Mermaid Sync", CARD_CSS)}
</head>
<body>
  <div class="card">
    <div class="body">
      ${MERMAID_LOGO}
      <h1>Review this diagram change</h1>
      <p class="sub">Mermaid Sync rendered a before → after for this pull request. Sign in to review it.</p>
      ${mimicBanner}

      <div class="separator"></div>

      <div class="meta-box">
        <div class="meta"><span>Repository</span><a href="${esc(`https://github.com/${ctx.owner}/${ctx.repo}`)}">${esc(`${ctx.owner}/${ctx.repo}`)}</a></div>
        <div class="meta"><span>Pull request</span><a href="${esc(prUrl)}">#${esc(ctx.pr)}</a></div>
        ${fileRow}
        ${refRow}
      </div>

      <div class="actions">
        <a class="btn github" href="${esc(signInUrl)}" data-editor="${esc(editorUrl)}">${GITHUB_ICON} Sign in with GitHub</a>
      </div>

      <p class="legal">Signing in opens the change in the Mermaid Chart editor and saves the review to your account.</p>
    </div>
    <div class="footer">
      New to Mermaid Chart? Signing in with GitHub creates your free account.
    </div>
  </div>
</body>
</html>`;
}
