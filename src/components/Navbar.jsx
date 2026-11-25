import React, { useState, useEffect } from 'react';
import { portfolioConfig } from '../portfolio.config';
import { Menu, X, Download, Github, Linkedin, ArrowUpRight, ChevronDown } from 'lucide-react';

export default function Navbar({ isLive, lastSync, onOpenAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cvDropdown, setCvDropdown] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Triple clic secreto en el logo
  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const next = prev + 1;
      if (next >= 3) {
        onOpenAdmin();
        return 0;
      }
      return next;
    });
    setTimeout(() => setLogoClicks(0), 1000);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl shadow-black/50' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2 group cursor-pointer" onClick={handleLogoClick} title="William Fraile">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-mono font-bold text-lg shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform select-none">
            WF
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              {portfolioConfig.personal.shortName}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400/90">
              <span>Full Stack & Security</span>
              {isLive && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/50" title={`Sincronizado con GitHub API: ${lastSync}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live API
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800/80 shadow-xl shadow-black/40">
          <a href="#inicio" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-800/60 transition-colors">Inicio</a>
          <a href="#sobre-mi" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-800/60 transition-colors">Sobre Mí</a>
          <a href="#habilidades" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-800/60 transition-colors">Habilidades</a>
          <a href="#proyectos" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-800/60 transition-colors">Proyectos</a>
          <a href="#trayectoria" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-800/60 transition-colors">Trayectoria</a>
          <a href="#contacto" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-800/60 transition-colors">Contacto</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a href={portfolioConfig.personal.githubUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
            <Github className="w-4 h-4" />
          </a>
          <a href={portfolioConfig.personal.linkedinUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-500/50 transition-all">
            <Linkedin className="w-4 h-4" />
          </a>

          {/* CV Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCvDropdown(!cvDropdown)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>CV</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {cvDropdown && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-left"
                onMouseLeave={() => setCvDropdown(false)}
              >
                <a href={portfolioConfig.personal.resumeEsUrl} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-xs font-bold text-white">CV Español (DOCX)</div>
                    <div className="text-[10px] text-slate-400">Colombia / LatAm</div>
                  </div>
                </a>
                <a href={portfolioConfig.personal.resumeEnUrl} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                  <Download className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Resume English (DOCX)</div>
                    <div className="text-[10px] text-slate-400">International / Remote</div>
                  </div>
                </a>
              </div>
            )}
          </div>

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
            <a href="#proyectos" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-slate-200 hover:text-cyan-400">Proyectos Destacados</a>
            <a href="#trayectoria" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-slate-200 hover:text-cyan-400">Trayectoria</a>
            <a href="#contacto" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-slate-200 hover:text-cyan-400">Contacto</a>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex gap-2">
                <a href={portfolioConfig.personal.githubUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg text-slate-300">
                  <Github className="w-4 h-4" />
                </a>
                <a href={portfolioConfig.personal.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg text-slate-300">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
              <a href={portfolioConfig.personal.resumeEsUrl} className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
                Descargar CV
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
