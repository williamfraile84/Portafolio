import React from 'react';
import { Layers, ShieldCheck, HardDrive, Check } from 'lucide-react';

export default function About() {
  return (
    <section id="sobre-mi" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full mb-3">
            Perfil Profesional
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ingeniería, Código Limpio y Seguridad por Diseño
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Mi propuesta técnica fusiona el desarrollo ágil de software con el rigor analítico de la auditoría pericial forense y la automatización de hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 hover:-translate-y-1.5 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Full Stack Moderno</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Arquitecturas web desacopladas. Frontend reactivo con <strong>React 19, Vite y Tailwind CSS 4</strong> sincronizado con backends asíncronos en <strong>FastAPI (Python)</strong> y persistencia multi-motor (PostgreSQL y SQLite WAL).
            </p>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> APIs RESTful y contratos Pydantic</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Persistencia SQLite WAL / PostgreSQL</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Docker y despliegues reproducibles</li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 hover:-translate-y-1.5 transition-all border-blue-500/30">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Auditoría Pericial & DevSecOps</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Valor diferencial estratégico: experiencia real en peritaje forense de sistemas web, evaluación de vulnerabilidades bajo <strong>OWASP Top 10</strong> y auditoría de calidad de código bajo <strong>ISO/IEC 25010 y CMMI</strong>.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Mitigación de inyecciones y bypass auth</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Telemetría, logs y trazabilidad</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Suites de pruebas unitarias (Pytest)</li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 hover:-translate-y-1.5 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Cloud, Hardware & Móvil</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Sólida base práctica desde el SENA: integración de básculas seriales y hardware POS, almacenamiento multi-cloud en <strong>AWS S3</strong> y <strong>Google Drive API</strong>, y desarrollo móvil en <strong>Kotlin / Android Compose</strong>.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Integración hardware POS (básculas seriales)</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Almacenamiento redundante AWS S3 + Drive</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Android nativo con OCR 100% offline</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
