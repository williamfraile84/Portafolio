import React from 'react';
import { Server, Layout, Database, ShieldAlert, Terminal, Cpu } from 'lucide-react';

export default function Skills() {
  const skillGroups = [
    {
      title: "Desarrollo Backend",
      icon: <Server className="w-5 h-5 text-cyan-400" />,
      skills: ["Python 3.12", "FastAPI", "Uvicorn ASGI", "Pydantic v2", "SQLAlchemy 2.0", "Java (OOP)", "PHP", "C / C++", "RESTful APIs", "JWT Auth"]
    },
    {
      title: "Frontend & Móvil",
      icon: <Layout className="w-5 h-5 text-blue-400" />,
      skills: ["React 19", "JavaScript (ES6+)", "Vite", "Tailwind CSS 4", "Kotlin", "Jetpack Compose", "Room DB", "HTML5 Semántico", "CSS3 Moderno", "html5-qrcode"]
    },
    {
      title: "Bases de Datos & Cloud",
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      skills: ["PostgreSQL", "SQLite (Modo WAL)", "MySQL", "MongoDB", "AWS S3 (boto3)", "Google Drive API", "Supabase", "Cloudflare R2 / MinIO"]
    },
    {
      title: "Seguridad & Auditoría",
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      skills: ["OWASP Top 10", "Auditoría Forense", "ISO/IEC 25010", "ISO 31000", "CMMI", "Telemetría en Vivo", "Pytest (Unit & Integration)", "Logs de Trazabilidad"]
    },
    {
      title: "DevOps & Automatización",
      icon: <Terminal className="w-5 h-5 text-amber-400" />,
      skills: ["Docker", "Git & GitHub", "Linux (Bash)", "Playwright", "Postman", "CI/CD Básico", "VS Code", "Android Studio"]
    },
    {
      title: "Hardware, Infraestructura & Ágil",
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      skills: ["Integración Básculas Seriales", "Soporte TI N1 / N2", "Redes LAN / WAN", "Cableado Estructurado", "Políticas Backup / DRP", "Scrum / Kanban", "Inglés B2"]
    }
  ];

  return (
    <section id="habilidades" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full mb-3">
            Stack Tecnológico
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Herramientas & Competencias Técnicas
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Tecnologías probadas en entornos de producción, desarrollo local y respaldadas por código fuente en mis repositorios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group, index) => (
            <div key={index} className="glass-panel rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  {group.icon}
                </div>
                <h3 className="font-bold text-white text-base">{group.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="font-mono text-xs font-medium bg-slate-900/90 text-slate-200 border border-slate-800/80 px-2.5 py-1 rounded-md hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
