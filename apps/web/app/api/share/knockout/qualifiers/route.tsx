import { ImageResponse } from 'next/og';
import { loadShareFonts, loadTrophyDataUri } from '@/lib/share/assets';
import { PosterFrame, SubtitleLine, HomeAwayLegendLine, FixtureCard, POSTER_CONTENT_WIDTH } from '@/lib/share/components';
import { getQualifiersData } from '@/lib/share/data';

export const runtime = 'nodejs';

// Q1 = Group A 4th v Group B 5th, Q2 = Group B 4th v Group A 5th.
const TIE_TAGS: Array<{ home: string; away: string }> = [
  { home: 'GROUP A · 4TH', away: 'GROUP B · 5TH' },
  { home: 'GROUP B · 4TH', away: 'GROUP A · 5TH' },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const useSample = searchParams.get('sample') === '1';

  const data = await getQualifiersData(useSample);
  if (!data) return new Response('Not found', { status: 404 });

  const [fonts, trophy] = await Promise.all([loadShareFonts(), loadTrophyDataUri()]);
  // Tie card: padding 24, so 24px off each side of the poster's own content width.
  const cardWidthPx = POSTER_CONTENT_WIDTH - 24 * 2;

  return new ImageResponse(
    (
      <PosterFrame tag="KNOCKOUTS · MD10" trophyDataUri={trophy}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Furore', fontSize: 112, lineHeight: 0.9 }}>
            <span>THE</span>
            <span style={{ color: '#DED002' }}>QUALIFIERS</span>
          </div>
          <HomeAwayLegendLine />
          <SubtitleLine>Matchday 10 &middot; Two places left. Win or go home</SubtitleLine>
        </div>

        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
          {data.ties.map((tie, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 12,
                background: '#27092F',
                border: '1px solid rgba(243,240,234,0.12)',
                borderRadius: 24,
                padding: 24,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 3, color: '#9E84AE' }}>{tie.label}</span>
              <FixtureCard fixture={tie} cardWidthPx={cardWidthPx} vsSize={68} homeTag={TIE_TAGS[i]?.home} awayTag={TIE_TAGS[i]?.away} />
            </div>
          ))}
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
