const API_BASE = process.env.TOURNAX_API_URL ?? 'http://localhost:8080';
const CURRENT_SEASON = 3;
const IST = 'Asia/Kolkata';

export type RegistrationWindow = {
  open: boolean;
  opensAt: string | null;
  closesAt: string | null;
  maxPlayers: number | null;
  registeredCount: number;
  reason: string | null;
};

export async function fetchRegistrationWindow(season = CURRENT_SEASON): Promise<RegistrationWindow | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/seasons/${season}/registration`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      open: boolean;
      opensAt?: string | null;
      closesAt?: string | null;
      maxPlayers?: number | null;
      registeredCount?: number;
      reason?: string | null;
    };
    return {
      open: data.open,
      opensAt: data.opensAt ?? null,
      closesAt: data.closesAt ?? null,
      maxPlayers: data.maxPlayers ?? null,
      registeredCount: data.registeredCount ?? 0,
      reason: data.reason ?? null,
    };
  } catch {
    return null;
  }
}

export function spotsLeft(window: RegistrationWindow | null): number | null {
  if (window == null || window.maxPlayers == null) return null;
  return Math.max(0, window.maxPlayers - window.registeredCount);
}

/** Hero / chips — urgency when the squad is nearly full. */
export function spotsLabel(window: RegistrationWindow | null): string | null {
  const left = spotsLeft(window);
  if (left == null) return null;
  if (left === 0) return 'Slots full';
  if (left <= 6) return 'Few slots left';
  return `${left} spots left`;
}

function formatIst(iso: string, withTime: boolean) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST,
    weekday: withTime ? 'short' : undefined,
    day: 'numeric',
    month: 'short',
    ...(withTime
      ? { hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'shortGeneric' }
      : {}),
  }).format(new Date(iso));
}

export function registrationWindowSummary(window: RegistrationWindow | null): string | null {
  if (!window?.closesAt) return null;
  const close = formatIst(window.closesAt, true);
  if (!window.open && window.opensAt) {
    const open = formatIst(window.opensAt, true);
    return `Opens ${open} · closes ${close}`;
  }
  return `Closes ${close}`;
}

export function registrationModalHint(window: RegistrationWindow | null): string {
  if (!window) {
    return 'Registration details load from the tournament server. If sign-up fails, try again in a moment.';
  }
  const left = spotsLeft(window);
  const schedule = registrationWindowSummary(window);
  if (window.open) {
    const slots = left != null && left > 0 ? (left <= 6 ? 'Few slots left.' : `${left} spots left.`) : '';
    return [slots, schedule, 'League fixtures are built from the final approved squad.'].filter(Boolean).join(' ');
  }
  if (window.reason?.includes('not opened')) {
    return window.opensAt
      ? `Registration opens ${formatIst(window.opensAt, true)}. ${schedule ?? ''}`.trim()
      : 'Registration has not opened yet.';
  }
  if (window.reason?.includes('closed') || window.closesAt) {
    return schedule ? `Registration is closed. Window was: ${schedule}` : 'Registration is closed for now.';
  }
  return window.reason ?? 'Registration is not open.';
}
