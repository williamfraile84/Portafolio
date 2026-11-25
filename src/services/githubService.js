import { portfolioConfig } from '../portfolio.config';

const CACHE_KEY = 'wf_github_repos_cache';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos de caché en navegador

/**
 * Consulta la API pública de GitHub en tiempo real para obtener
 * los repositorios del usuario, filtrando los ocultos y detectando nuevos proyectos.
 */
export async function fetchGitHubData() {
  const username = portfolioConfig.github.username;
  const hiddenRepos = new Set(portfolioConfig.github.hiddenRepos.map(r => r.toLowerCase()));
  
  // 1. Verificar caché local
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL_MS) {
        return processRepos(data, hiddenRepos);
      }
    }
  } catch (e) {
    // Continuar si falla localStorage
  }

  // 2. Consultar API pública de GitHub
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const repos = await response.json();
    
    // Guardar en caché
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: repos
      }));
    } catch (e) {}

    return processRepos(repos, hiddenRepos);
  } catch (error) {
    console.warn("No se pudo conectar en vivo a GitHub API, usando datos estáticos:", error);
    // Fallback: usar los proyectos destacados definidos en la configuración
    return {
      allRepos: [],
      featured: portfolioConfig.featuredProjects,
      newRepos: [],
      isLive: false,
      error: error.message
    };
  }
}

function processRepos(rawRepos, hiddenRepos) {
  // Filtrar repos ocultos y ordenarlos por fecha de actualización
  const publicRepos = rawRepos.filter(r => !hiddenRepos.has(r.name.toLowerCase()));

  // Mapear los repos destacados para enriquecerlos con stats de GitHub en vivo
  const featuredIds = new Set(portfolioConfig.featuredProjects.map(p => p.repoUrl.split('/').pop().toLowerCase()));
  
  const featuredWithLiveStats = portfolioConfig.featuredProjects.map(proj => {
    const repoName = proj.repoUrl.split('/').pop().toLowerCase();
    const liveRepo = publicRepos.find(r => r.name.toLowerCase() === repoName);
    if (liveRepo) {
      return {
        ...proj,
        stars: liveRepo.stargazers_count,
        forks: liveRepo.forks_count,
        updatedAt: liveRepo.updated_at,
        githubDesc: liveRepo.description
      };
    }
    return proj;
  });

  // Identificar repositorios que NO están en la lista de destacados principales
  // (¡Estos son los repos nuevos que creará William en el futuro!)
  const newRepos = publicRepos
    .filter(r => !featuredIds.has(r.name.toLowerCase()))
    .map(r => ({
      id: r.id,
      name: r.name,
      description: r.description || "Proyecto de software publicado en GitHub",
      htmlUrl: r.html_url,
      language: r.language || "Código",
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.updated_at,
      hasPages: r.has_pages,
      topics: r.topics || []
    }));

  return {
    allRepos: publicRepos,
    featured: featuredWithLiveStats,
    newRepos: newRepos,
    isLive: true,
    lastSync: new Date().toLocaleTimeString()
  };
}
