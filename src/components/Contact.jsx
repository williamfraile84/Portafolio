import React, { useState } from 'react';
import { portfolioConfig } from '../portfolio.config';
import { Mail, MessageCircle, Linkedin, Github, Copy, Check } from 'lucide-react';

export default function Contact({ personal = portfolioConfig.personal }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (personal.email) {
      navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Normalizar URL de WhatsApp si solo se suministra el número
  const whatsappHref = personal.whatsappUrl || 
    (personal.phone ? `https://wa.me/${personal.phone.replace(/\D/g, '')}` : 'https://wa.me/573143839318');

  // Formato visual para mostrar links limpios
  const linkedinDisplay = personal.linkedinUrl ? personal.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '') : 'linkedin.com/in/wyfb';
  const githubDisplay = personal.githubUrl ? personal.githubUrl.replace(/^https?:\/\/(www\.)?/, '') : 'github.com/williamfraile84';

  return (
    <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/80">
      <div className="max-w-4xl mx-auto text-center">
        
        <span className="inline-block text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full mb-3">
          Contacto Directo
        </span>
        
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
          ¿Listo para Impulsar tu Equipo?
        </h2>
        
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          Estoy disponible para vincularme de inmediato a proyectos de desarrollo <strong className="text-cyan-400">Full Stack</strong>, <strong className="text-blue-400">Backend con Python/FastAPI</strong>, <strong className="text-emerald-400">Frontend con React</strong> o roles de <strong className="text-indigo-400">Auditoría / QA</strong>, ya sea de forma remota, híbrida o presencial.
        </p>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          
          {/* Email */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col items-center text-center group relative">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div className="text-xs text-slate-400 mb-1">Correo Electrónico</div>
            <a href={`mailto:${personal.email}`} className="text-xs font-bold text-white hover:text-cyan-400 truncate max-w-full mb-2">
              {personal.email}
            </a>
            <button
              onClick={handleCopyEmail}
              className="mt-auto inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "¡Copiado!" : "Copiar"}</span>
            </button>
          </div>

          {/* WhatsApp */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="glass-panel rounded-2xl p-5 flex flex-col items-center text-center group hover:border-emerald-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="text-xs text-slate-400 mb-1">WhatsApp / Celular</div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">
              {personal.phone}
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href={personal.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="glass-panel rounded-2xl p-5 flex flex-col items-center text-center group hover:border-blue-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Linkedin className="w-6 h-6" />
            </div>
            <div className="text-xs text-slate-400 mb-1">Perfil Profesional</div>
            <div className="text-xs font-bold text-white group-hover:text-blue-400 truncate max-w-full">
              {linkedinDisplay}
            </div>
          </a>

          {/* GitHub */}
          <a
            href={personal.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="glass-panel rounded-2xl p-5 flex flex-col items-center text-center group hover:border-purple-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Github className="w-6 h-6" />
            </div>
            <div className="text-xs text-slate-400 mb-1">Código & Repositorios</div>
            <div className="text-xs font-bold text-white group-hover:text-purple-400 truncate max-w-full">
              {githubDisplay}
            </div>
          </a>

        </div>

      </div>
    </section>
  );
}
