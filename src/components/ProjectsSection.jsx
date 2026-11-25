import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import LiveRepoCard from './LiveRepoCard';
import LightboxModal from './LightboxModal';
import { Search, Filter, Sparkles, RefreshCw, Layers, Shield, Cpu, Smartphone } from 'lucide-react';

export default function ProjectsSection({ featuredProjects, newRepos, isLive, lastSync, onRefresh }) {
  const [activeTab, setActiveTab] = useState('featured'); // 'featured' | 'live'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lightbox State
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleOpenGallery = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const handleCloseGallery = () => {
    setSelectedProject(null);
  };

  const handlePrevImage = () => {
    if (!selectedProject || !selectedProject.gallery) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedProject.gallery.length) % selectedProject.gallery.length);
  };

  const handleNextImage = () => {
    if (!selectedProject || !selectedProject.gallery) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedProject.gallery.length);
  };

  // Filtrado de proyectos destacados
  const filteredFeatured = featuredProjects.filter((p) => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtrado de repos en vivo
  const filteredLiveRepos = newRepos.filter((r) => {
    return searchQuery === '' ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.language && r.language.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <section id="proyectos" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/70">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono font-semibold uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portafolio Dinámico</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Proyectos de Software & Repositorios
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Diseñado en React para sincronizarse automáticamente con mi cuenta de GitHub: explora el código fuente, la arquitectura desacoplada y las capturas funcionales de cada desarrollo.
          </p>
        </div>

        {/* Tab Selector: Destacados vs GitHub Live */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                activeTab === 'featured'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              ⭐ Proyectos Principales ({featuredProjects.length})
            </button>

            <button
              onClick={() => setActiveTab('live')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                activeTab === 'live'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>Nuevos Repos en Vivo ({newRepos.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por tecnología (FastAPI, React, Docker)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Sub-Filters for Featured Tab */}
        {activeTab === 'featured' && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryFilter === 'all'
                  ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos ({featuredProjects.length})
            </button>
            <button
              onClick={() => setCategoryFilter('fullstack')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryFilter === 'fullstack'
                  ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Full Stack Web
            </button>
            <button
              onClick={() => setCategoryFilter('hardware')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryFilter === 'hardware'
                  ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Hardware & POS
            </button>
            <button
              onClick={() => setCategoryFilter('auditoria')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryFilter === 'auditoria'
                  ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Auditoría & Seguridad
            </button>
            <button
              onClick={() => setCategoryFilter('mobile')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryFilter === 'mobile'
                  ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Android Nativo & OCR
            </button>
          </div>
        )}

        {/* Content Area: Featured Projects Grid */}
        {activeTab === 'featured' && (
          <div>
            {filteredFeatured.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                No se encontraron proyectos con el criterio seleccionado.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredFeatured.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpenGallery={handleOpenGallery}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Area: Live GitHub Repositories Grid */}
        {activeTab === 'live' && (
          <div>
            <div className="mb-6 p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span>
                  Sincronizado con la API pública de GitHub (@williamfraile84). Cada nuevo repositorio público que crees aparecerá automáticamente aquí.
                </span>
              </div>
              {lastSync && <span className="font-mono text-[10px] text-cyan-500">Última sync: {lastSync}</span>}
            </div>

            {filteredLiveRepos.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                No hay repositorios adicionales para mostrar en este momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLiveRepos.map((repo) => (
                  <LiveRepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={Boolean(selectedProject)}
        project={selectedProject}
        currentImageIndex={currentImageIndex}
        onClose={handleCloseGallery}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
        onSelectIndex={(idx) => setCurrentImageIndex(idx)}
      />
    </section>
  );
}
