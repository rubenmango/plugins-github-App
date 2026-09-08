/**
 * Seed content for the GitHub App → Mermaid.AI review mimic.
 * Source: mermaid.ai diagram a06aecfe — PR Review Slices 0/1/2 architecture.
 * PR adds Slice 2 (active review) + Audit log.
 */

/** Node ids introduced by this PR (green outline in design view). */
export const GITHUB_REVIEW_ADDED_NODE_IDS = [
  'OpenReview',
  'ContentProvider',
  'NodeDiff',
  'DiffView',
  'Actions',
  'AuditLog',
] as const;

const FRONTMATTER = `---
config:
  layout: dagre
title: PR Review — Slices 0/1/2 architecture
---`;

/** Shared classDefs — no red (reads as "removed" in review). */
const CLASS_DEFS = `     GitRepo:::sourceStyle
     SyncBot:::sourceStyle
     Detector:::slice0Style
     TrailerImpl:::slice0Style
     ParserFn:::slice0Style
     CodeLens:::slice1Style
     FileDeco:::slice1Style
     OpenReview:::slice2Style
     ContentProvider:::slice2Style
     NodeDiff:::slice2Style
     DiffView:::slice2Style
     Actions:::slice2Style
     AuditLog:::auditStyle
    classDef sourceStyle stroke:#818cf8,fill:#eef2ff,color:#1e1b4b
    classDef slice0Style stroke:#2dd4bf,fill:#f0fdfa,color:#1e1b4b
    classDef slice1Style stroke:#a78bfa,fill:#f5f3ff,color:#1e1b4b
    classDef slice2Style stroke:#fb923c,fill:#fff7ed,color:#1e1b4b
    classDef auditStyle stroke:#64748b,fill:#f8fafc,color:#1e1b4b
    style Slice2 fill:transparent,stroke:#d9d9d9
    style Slice0 fill:transparent,stroke:#d9d9d9
    style Source fill:transparent,stroke:#d9d9d9
    style Slice1 fill:transparent,stroke:#d9d9d9`;

/** Base on main — Source + detection + VS Code surface only. */
export const GITHUB_REVIEW_DIAGRAM_BEFORE = `${FRONTMATTER}
flowchart LR
 subgraph Source["Source of truth"]
        GitRepo["Git repo<br>commit history"]
        SyncBot["Mermaid Sync<br>GitHub App"]
  end
 subgraph Slice0["Slice 0 · Detection"]
        Detector["BotEditDetector<br>interface"]
        TrailerImpl["GitTrailerDetector<br>reads commit trailer"]
        ParserFn["parseBotEditInfo<br>pure helper"]
  end
 subgraph Slice1["Slice 1 · VS Code surface"]
        CodeLens["BotEditCodeLensProvider<br>banner at line 0"]
        FileDeco["BotEditFileDecorationProvider<br>tab dot"]
  end
    SyncBot --> GitRepo
    TrailerImpl --> Detector & ParserFn
    GitRepo --> TrailerImpl
    Detector --> CodeLens & FileDeco

     GitRepo:::sourceStyle
     SyncBot:::sourceStyle
     Detector:::slice0Style
     TrailerImpl:::slice0Style
     ParserFn:::slice0Style
     CodeLens:::slice1Style
     FileDeco:::slice1Style
    classDef sourceStyle stroke:#818cf8,fill:#eef2ff,color:#1e1b4b
    classDef slice0Style stroke:#2dd4bf,fill:#f0fdfa,color:#1e1b4b
    classDef slice1Style stroke:#a78bfa,fill:#f5f3ff,color:#1e1b4b
    style Slice0 fill:transparent,stroke:#d9d9d9
    style Source fill:transparent,stroke:#d9d9d9
    style Slice1 fill:transparent,stroke:#d9d9d9
`;

/**
 * Head of the PR — adds Slice 2 (active review) + Audit log.
 * New nodes get the review green outline via ADDED_NODE_IDS.
 */
export const GITHUB_REVIEW_DIAGRAM = `${FRONTMATTER}
flowchart LR
 subgraph Source["Source of truth"]
        GitRepo["Git repo<br>commit history"]
        SyncBot["Mermaid Sync<br>GitHub App"]
  end
 subgraph Slice0["Slice 0 · Detection"]
        Detector["BotEditDetector<br>interface"]
        TrailerImpl["GitTrailerDetector<br>reads commit trailer"]
        ParserFn["parseBotEditInfo<br>pure helper"]
  end
 subgraph Slice1["Slice 1 · VS Code surface"]
        CodeLens["BotEditCodeLensProvider<br>banner at line 0"]
        FileDeco["BotEditFileDecorationProvider<br>tab dot"]
  end
 subgraph Slice2["Slice 2 · Active review"]
        OpenReview["openReview<br>orchestrator"]
        ContentProvider["BotEditContentProvider<br>parent commit blob"]
        NodeDiff["diagramNodeDiff<br>added vs removed ids"]
        DiffView["openDiagramDiffWebviews<br>3-pane layout"]
        Actions["reviewActions<br>Accept Reject Edit"]
  end
    SyncBot --> GitRepo
    TrailerImpl --> Detector & ParserFn
    GitRepo --> TrailerImpl
    Detector --> CodeLens & FileDeco
    CodeLens --> OpenReview
    OpenReview --> ContentProvider & NodeDiff & DiffView & Actions
    Actions --> GitRepo & AuditLog["Audit log"]

${CLASS_DEFS}
`;

export type GithubReviewContext = {
  owner: string;
  repo: string;
  pr: string;
  file: string;
};

export function parseGithubReviewParams(params: URLSearchParams): GithubReviewContext | null {
  if (params.get('review') !== '1' && params.get('review') !== 'true') return null;
  return {
    owner: params.get('owner') || 'rubenmango',
    repo: params.get('repo') || 'mermaid-bot-sandbox',
    // Demo default; remap historic ?pr=1 bookmarks to #356.
    pr: (() => {
      const raw = params.get('pr') || '356';
      return raw === '1' ? '356' : raw;
    })(),
    file: params.get('file') || 'pr-review-architecture.mmd',
  };
}
