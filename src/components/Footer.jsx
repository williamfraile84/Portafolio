import React from 'react';
import { portfolioConfig } from '../portfolio.config';
import { Lock } from 'lucide-react';

export default function Footer({ onOpenAdmin, personal = portfolioConfig.personal }) {
  return (
    <footer className="border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500 bg-slate-950">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} {personal.name}. Desarrollado con React 19 & Tailwind CSS.</span>
          <button
            onClick={onOpenAdmin}
            className="p-1 text-slate-700 hover:text-cyan-400 transition-colors"
            title="Configuración"
            aria-label="Configuración"
          >
            <Lock className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <a href="#inicio" className="hover:text-cyan-400 transition-colors">Volver arriba ↑</a>
          <a href={personal.githubUrl} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">GitHub Profile</a>
        </div>
      </div>
    </footer>
  );
}
