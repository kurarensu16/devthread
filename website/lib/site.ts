import siteConfig from '../site.config.json';
import { repositoryUrl } from './repository-url.mjs';

const configuredUrl = process.env.NEXT_PUBLIC_GITHUB_URL?.trim() || siteConfig.githubUrl;

export const site = {
  name: 'DevThread',
  description: 'Know what’s built. See what’s next. Keep AI development on track.',
  githubUrl: repositoryUrl(configuredUrl),
};
