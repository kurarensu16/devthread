import Link from 'next/link';
import { Brand } from './brand';
import { ThemeToggle } from './theme-toggle';
import { site } from '@/lib/site';

export function Header() {
  const links = <><Link href="/#how-it-works">How it works</Link><Link href="/#example">Example</Link><Link href="/docs/">Docs</Link>{site.githubUrl && <a href={site.githubUrl}>GitHub ↗</a>}</>;
  return <header className="site-header"><div className="shell header-inner"><Link href="/" aria-label="DevThread home"><Brand /></Link><nav className="desktop-nav" aria-label="Main navigation">{links}</nav><div className="header-actions"><ThemeToggle /><Link className="button button-small" href="/docs/installation/">Get started <span aria-hidden="true">↗</span></Link><details className="mobile-menu"><summary aria-label="Open navigation"><span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation">{links}</nav></details></div></div></header>;
}
