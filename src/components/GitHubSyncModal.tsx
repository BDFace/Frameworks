import React, { useState } from 'react';
import { X, Check, Github, Download, Save, ShieldCheck, AlertCircle } from 'lucide-react';
import {
  getGitHubConfig,
  saveGitHubConfig,
  getLocalSubscribers,
  downloadSubscribersCsv,
  GitHubSyncConfig
} from '../services/githubSubscribers';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const initialConfig = getGitHubConfig();
  const [owner, setOwner] = useState(initialConfig.owner);
  const [repo, setRepo] = useState(initialConfig.repo);
  const [token, setToken] = useState(initialConfig.token);
  const [filePath, setFilePath] = useState(initialConfig.filePath || 'subscribers.csv');
  const [savedToast, setSavedToast] = useState(false);

  const localSubscribers = getLocalSubscribers();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const config: GitHubSyncConfig = {
      owner: owner.trim(),
      repo: repo.trim(),
      token: token.trim(),
      filePath: filePath.trim() || 'subscribers.csv'
    };
    saveGitHubConfig(config);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 text-white shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-white" />
            <h3 className="font-serif text-xl text-white">GitHub Repository Sync</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 font-light mt-3 leading-relaxed">
          When visitors click <strong className="text-white">JOIN</strong> on the newsletter, their email address is automatically committed to a file in your GitHub repository where this website is hosted.
        </p>

        <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-zinc-300 uppercase tracking-wider mb-1">
              GitHub Username or Org
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g. benscott"
              className="w-full px-3 py-2.5 bg-black border border-zinc-700 text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-zinc-300 uppercase tracking-wider mb-1">
              Repository Name
            </label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="e.g. frameworks-art"
              className="w-full px-3 py-2.5 bg-black border border-zinc-700 text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-zinc-300 uppercase tracking-wider mb-1">
              Target File in Repo
            </label>
            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="subscribers.csv"
              className="w-full px-3 py-2.5 bg-black border border-zinc-700 text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-zinc-300 uppercase tracking-wider">
                GitHub Personal Access Token (PAT)
              </label>
              <span className="text-[10px] text-zinc-500">Optional / For direct repo writes</span>
            </div>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_... (Fine-grained or Classic PAT with Contents: Write)"
              className="w-full px-3 py-2.5 bg-black border border-zinc-700 text-white focus:outline-none focus:border-white font-mono text-xs"
            />
            <p className="text-[11px] text-zinc-500 font-sans mt-1">
              You can also set this via <code className="text-zinc-300 font-mono">VITE_GITHUB_TOKEN</code> in <code className="text-zinc-300 font-mono">.env</code>.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-white text-black font-sans uppercase text-xs tracking-wider font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedToast ? 'Settings Saved!' : 'Save Sync Settings'}</span>
            </button>

            <button
              type="button"
              onClick={downloadSubscribersCsv}
              className="py-2.5 px-4 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-xs uppercase tracking-wider font-sans transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download local subscribers as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV ({localSubscribers.length})</span>
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Local Backup Active</span>
          </div>
          <p className="leading-relaxed">
            Every submission is instantly stored locally in browser memory ({localSubscribers.length} collector{localSubscribers.length === 1 ? '' : 's'} recorded so far). When GitHub repo credentials are present, it commits directly to your GitHub repository file.
          </p>
        </div>
      </div>
    </div>
  );
};
