/**
 * @param {string | undefined} value
 * @returns {string | undefined}
 */
export function repositoryUrl(value) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' ||
        !/^\/[^/]+\/[^/]+\/?$/.test(url.pathname) || url.search || url.hash) {
      throw new Error('Expected https://github.com/owner/repository');
    }
    return url.href.replace(/\/$/, '');
  } catch {
    throw new Error('GitHub repository URL must use https://github.com/owner/repository.');
  }
}
