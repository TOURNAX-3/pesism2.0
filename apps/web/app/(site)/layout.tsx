import { Footer } from '@/components/footer';
import { FullscreenMenu } from '@/components/fullscreen-menu';
import { Header } from '@/components/header';
import { IconSprite } from '@/components/icon-sprite';
import { Loader } from '@/components/loader';
import { RegisterModal } from '@/components/register-modal';
import { LiveCompetitionRefresh } from '@/components/live-competition-refresh';
import { SiteInteractions } from '@/components/site-interactions';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <IconSprite />
      <Loader />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <FullscreenMenu />
      <RegisterModal />
      <SiteInteractions />
      <LiveCompetitionRefresh />
    </>
  );
}
