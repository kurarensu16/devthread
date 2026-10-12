import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

// Export the public documentation index at build time; queries run in the browser.
export const dynamic = 'force-static';
export const revalidate = false;
export const { staticGET: GET } = createFromSource(source);
