import React from 'react';
import { Github, Star, GitFork, ExternalLink, Calendar, Sparkles } from 'lucide-react';

export default function LiveRepoCard({ repo }) {
  const formattedDate = repo.updatedAt
    ? new Date(repo.updatedAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <article className="glass-panel rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/40 hover:-translate-y-1 transition-all">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 font-mono text-xs text-cyan-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold uppercase tracking-wider">GitHub Sync Live</span>
          </div>
          {repo.language && (
            <span className="font-mono text-[10px] bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-full">
              {repo.language}
            </span>
          )}
        </div>

        <h4 className="text-lg font-bold text-white mb-2 hover:text-cyan-400 transition-colors">
          <a href={repo.htmlUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
            <span>{repo.name}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-50" />
          </a>
        </h4>

        <p className="text-slate-300 text-xs leading-relaxed mb-4 line-clamp-3">
          {repo.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          {repo.stars !== undefined && (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>{repo.stars}</span>
            </span>
          )}
          {repo.forks !== undefined && (
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-slate-400" />
              <span>{repo.forks}</span>
            </span>
          )}
        </div>

        {formattedDate && (
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </span>
        )}
      </div>
    </article>
  );
}
