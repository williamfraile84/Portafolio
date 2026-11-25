import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LightboxModal({ isOpen, project, currentImageIndex, onClose, onPrev, onNext, onSelectIndex }) {
  if (!isOpen || !project || !project.gallery || project.gallery.length === 0) return null;

  const currentItem = project.gallery[currentImageIndex] || project.gallery[0];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold">
            {project.categoryLabel || "PROYECTO"}
          </span>
          <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-xl">
            {project.title}
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            {currentImageIndex + 1} / {project.gallery.length}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="relative flex-grow flex items-center justify-center my-3 overflow-hidden">
        <button
          onClick={onPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700 text-white flex items-center justify-center hover:bg-cyan-500 hover:border-cyan-500 transition-all z-10"
          aria-label="Anterior captura"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="max-w-full max-h-full flex flex-col items-center justify-center px-4">
          <img
            src={currentItem.url}
            alt={currentItem.caption}
            className="max-h-[68vh] max-w-full rounded-xl object-contain border border-slate-800 shadow-2xl"
          />
          <p className="mt-3 text-xs sm:text-sm text-slate-300 font-mono text-center max-w-2xl px-4 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
            {currentItem.caption}
          </p>
        </div>

        <button
          onClick={onNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700 text-white flex items-center justify-center hover:bg-cyan-500 hover:border-cyan-500 transition-all z-10"
          aria-label="Siguiente captura"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails Strip */}
      <div className="border-t border-slate-800 pt-2 flex items-center justify-center gap-2 overflow-x-auto max-w-full pb-1">
        {project.gallery.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onSelectIndex(idx)}
            className={`w-14 h-10 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
              idx === currentImageIndex ? 'border-cyan-400 scale-105 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img.url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
