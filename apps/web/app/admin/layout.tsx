import type { Metadata } from 'next';
import '../globals.css';
import './admin.css';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: 'Admin · TOURNAX', template: '%s · TOURNAX Admin' },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
