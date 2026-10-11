import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'DevThread — know what’s built, see what’s next', template: '%s · DevThread' },
  description: site.description,
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" suppressHydrationWarning><body><RootProvider search={{ enabled: false }}><a className="skip-link" href="#main-content">Skip to content</a>{children}</RootProvider></body></html>;
}
