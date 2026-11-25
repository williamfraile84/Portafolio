import React from 'react';
import { portfolioConfig } from '../portfolio.config';
import { ArrowDown, Mail, Download, Sparkles, Shield, Cpu, Layers } from 'lucide-react';

export default function Hero() {
  const { personal } = portfolioConfig;

  return (
    <section id="inicio" className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs sm:text-sm font-medium mb-6 shadow-lg backdrop-blur-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Disponible para Nuevas Oportunidades (Remoto / Presencial / Híbrido)</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Construyendo Software <br className="hidden sm:inline" />
          <span className="gradient-text">Robusto, Seguro y Escalable</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-slate-300 font-medium mb-4 flex items-center justify-center gap-2 flex-wrap">
          <span>Hola, soy</span>
          <span className="text-white font-bold underline decoration-cyan-500 decoration-2 underline-offset-4">
            {personal.name}
          </span>
        </p>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
          Ingeniero de Sistemas egresado de la <strong className="text-slate-200">Universidad de los Llanos</strong> con formación práctica en el <strong className="text-slate-200">SENA</strong>. Especializado en desarrollo <strong className="text-cyan-400">Full Stack (React 19 & FastAPI)</strong> con un enfoque diferencial en <strong className="text-blue-400">auditoría pericial forense y ciberseguridad (OWASP Top 10)</strong>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <a href="#proyectos" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all">
            <span>Explorar Proyectos</span>
            <ArrowDown className="w-4 h-4" />
          </a>
          <a href="#contacto" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 font-semibold text-sm hover:border-cyan-500/50 hover:text-white transition-all">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Contactar Directo</span>
          </a>
          <a href={personal.resumeEsUrl} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 font-semibold text-sm hover:border-emerald-500/50 hover:text-white transition-all">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Descargar CV (DOCX)</span>
          </a>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-8 border-t border-slate-800/80">
          <div className="glass-panel rounded-2xl p-4 text-center">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-400 mb-1">React 19 + FastAPI</div>
            <div className="text-xs text-slate-400">Full Stack Desacoplado</div>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-blue-400 mb-1">DevSecOps</div>
            <div className="text-xs text-slate-400">OWASP Top 10 + Auditoría</div>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 mb-1">110+ Tests</div>
            <div className="text-xs text-slate-400">Pytest & Playwright Passing</div>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-400 mb-1">Inglés B2</div>
            <div className="text-xs text-slate-400">Fluidez Técnica & Remota</div>
          </div>
        </div>

      </div>
    </section>
  );
}
