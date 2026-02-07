/**
 * URL parameter utilities for landing page mode switching and secret parameters
 * (non-router based, using hash or query params)
 */

export function setAppMode(mode: 'landing' | 'app') {
  const url = new URL(window.location.href);
  if (mode === 'app') {
    url.hash = '#app';
  } else {
    url.hash = '';
  }
  window.history.pushState({}, '', url.toString());
}

export function getAppMode(): 'landing' | 'app' {
  const hash = window.location.hash;
  return hash === '#app' ? 'app' : 'landing';
}

export function listenToModeChanges(callback: (mode: 'landing' | 'app') => void) {
  const handler = () => {
    callback(getAppMode());
  };
  window.addEventListener('hashchange', handler);
  return () => window.removeEventListener('hashchange', handler);
}

/**
 * Get a secret parameter from URL query string
 * Used for admin token initialization
 */
export function getSecretParameter(key: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}
