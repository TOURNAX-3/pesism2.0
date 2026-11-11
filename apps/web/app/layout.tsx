import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import { Footer } from '@/components/footer';
import { FullscreenMenu } from '@/components/fullscreen-menu';
import { Header } from '@/components/header';
import { IconSprite } from '@/components/icon-sprite';
import { Loader } from '@/components/loader';
import { RegisterModal } from '@/components/register-modal';
import { SiteInteractions } from '@/components/site-interactions';
import './globals.css';

const onest = Onest({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-onest' });
const furore = localFont({
  src: './fonts/furore/Furore.otf',
  weight: '400',
  style: 'normal',
  variable: '--font-furore',
});

export const metadata: Metadata = {
  title: 'TOURNAX Season 3 · eFootball Tournament',
  description: "Find out who's actually good at eFootball and who's just good at talking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${onest.variable} ${furore.variable}`} suppressHydrationWarning>
      <body>
        {/* Content is visible by default (no-JS and reduced-motion both just work);
            this flips the one-time reveal/split-line/word-in states on only once
            JS is actually running, before first paint. */}
        <Script id="js-gate" strategy="beforeInteractive">
          {"document.documentElement.classList.add('js')"}
        </Script>
        <a className="skip-link" href="#main">Skip to content</a>
        <IconSprite />
        <Loader />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FullscreenMenu />
        <RegisterModal />
        <SiteInteractions />
      </body>
    </html>
  );
}
