const API_BASE = process.env.TOURNAX_API_URL?.replace(/\/$/, '') ?? 'http://localhost:8080';
const CURRENT_SEASON = 3;

export type MatchHighlightItem = {
  matchId: string;
  matchday: number;
  stage: string;
  homeName: string;
  awayName: string;
  homeGoals: number | null;
  awayGoals: number | null;
  videoUrls: string[];
};

export function matchHighlightLabel(item: MatchHighlightItem): string {
  const md = `MD ${item.matchday}`;
  if (item.stage && item.stage !== 'league') {
  const stageLabel =
      item.stage === 'quarter_final'
        ? 'Quarter-final'
        : item.stage === 'semi_final'
          ? 'Semi-final'
          : item.stage === 'final'
            ? 'Final'
            : item.stage;
    return `${md} · ${stageLabel}`;
  }
  return `${md} · League`;
}

export function matchHighlightTitle(item: MatchHighlightItem): string {
  return `${item.homeName} vs ${item.awayName}`;
}

export function matchHighlightDescription(item: MatchHighlightItem): string {
  if (item.homeGoals != null && item.awayGoals != null) {
    return `Final score ${item.homeGoals}–${item.awayGoals}.`;
  }
  return 'Season highlight clip.';
}

export async function fetchMatchHighlights(season = CURRENT_SEASON): Promise<MatchHighlightItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/seasons/${season}/highlights`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return (await res.json()) as MatchHighlightItem[];
  } catch {
    return [];
  }
}