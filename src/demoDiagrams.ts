/**
 * Diagram sources shared by the fake GitHub PR page and the local review
 * editor fallback. Kept in sync with Unified-editor-Onboarding
 * `src/lib/review/githubReviewSeed.ts` (mermaid.ai a06aecfe).
 */

const FRONTMATTER = `---
config:
  layout: dagre
title: PR Review — Slices 0/1/2 architecture
---`;

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

/** Base on main — Source + Slice 0 + Slice 1. */
export const DEMO_DIAGRAM_BEFORE = `${FRONTMATTER}
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

/** PR head — adds Slice 2 + Audit log (+6 nodes). */
export const DEMO_DIAGRAM_AFTER = `${FRONTMATTER}
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

export const DEMO_DIAGRAM_FILE = "pr-review-architecture.mmd";
export const DEMO_DIAGRAM_SUMMARY = "+6 nodes";
export const DEMO_PR_TITLE = "Add Slice 2 active review";
