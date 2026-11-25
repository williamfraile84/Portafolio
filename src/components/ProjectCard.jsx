import React from 'react';
import { Eye, Github, ExternalLink, Maximize2, Cpu } from 'lucide-react';

export default function ProjectCard({ project, onOpenGallery }) {
  return (
    <article className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/60">
      
      {/* Thumbnail Header */}
      <div 
        className="relative w-full h-56 bg-slate-950 overflow-hidden cursor-pointer group"
        onClick={() => onOpenGallery(project)}
      >
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 text-cyan-300 text-xs font-semibold shadow-xl border border-slate-700">
            <Eye className="w-4 h-4" />
            <span>Ver Galería ({project.gallery ? project.gallery.length : 0} Capturas)</span>
          </span>
        </div>
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-cyan-400 font-mono text-xs font-semibold">
          {project.categoryLabel}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Architecture Highlights */}
          {project.architecture && (
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80 mb-4 text-xs text-slate-300 font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>Puntos Clave de Arquitectura:</span>
              </div>
              {project.architecture.map((arch, aIdx) => (
                <div key={aIdx} className="truncate">• {arch}</div>
              ))}
            </div>
          )}

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.techStack.map((tech, tIdx) => (
              <span
                key={tIdx}
                className="font-mono text-[11px] font-medium bg-slate-900 text-cyan-300 border border-cyan-800/40 px-2 py-0.5 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-auto">
          <div className="flex items-center gap-3">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Código</span>
            </a>

            {project.companionRepoUrl && (
              <a
                href={project.companionRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>{project.companionRepoLabel || "Repo Asociado"}</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>En Vivo</span>
              </a>
            )}
          </div>

          <button
            onClick={() => onOpenGallery(project)}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Ver Vistas</span>
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </article>
  );
}
