import siteConfig from '../site.config.json';
import { repositoryUrl } from './repository-url.mjs';

const configuredUrl = process.env.NEXT_PUBLIC_GITHUB_URL?.trim() || siteConfig.githubUrl;

export const site = {
  name: 'DevThread',
  description: 'DevThread helps coding agents keep repository context, compare plans with code evidence, and explain the next useful task.',
  githubUrl: repositoryUrl(configuredUrl),
};
