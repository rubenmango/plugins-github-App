import { esc, headTags } from "./theme";
import type { ReviewContext } from "./reviewContext";
import { buildReviewLandingUrl } from "./reviewContext";
import {
  DEMO_DIAGRAM_BEFORE,
  DEMO_DIAGRAM_FILE,
  DEMO_DIAGRAM_SUMMARY,
  DEMO_PR_TITLE,
} from "./demoDiagrams";

/**
 * Fake GitHub PR Conversation page — demo entry *before* the login gate.
 * Diagram preview matches the unified-editor review seed (Slices 0/1/2).
 */

const CSS = `
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh;
    font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
    color: #1f2328; background: #ffffff;
  }
  a { color: #0969da; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .topbar {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    padding: 12px 24px; background: #f6f8fa; border-bottom: 1px solid #d0d7de;
  }
  .topbar .mark { display: flex; align-items: center; gap: 8px; color: #1f2328; font-weight: 600; }
  .topbar nav { display: flex; gap: 12px; flex-wrap: wrap; font-size: 14px; }
  .topbar nav a { color: #1f2328; padding: 4px 0; border-bottom: 2px solid transparent; }
  .topbar nav a.active { border-bottom-color: #fd8c73; font-weight: 600; }
  .badge-count {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px; padding: 0 6px; margin-left: 4px;
    border-radius: 999px; background: #59636e; color: #fff; font-size: 11px; font-weight: 600;
  }
  .page { max-width: 1012px; margin: 0 auto; padding: 24px 16px 64px; }
  .pr-title { font-size: 28px; font-weight: 400; line-height: 1.25; margin: 0 0 8px; }
  .pr-title .num { color: #59636e; font-weight: 400; }
  .pr-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 16px; color: #59636e; font-size: 14px; }
  .state {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; color: #fff; background: #1a7f37;
  }
  .branch {
    display: inline-block; padding: 0 6px; border-radius: 6px;
    background: #ddf4ff; color: #0969da; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
  }
  .tabs {
    display: flex; gap: 0; border-bottom: 1px solid #d0d7de; margin: 16px 0 24px; overflow-x: auto;
  }
  .tabs span {
    padding: 10px 16px; color: #1f2328; white-space: nowrap; border-bottom: 2px solid transparent; margin-bottom: -1px;
  }
  .tabs span.active { border-bottom-color: #fd8c73; font-weight: 600; }
  .layout { display: grid; grid-template-columns: minmax(0,1fr) 296px; gap: 24px; }
  @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }
  .timeline { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
  .comment {
    display: grid; grid-template-columns: 40px minmax(0,1fr); gap: 12px;
  }
  .avatar {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 600; color: #fff; background: #6e7781;
    overflow: hidden;
  }
  .avatar.bot {
    background: #e0095f;
    padding: 0;
  }
  .avatar.bot img {
    display: block; width: 100%; height: 100%; object-fit: cover;
  }
  .bubble {
    border: 1px solid #d0d7de; border-radius: 6px; background: #fff; overflow: hidden;
  }
  .bubble-head {
    display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px;
    padding: 8px 16px; background: #f6f8fa; border-bottom: 1px solid #d0d7de;
    font-size: 12px; color: #59636e;
  }
  .bubble-head strong { color: #1f2328; font-size: 14px; }
  .author-tag {
    display: inline-block; padding: 0 6px; border-radius: 2em;
    border: 1px solid #d0d7de; font-size: 12px; font-weight: 500; color: #59636e;
  }
  .bubble-body { padding: 16px; }
  .bubble-body p { margin: 0 0 12px; }
  .bot-title { font-size: 16px; font-weight: 600; margin: 0 0 12px; color: #1f2328; }
  .reviewed {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; margin-bottom: 12px; border-radius: 6px;
    background: #dafbe1; color: #1a7f37; font-size: 13px; font-weight: 500;
  }
  .file-line { margin: 0 0 12px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; }
  .file-line code { background: #f6f8fa; padding: 2px 6px; border-radius: 4px; }
  .section-label { font-weight: 600; margin: 0 0 8px; }
  .diagram-frame {
    padding: 12px; border: 1px solid #d0d7de; border-radius: 8px; background: #f6f8fa;
    overflow: auto; margin-bottom: 16px; min-height: 120px;
  }
  .diagram-frame svg { max-width: 100%; height: auto; display: block; }
  .diagram-frame img {
    display: block; width: 100%; height: auto; border-radius: 4px; background: #fff;
  }
  .diagram-frame .loading { color: #59636e; font-size: 13px; padding: 24px; text-align: center; }
  .footer-link { margin: 16px 0 0; font-size: 12px; color: #59636e; }
  .footer-link a { font-weight: 500; }
  .cta {
    display: inline-flex; align-items: center; justify-content: center;
    margin-top: 12px; padding: 8px 16px; border-radius: 6px;
    background: #1f883d; color: #fff !important; font-weight: 600; font-size: 14px;
    text-decoration: none !important;
  }
  .cta:hover { background: #1a7f37; }
  .aside .box {
    border: 1px solid #d0d7de; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px;
  }
  .aside h3 {
    margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #59636e; text-transform: none;
  }
  .aside p { margin: 0; font-size: 12px; color: #59636e; }
  .demo-banner {
    background: #fff8c5; border-bottom: 1px solid #d4a72c; color: #7d4e00;
    padding: 8px 16px; font-size: 13px; text-align: center;
  }
`;

