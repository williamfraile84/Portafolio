import { portfolioConfig } from '../portfolio.config';

const CACHE_KEY = 'wf_github_repos_cache_v2';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos de caché en navegador

/**
 * Consulta la API pública de GitHub en tiempo real para obtener
 * los repositorios del usuario, filtrando los ocultos y detectando nuevos proyectos.
 * Recibe opcionalmente la lista de repositorios ocultos configurada por el usuario en el admin.
 */
export async function fetchGitHubData(customHiddenRepos = null) {
  const username = portfolioConfig.github.username;
  const hiddenList = customHiddenRepos || portfolioConfig.github.hiddenRepos || [];
  const hiddenRepos = new Set(hiddenList.map(r => r.toLowerCase()));
  
  // 1. Verificar caché local
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL_MS && Array.isArray(data) && data.length > 0) {
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
    console.warn("No se pudo conectar en vivo a GitHub API, usando catálogo conocido:", error);
    // Fallback: usar catálogo de todos los repos conocidos para asegurar que el admin tenga todos disponibles
    const fallbackRepos = (portfolioConfig.allKnownRepos || []).map((r, idx) => ({
      id: idx + 100,
      name: r.name,
      description: r.description,
      language: r.language,
      html_url: `https://github.com/${username}/${r.name}`,
      stargazers_count: 0,
      forks_count: 0,
      updated_at: new Date().toISOString()
    }));
    return processRepos(fallbackRepos, hiddenRepos);
  }
}

function processRepos(rawRepos, hiddenRepos) {
  // ATENCIÓN: allRepos contiene TODOS los repositorios detectados (sin filtrar)
  // para que el panel de administración pueda listar los 13+ proyectos y permitir encenderlos/apagarlos
  const allRepos = rawRepos;

  // Filtrar repos ocultos y ordenarlos por fecha de actualización para la vista pública
  const publicRepos = rawRepos.filter(r => !hiddenRepos.has(r.name.toLowerCase()));

  // Mapear los repos destacados para enriquecerlos con stats de GitHub en vivo
  const featuredIds = new Set(portfolioConfig.featuredProjects.map(p => p.repoUrl.split('/').pop().toLowerCase()));
  
  const featuredWithLiveStats = portfolioConfig.featuredProjects.map(proj => {
    const repoName = proj.repoUrl.split('/').pop().toLowerCase();
    const liveRepo = rawRepos.find(r => r.name.toLowerCase() === repoName);
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
  const newRepos = publicRepos
    .filter(r => !featuredIds.has(r.name.toLowerCase()))
    .map(r => ({
      id: r.id,
      name: r.name,
      description: r.description || "Proyecto de software publicado en GitHub",
      htmlUrl: r.html_url,
      language: r.language || "Código",
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      updatedAt: r.updated_at,
      hasPages: r.has_pages,
      topics: r.topics || []
    }));

  return {
    allRepos: allRepos, // Enviado a AdminModal (lista completa de 13+ repos)
    featured: featuredWithLiveStats,
    newRepos: newRepos, // Enviado a la vista pública (filtrado)
    isLive: true,
    lastSync: new Date().toLocaleTimeString()
  };
}
