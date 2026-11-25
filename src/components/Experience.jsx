import React from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';

export default function Experience() {
  return (
    <section id="trayectoria" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full mb-3">
            Historial Profesional
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Experiencia Laboral & Formación
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Trayectoria estructurada desde la programación base de software hasta la ingeniería de sistemas y soporte TI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Experiencia Laboral */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Experiencia Laboral</h3>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-cyan-500 border-4 border-slate-950"></div>
                <div className="text-xs font-mono text-cyan-400 font-semibold mb-1">
                  Diciembre 2020 – Febrero 2021
                </div>
                <h4 className="text-lg font-bold text-white">Auxiliar de Sistemas</h4>
                <div className="text-slate-400 text-sm mb-3">
                  MOVILGAS LTDA · Villavicencio, Colombia
                </div>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Diseñó e implementó herramientas modulares internas y scripts de automatización para optimizar la captura y procesamiento de datos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Brindó soporte técnico presencial y remoto N1/N2 a usuarios internos, con tasa de resolución superior al 95%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Ejecutó planes de mantenimiento preventivo y correctivo sobre hardware corporativo, servidores y cableado estructurado.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Administró políticas de copias de seguridad (backups) y simulacros de recuperación ante desastres (DRP).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Formación Académica */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Formación Académica</h3>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">
              
              {/* Universidad */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-4 border-slate-950"></div>
                <div className="text-xs font-mono text-blue-400 font-semibold mb-1">
                  Graduado: Septiembre 2026
                </div>
                <h4 className="text-lg font-bold text-white">Ingeniería de Sistemas</h4>
                <div className="text-slate-400 text-sm mb-2">
                  Universidad de los Llanos (Unillanos) · Villavicencio
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enfoque en arquitectura de software, bases de datos relacionales y no relacionales, auditoría forense de sistemas, modelos de calidad ISO/IEC 25010 y desarrollo distribuido.
                </p>
              </div>

              {/* SENA Tecnólogo */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-4 border-slate-950"></div>
                <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">2021</div>
                <h4 className="text-lg font-bold text-white">Tecnólogo en Mantenimiento de Equipos & Cableado Estructurado</h4>
                <div className="text-slate-400 text-sm mb-2">
                  Servicio Nacional de Aprendizaje (SENA)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Diseño e instalación de redes bajo estándares internacionales, mantenimiento de hardware de misión crítica y soporte a servidores.
                </p>
              </div>

              {/* SENA Técnico */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-4 border-slate-950"></div>
                <div className="text-xs font-mono text-indigo-400 font-semibold mb-1">2017</div>
                <h4 className="text-lg font-bold text-white">Técnico en Programación de Software</h4>
                <div className="text-slate-400 text-sm mb-2">
                  Servicio Nacional de Aprendizaje (SENA)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fundamentos de algoritmia, programación orientada a objetos (POO), bases de datos y desarrollo web inicial.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