export function renderFakeGithubPr(ctx: ReviewContext): string {
  const reviewUrl = buildReviewLandingUrl(ctx);
  const repo = `${ctx.owner}/${ctx.repo}`;
  const file = ctx.file || DEMO_DIAGRAM_FILE;
  const title = DEMO_PR_TITLE;

  return `<!doctype html>
<html lang="en">
<head>
${headTags(`${title} by ${ctx.owner} · Pull Request #${ctx.pr} · ${repo}`, CSS)}
</head>
<body>
  <div class="demo-banner">
    Demo preview — not real GitHub. Click <strong>Open full review</strong> to continue to Mermaid Sync sign-in.
  </div>
  <header class="topbar">
    <div class="mark">${githubMark()} ${esc(repo)}</div>
    <nav>
      <a href="#">Code</a>
      <a href="#">Issues</a>
      <a class="active" href="#">Pull requests<span class="badge-count">1</span></a>
      <a href="#">Actions</a>
      <a href="#">Projects</a>
      <a href="#">Security</a>
      <a href="#">Insights</a>
      <a href="#">Settings</a>
    </nav>
  </header>

  <main class="page">
    <h1 class="pr-title">${esc(title)} <span class="num">#${esc(ctx.pr)}</span></h1>
    <div class="pr-meta">
      <span class="state">Open</span>
      <span><strong>${esc(ctx.owner)}</strong> wants to merge 8 commits into <span class="branch">main</span> from <span class="branch">test-diagram-change</span></span>
    </div>

    <div class="tabs">
      <span class="active">Conversation <span class="badge-count">2</span></span>
      <span>Commits <span class="badge-count">8</span></span>
      <span>Checks</span>
      <span>Files changed <span class="badge-count">1</span></span>
    </div>

    <div class="layout">
      <div class="timeline">
        <article class="comment">
          <div class="avatar" aria-hidden="true">${esc((ctx.owner[0] || "U").toUpperCase())}</div>
          <div class="bubble">
            <div class="bubble-head">
              <strong>${esc(ctx.owner)}</strong>
              <span class="author-tag">Author</span>
              <span>commented just now</span>
            </div>
            <div class="bubble-body">
              <p>Adds Slice 2 (active review) + audit log to the PR Review architecture diagram. Same seed as the Mermaid.AI demo.</p>
            </div>
          </div>
        </article>

        <article class="comment">
          <div class="avatar bot" aria-hidden="true">
            <img
              src="/mermaid-sync/static/demo/mermaid-logo.png"
              alt="Mermaid"
              width="40"
              height="40"
            />
          </div>
          <div class="bubble">
            <div class="bubble-head">
              <strong>mermaid-diagram-bot</strong>
              <span class="author-tag">bot</span>
              <span>commented just now</span>
            </div>
            <div class="bubble-body">
              <h2 class="bot-title">🧜 Mermaid Sync — diagram changes in this PR</h2>
              <div class="reviewed">✓ Reviewed in VS Code by Ruben Mangorrinha</div>
              <p class="file-line"><code>${esc(file)}</code> — ${esc(DEMO_DIAGRAM_SUMMARY)}</p>
              <p class="section-label">Before</p>
              <div class="diagram-frame" id="diagram-before"><div class="loading">Rendering…</div></div>
              <p class="section-label">After</p>
              <div class="diagram-frame">
                <img
                  src="/mermaid-sync/static/demo/pr-review-architecture-after.jpg"
                  alt="PR Review — Slices 0/1/2 architecture (after)"
                  width="1024"
                  height="454"
                />
              </div>
              <p class="footer-link">
                <a class="cta" href="${esc(reviewUrl)}">Open full review</a>
                <span> · rendered by Mermaid Sync</span>
              </p>
            </div>
          </div>
        </article>
      </div>

      <aside class="aside">
        <div class="box"><h3>Reviewers</h3><p>No reviews</p></div>
        <div class="box"><h3>Assignees</h3><p>No one assigned</p></div>
        <div class="box"><h3>Labels</h3><p>None yet</p></div>
        <div class="box"><h3>Projects</h3><p>None yet</p></div>
        <div class="box"><h3>Milestone</h3><p>No milestone</p></div>
        <div class="box"><h3>Development</h3><p>Successfully merging this pull request may close these issues.</p></div>
      </aside>
    </div>
  </main>
  <script type="module">
    import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
    mermaid.initialize({ startOnLoad: false, theme: "base", securityLevel: "loose" });
    // Before = Source + Slice 0 + Slice 1 (same seed as the unified-editor demo).
    const before = ${JSON.stringify(DEMO_DIAGRAM_BEFORE)};
    try {
      const { svg } = await mermaid.render("ue-fake-before", before);
      document.getElementById("diagram-before").innerHTML = svg;
    } catch (err) {
      document.getElementById("diagram-before").innerHTML =
        '<div class="loading">Couldn’t render before diagram</div>';
      console.error(err);
    }
  </script>
</body>
</html>`;
}

function githubMark(): string {
  return `<svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`;
}
