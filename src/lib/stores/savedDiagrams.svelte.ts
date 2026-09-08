/**
 * Saved diagrams for the dashboard ⇄ editor round-trip.
 *
 * The editor auto-saves the current diagram (its mermaid code + name) into a
 * small localStorage list whenever the user navigates back to the dashboard.
 * The dashboard lists them as "Continue from here" cards; clicking one re-opens
 * that session in the editor (`?open=<id>`).
 *
 * Everything here is scoped to the signed-in session: `clearDiagrams()` runs on
 * sign-out so a fresh user starts with an empty dashboard.
 */

const STORAGE_KEY = 'mc-unified-editor-diagrams-v2';
/** Prior key — dropped so stale duplicate review cards don't linger. */
const LEGACY_STORAGE_KEYS = ['mc-unified-editor-diagrams-v1'] as const;

/** PR link status on a saved diagram (drives editor + dashboard pills). */
export type LinkedRepoStatus = 'open' | 'merged';

/** Set when the diagram came from / is linked to a GitHub PR. */
export type LinkedRepo = {
	owner: string;
	repo: string;
	pr: string;
	/** open = in review / pushed PR (green); merged = purple merge pill. */
	status?: LinkedRepoStatus;
};

export type SavedDiagram = {
	id: string;
	name: string;
	/** Full mermaid source (theme/look/layout config lives inline in the code). */
	code: string;
	/** Folder breadcrumb shown on the card (cosmetic). */
	path: string;
	/** Thumbnail image src. */
	thumb: string;
	updatedAt: number;
	/** Present when this diagram is linked to a GitHub PR / repo. */
	linkedRepo?: LinkedRepo;
};

function purgeLegacyKeys() {
	if (typeof localStorage === 'undefined') return;
	for (const key of LEGACY_STORAGE_KEYS) {
		try {
			localStorage.removeItem(key);
		} catch {
			/* ignore */
		}
	}
}

function load(): SavedDiagram[] {
	if (typeof localStorage === 'undefined') return [];
	purgeLegacyKeys();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as SavedDiagram[]) : [];
	} catch {
		return [];
	}
}

function sameLinkedRepo(a?: LinkedRepo, b?: LinkedRepo): boolean {
	if (!a || !b) return false;
	return a.owner === b.owner && a.repo === b.repo && a.pr === b.pr;
}

/** Prefer an existing card for the same GitHub PR so review re-entry doesn't stack duplicates. */
function findByLinkedRepo(linked?: LinkedRepo | null): SavedDiagram | undefined {
	if (!linked) return undefined;
	return savedDiagrams.list.find((d) => sameLinkedRepo(d.linkedRepo, linked));
}

function persist(list: SavedDiagram[]) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
	} catch {
		/* quota / private mode — non-fatal */
	}
}

/** Reactive store: the saved list + the id of the diagram open in the editor. */
export const savedDiagrams = $state<{ list: SavedDiagram[]; activeId: string | null }>({
	list: load(),
	activeId: null
});

/** Most-recently-updated first. */
export function listDiagrams(): SavedDiagram[] {
	return [...savedDiagrams.list].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getDiagram(id: string): SavedDiagram | undefined {
	return savedDiagrams.list.find((d) => d.id === id);
}

/**
 * Upsert a diagram. Pass `id` to update an existing entry (keeps its place),
 * omit it to create a new one. Returns the entry id.
 */
export function saveDiagram(entry: {
	id?: string | null;
	name: string;
	code: string;
	path?: string;
	thumb: string;
	linkedRepo?: LinkedRepo | null;
}): string {
	const linkedCandidate =
		entry.linkedRepo === null ? undefined : (entry.linkedRepo ?? undefined);
	const existing =
		(entry.id ? savedDiagrams.list.find((d) => d.id === entry.id) : undefined) ??
		findByLinkedRepo(linkedCandidate);
	const id = existing?.id ?? `dg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
	const linkedRepo =
		entry.linkedRepo === null
			? undefined
			: (entry.linkedRepo ?? existing?.linkedRepo);
	const next: SavedDiagram = {
		id,
		name: entry.name.trim() || 'Untitled',
		code: entry.code,
		path: entry.path ?? existing?.path ?? 'Personal files',
		thumb: entry.thumb,
		updatedAt: Date.now(),
		...(linkedRepo ? { linkedRepo } : {})
	};
	savedDiagrams.list = [next, ...savedDiagrams.list.filter((d) => d.id !== id)];
	savedDiagrams.activeId = id;
	persist(savedDiagrams.list);
	return id;
}

export function setActiveDiagram(id: string | null) {
	savedDiagrams.activeId = id;
}

/** Refresh only the card thumbnail (e.g. after a better SVG capture). */
export function updateDiagramThumb(id: string, thumb: string) {
	const existing = savedDiagrams.list.find((d) => d.id === id);
	if (!existing || existing.thumb === thumb) return;
	savedDiagrams.list = savedDiagrams.list.map((d) =>
		d.id === id ? { ...d, thumb, updatedAt: Date.now() } : d,
	);
	persist(savedDiagrams.list);
}

export function removeDiagram(id: string) {
	savedDiagrams.list = savedDiagrams.list.filter((d) => d.id !== id);
	if (savedDiagrams.activeId === id) savedDiagrams.activeId = null;
	persist(savedDiagrams.list);
}

/** Wipe everything — called on sign-out. */
export function clearDiagrams() {
	savedDiagrams.list = [];
	savedDiagrams.activeId = null;
	purgeLegacyKeys();
	persist([]);
	if (typeof localStorage !== 'undefined') {
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch {
			/* ignore */
		}
	}
}
