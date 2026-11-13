import { NextResponse } from 'next/server';
import { registrationClientHeaders } from '@/lib/registration-client-headers';

const API_BASE = process.env.TOURNAX_API_URL ?? 'http://localhost:8080';
const SEASON = 3;

export async function POST(request: Request) {
  let body: { playerId?: string; code?: string; resend?: boolean };
  try {
    body = (await request.json()) as { playerId?: string; code?: string; resend?: boolean };
  } catch {
    return NextResponse.json({ code: 'bad_request', message: 'Invalid JSON' }, { status: 400 });
  }

  const playerId = body.playerId?.trim();
  if (!playerId) {
    return NextResponse.json({ code: 'bad_request', message: 'Missing playerId' }, { status: 400 });
  }

  const headers = {
    'Content-Type': 'application/json',
    ...registrationClientHeaders(request),
  };

  if (body.resend) {
    const res = await fetch(
      `${API_BASE}/api/v1/seasons/${SEASON}/registration/${playerId}/verify/resend`,
      { method: 'POST', headers },
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }
    return new NextResponse(null, { status: 204 });
  }

  const code = body.code?.trim();
  if (!code || !/^\d{4}$/.test(code)) {
    return NextResponse.json({ code: 'bad_request', message: 'Enter the 4-digit code.' }, { status: 400 });
  }

  const res = await fetch(`${API_BASE}/api/v1/seasons/${SEASON}/registration/${playerId}/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ code }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }
  return NextResponse.json(data);
}
