import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('players').select('id', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      return NextResponse.json({ ok: false, error: error.message }, { status: 503 });
    }
    return NextResponse.json({ ok: true, supabase: 'reachable' });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Supabase not configured';
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}
