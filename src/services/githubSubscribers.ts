/**
 * GitHub Repository Subscriber Sync Service
 * 
 * Automatically appends collector email signups to `subscribers.csv`
 * in the GitHub repository where the site is hosted.
 */

export interface GitHubSyncConfig {
  owner: string;
  repo: string;
  token: string;
  filePath?: string;
}

export interface SubscriberRecord {
  email: string;
  date: string;
  syncedToGithub: boolean;
}

const LOCAL_STORAGE_KEY = 'frameworks_subscribers';
const GITHUB_CONFIG_KEY = 'frameworks_github_config';

/**
 * Retrieve GitHub configuration from environment variables or local storage
 */
export function getGitHubConfig(): GitHubSyncConfig {
  let stored: Partial<GitHubSyncConfig> = {};
  try {
    const raw = localStorage.getItem(GITHUB_CONFIG_KEY);
    if (raw) stored = JSON.parse(raw);
  } catch {
    // ignore
  }

  const envOwner = (import.meta as any).env?.VITE_GITHUB_OWNER || '';
  const envRepo = (import.meta as any).env?.VITE_GITHUB_REPO || '';
  const envToken = (import.meta as any).env?.VITE_GITHUB_TOKEN || '';

  return {
    owner: stored.owner || envOwner,
    repo: stored.repo || envRepo,
    token: stored.token || envToken,
    filePath: stored.filePath || 'subscribers.csv'
  };
}

/**
 * Save user custom GitHub configuration
 */
export function saveGitHubConfig(config: GitHubSyncConfig): void {
  try {
    localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

/**
 * Get all local subscribers
 */
export function getLocalSubscribers(): SubscriberRecord[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Unicode-safe base64 helper
 */
function utf8ToBase64(str: string): string {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str: string): string {
  return decodeURIComponent(escape(window.atob(str.replace(/\s/g, ''))));
}

/**
 * Commit new subscriber directly to GitHub repo's subscribers.csv
 */
async function syncEmailToGitHub(
  email: string,
  config: GitHubSyncConfig,
  isoDate: string
): Promise<{ success: boolean; error?: string }> {
  const { owner, repo, token, filePath = 'subscribers.csv' } = config;
  if (!owner || !repo) {
    return { success: false, error: 'GitHub repository not configured' };
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };
  if (token) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  let sha: string | undefined;
  let currentCsv = 'Email,SubscribedAt,Status\n';

  try {
    // Check if the file currently exists
    const getRes = await fetch(url, { headers });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
      if (data.content) {
        currentCsv = base64ToUtf8(data.content);
        if (!currentCsv.endsWith('\n')) {
          currentCsv += '\n';
        }
      }
    } else if (getRes.status !== 404) {
      const errJson = await getRes.json().catch(() => ({}));
      return { success: false, error: errJson.message || `HTTP ${getRes.status}` };
    }

    // Append new subscriber row
    const newRow = `"${email}","${isoDate}","Active"\n`;
    const updatedContent = currentCsv + newRow;

    // Commit file update to GitHub repository
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Add subscriber: ${email}`,
        content: utf8ToBase64(updatedContent),
        sha: sha // required if updating existing file
      })
    });

    if (!putRes.ok) {
      const errJson = await putRes.json().catch(() => ({}));
      return { success: false, error: errJson.message || `HTTP ${putRes.status}` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network request failed' };
  }
}

/**
 * Main function called when a visitor clicks JOIN
 */
export async function addSubscriber(
  email: string
): Promise<{ success: boolean; syncedWithGithub: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const dateStr = new Date().toISOString();

  // 1. Save locally
  const currentList = getLocalSubscribers();
  const existing = currentList.find((s) => s.email.toLowerCase() === normalizedEmail);

  let syncedWithGithub = false;
  let githubError: string | undefined;

  // 2. Attempt GitHub commit
  const ghConfig = getGitHubConfig();
  if (ghConfig.owner && ghConfig.repo) {
    const ghRes = await syncEmailToGitHub(normalizedEmail, ghConfig, dateStr);
    if (ghRes.success) {
      syncedWithGithub = true;
    } else {
      githubError = ghRes.error;
    }
  }

  // 3. Update local list with sync status
  if (!existing) {
    currentList.push({
      email: normalizedEmail,
      date: dateStr,
      syncedToGithub: syncedWithGithub
    });
  } else if (syncedWithGithub && !existing.syncedToGithub) {
    existing.syncedToGithub = true;
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentList));
  } catch {
    // ignore
  }

  if (syncedWithGithub) {
    return {
      success: true,
      syncedWithGithub: true,
      message: `Added to private collector list and committed to ${ghConfig.owner}/${ghConfig.repo}/subscribers.csv on GitHub.`
    };
  }

  if (githubError) {
    return {
      success: true,
      syncedWithGithub: false,
      message: `Subscribed! (Saved locally; GitHub sync notice: ${githubError})`
    };
  }

  return {
    success: true,
    syncedWithGithub: false,
    message: `Subscribed! Your email has been added to the collector list.`
  };
}

/**
 * Trigger direct download of subscribers.csv from current records
 */
export function downloadSubscribersCsv(): void {
  const list = getLocalSubscribers();
  let csv = 'Email,SubscribedAt,Status\n';
  list.forEach((item) => {
    csv += `"${item.email}","${item.date}","Active"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'subscribers.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
