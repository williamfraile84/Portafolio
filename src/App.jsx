import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import ProjectsSection from './components/ProjectsSection';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';
import { fetchGitHubData } from './services/githubService';
import { loadActiveConfig } from './services/configService';

export default function App() {
  const [config, setConfig] = useState(loadActiveConfig());
  const [newRepos, setNewRepos] = useState([]);
  const [allLiveRepos, setAllLiveRepos] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin Modal State
  const [adminOpen, setAdminOpen] = useState(false);

  const loadData = async (overrideCfg = null) => {
    setLoading(true);
    const activeCfg = overrideCfg || loadActiveConfig();
    setConfig(activeCfg);

    const hiddenList = activeCfg.github ? activeCfg.github.hiddenRepos : [];
    const data = await fetchGitHubData(hiddenList);
    if (data.newRepos) {
      setNewRepos(data.newRepos);
    }
    if (data.allRepos) {
      setAllLiveRepos(data.allRepos);
    }
    setIsLive(data.isLive);
    setLastSync(data.lastSync);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // 1. Detectar atajo de teclado: Ctrl + Shift + A
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 2. Detectar ruta hash #admin o query ?admin=true
    const checkUrlTrigger = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        setAdminOpen(true);
      }
    };
    checkUrlTrigger();
    window.addEventListener('hashchange', checkUrlTrigger);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkUrlTrigger);
    };
  }, []);

  // Proyectos visibles para el público general
  const publicFeaturedProjects = config.featuredProjects.filter(p => p.visible !== false);

  const handleConfigUpdated = (newConfig) => {
    setConfig(newConfig);
    loadData(newConfig);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans relative selection:bg-cyan-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      <div className="relative z-10 flex flex-col">
        <Navbar 
          isLive={isLive} 
          lastSync={lastSync}
          onOpenAdmin={() => setAdminOpen(true)}
          personal={config.personal}
        />
        
        <main className="pt-20">
          <Hero personal={config.personal} />
          <About />
          <Skills />
          <ProjectsSection
            featuredProjects={publicFeaturedProjects}
            newRepos={newRepos}
            isLive={isLive}
            lastSync={lastSync}
            onRefresh={() => loadData(config)}
          />
          <Experience />
          <Contact personal={config.personal} />
        </main>

        <Footer onOpenAdmin={() => setAdminOpen(true)} personal={config.personal} />

        {/* Modal de Control Secreto */}
        <AdminModal
          isOpen={adminOpen}
          onClose={() => {
            setAdminOpen(false);
            if (window.location.hash === '#admin') {
              history.pushState("", document.title, window.location.pathname + window.location.search);
            }
          }}
          activeConfig={config}
          onConfigUpdated={handleConfigUpdated}
          liveRepos={allLiveRepos}
        />
      </div>
    </div>
  );
}
