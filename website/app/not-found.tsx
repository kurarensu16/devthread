import Link from 'next/link';
import { Header } from '@/components/header';

export default function NotFound() {
  return <><Header /><main id="main-content" className="shell empty-page"><p className="eyebrow">404 / route not found</p><h1>This path ends here.</h1><p>Return to the map, or find what you need in the documentation.</p><Link className="button" href="/docs/">Open the docs →</Link></main></>;
}
