import React, { useState } from 'react';
import { portfolioConfig } from '../portfolio.config';
import { Menu, X, Github, Linkedin, ArrowUpRight } from 'lucide-react';

export default function Navbar({ isLive, lastSync, onOpenAdmin, personal = portfolioConfig.personal }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  // Triple clic en el logo para abrir el panel secreto
  const handleLogoClick = () => {
    const next = logoClicks + 1;
    if (next >= 3) {
      setLogoClicks(0);
      onOpenAdmin();
    } else {
      setLogoClicks(next);
      setTimeout(() => setLogoClicks(0), 1200);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer group select-none"
          title={personal.name}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-mono font-black text-white text-lg shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            WF
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-base tracking-tight group-hover:text-cyan-400 transition-colors">
              {personal.shortName || personal.name}
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
              <span className="text-[11px] font-mono text-slate-400">
                {isLive ? `GitHub Live · ${lastSync || 'Sincronizado'}` : 'Full Stack Developer'}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#inicio" className="hover:text-cyan-400 transition-colors">Inicio</a>
          <a href="#sobre-mi" className="hover:text-cyan-400 transition-colors">Sobre Mí</a>
          <a href="#habilidades" className="hover:text-cyan-400 transition-colors">Habilidades</a>
          <a href="#proyectos" className="hover:text-cyan-400 transition-colors">Proyectos</a>
          <a href="#trayectoria" className="hover:text-cyan-400 transition-colors">Trayectoria</a>
          <a href="#contacto" className="hover:text-cyan-400 transition-colors">Contacto</a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <a 
            href={personal.githubUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a 
            href={personal.linkedinUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-500/50 transition-all"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          <a href="#contacto" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all">
            <span>Hablemos</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-xl border-b border-slate-800 px-6 py-6 transition-all">
          <div className="flex flex-col gap-4">
            <a href="#inicio" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-slate-200 hover:text-cyan-400">Inicio</a>
            <a href="#sobre-mi" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-slate-200 hover:text-cyan-400">Sobre Mí</a>
            <a href="#habilidades" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-slate-200 hover:text-cyan-400">Habilidades</a>
            <a href="#proyectos" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-slate-200 hover:text-cyan-400">Proyectos</a>
            <a href="#trayectoria" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-slate-200 hover:text-cyan-400">Trayectoria</a>
            <a href="#contacto" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-slate-200 hover:text-cyan-400">Contacto</a>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex gap-2">
                <a href={personal.githubUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg text-slate-300">
                  <Github className="w-4 h-4" />
                </a>
                <a href={personal.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg text-slate-300">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
              <a href="#contacto" onClick={() => setMobileOpen(false)} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold">
                Contactar
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
