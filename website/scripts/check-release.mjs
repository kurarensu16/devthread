import { existsSync, readFileSync } from 'node:fs';
import { repositoryUrl } from '../lib/repository-url.mjs';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const config = JSON.parse(readFileSync(new URL('../site.config.json', import.meta.url), 'utf8'));
try {
  const url = repositoryUrl(process.env.NEXT_PUBLIC_GITHUB_URL?.trim() || config.githubUrl);
  if (!url) throw new Error('Configure githubUrl in site.config.json or NEXT_PUBLIC_GITHUB_URL.');
  console.log(`GitHub URL configured: ${url}. Confirm repository contents and complete release review before publishing.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
