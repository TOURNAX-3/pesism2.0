import { NextResponse } from 'next/server';

const API_BASE = process.env.TOURNAX_API_URL ?? 'http://localhost:8080';
const SEASON = 3;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE}/api/v1/seasons/${SEASON}/grievances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        typeof data.message === 'string'
          ? data.message
          : typeof data.detail === 'string'
            ? data.detail
            : data.code === 'bad_request' && typeof data.message === 'string'
              ? data.message
              : 'Could not submit grievance.';
      return NextResponse.json({ message }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Could not reach the tournament server.' }, { status: 503 });
  }
}
