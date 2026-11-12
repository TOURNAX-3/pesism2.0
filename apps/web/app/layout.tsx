import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
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
        <Script id="js-gate" strategy="beforeInteractive">
          {"document.documentElement.classList.add('js')"}
        </Script>
        {children}
      </body>
    </html>
  );
}
