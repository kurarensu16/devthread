import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { site } from '@/lib/site';
import { Brand } from '@/components/brand';

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayout tree={source.getPageTree()} nav={{ title: <Brand />, url: '/' }} githubUrl={site.githubUrl} searchToggle={{ enabled: false }} sidebar={{ defaultOpenLevel: 2 }} links={[{ text: 'Home', url: '/' }]}>{children}</DocsLayout>;
}
