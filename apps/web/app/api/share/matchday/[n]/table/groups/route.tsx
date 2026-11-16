import { ImageResponse } from 'next/og';
import { loadShareFonts } from '@/lib/share/assets';
import { PosterFrame, SubtitleLine, TableHeaderRow, TableRow, CutLine, POSTER_CONTENT_WIDTH } from '@/lib/share/components';
import { getGroupTablesData } from '@/lib/share/data';
import type { TableRowData } from '@/lib/share/types';

export const runtime = 'nodejs';

// Card: padding 24 horizontal; each row: padding 8 horizontal (same as the single-table poster).
const ROW_WIDTH_PX = POSTER_CONTENT_WIDTH - 24 * 2 - 8 * 2;

function GroupCard({ letter, rows }: { letter: 'A' | 'B'; rows: TableRowData[] }) {
  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
        background: '#27092F',
        border: '1px solid rgba(243,240,234,0.12)',
        borderRadius: 24,
        padding: '8px 24px 10px',
      }}
    >
      <span style={{ fontFamily: 'Furore', fontSize: 24, padding: '4px 8px 0' }}>
        GROUP <span style={{ color: '#DED002' }}>{letter}</span>
      </span>
      <TableHeaderRow dense />
      {rows.map((row) => (
        <div key={row.pos} style={{ display: 'flex', flexDirection: 'column' }}>
          {row.pos === 4 ? <CutLine label="QUARTER-FINALS" small solid /> : null}
          {row.pos === 6 ? <CutLine label="QUALIFIERS" small color="#E0689F" /> : null}
          <TableRow row={row} dense rowWidthPx={ROW_WIDTH_PX} />
        </div>
      ))}
    </div>
  );
}

export async function GET(req: Request, { params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const matchday = Number(n);
  const { searchParams } = new URL(req.url);
  const useSample = searchParams.get('sample') === '1';
  if (!Number.isFinite(matchday) || matchday < 1) {
    return new Response('Not found', { status: 404 });
  }

  const data = await getGroupTablesData(matchday, useSample);
  if (!data) return new Response('Not found', { status: 404 });

  const fonts = await loadShareFonts();
  const mdStr = String(data.matchday).padStart(2, '0');

  return new ImageResponse(
    (
      // No trophy watermark here — it collides with this poster's single-line title, unlike
      // every other poster's two-line title where PosterFrame's trophy position was tuned to sit.
      <PosterFrame tag={`MATCHDAY ${mdStr} · DONE`}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 20, fontFamily: 'Furore', fontSize: 96, lineHeight: 0.9 }}>
            <span>THE</span>
            <span style={{ color: '#DED002' }}>TABLES</span>
          </div>
          <SubtitleLine>After matchday {mdStr} &middot; Group A &amp; Group B</SubtitleLine>
        </div>

        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <GroupCard letter="A" rows={data.groupA} />
          <GroupCard letter="B" rows={data.groupB} />
        </div>
      </PosterFrame>
    ),
    {
      width: 1080,
      height: 1350,
      fonts,
      headers: {
        'Cache-Control': searchParams.has('v') ? 'public, s-maxage=31536000, immutable' : 'public, s-maxage=60',
      },
    },
  );
}
