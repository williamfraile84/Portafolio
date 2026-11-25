import React, { useState, useEffect } from 'react';
import { 
  Lock, Eye, EyeOff, Save, Download, Copy, RotateCcw, 
  X, Check, AlertTriangle, ShieldCheck, Github, Sliders, User, Plus, Trash2, Mail, MessageCircle, Linkedin,
  Globe, Send, ExternalLink, Loader2, Key, ChevronUp, ChevronDown, Edit3, Star, Sparkles, Image, Layers
} from 'lucide-react';
import { isAuthenticated, login, logout, changePassword } from '../services/authService';
import { saveActiveConfig, resetConfigToDefaults, downloadConfigFile, generateConfigCode } from '../services/configService';
import { getSavedGitHubToken, saveGitHubToken, clearGitHubToken, publishConfigToGitHub } from '../services/githubPublishService';

export default function AdminModal({ isOpen, onClose, activeConfig, onConfigUpdated, liveRepos = [] }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'github' | 'profile' | 'export' | 'security'
  
  // Local Config Draft
  const [configDraft, setConfigDraft] = useState(activeConfig);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // GitHub Direct Publishing State
  const [githubToken, setGithubToken] = useState(getSavedGitHubToken());
  const [showToken, setShowToken] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState(null);

  // Project Editor State
  const [editingProjectId, setEditingProjectId] = useState(null); // null | 'new' | string ID
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    category: 'fullstack',
    categoryLabel: '🛒 Full Stack Web & PWA',
    repoUrl: '',
    companionRepoUrl: '',
    companionRepoLabel: '',
    liveUrl: '',
    description: '',
    techStackText: '',
    architectureText: '',
    thumbnail: '',
    visible: true,
    gallery: []
  });

  useEffect(() => {
    if (isOpen) {
      setAuthed(isAuthenticated());
      setConfigDraft(JSON.parse(JSON.stringify(activeConfig)));
      setPassword('');
      setLoginError('');
      setStatusMsg({ text: '', type: '' });
      setPublishFeedback(null);
      setEditingProjectId(null);
      setGithubToken(getSavedGitHubToken());
    }
  }, [isOpen, activeConfig]);

  if (!isOpen) return null;

  // Manejo de Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const res = await login(password);
    setLoginLoading(false);
    if (res.success) {
      setAuthed(true);
    } else {
      setLoginError(res.message);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthed(false);
    setPassword('');
  };

  // Toggle visibilidad de proyecto destacado
  const handleToggleProject = (projId) => {
    setConfigDraft((prev) => {
      const updated = prev.featuredProjects.map((p) => {
        if (p.id === projId) {
          const isCurrentlyVisible = p.visible !== false;
          return { ...p, visible: !isCurrentlyVisible };
        }
        return p;
      });
      return { ...prev, featuredProjects: updated };
    });
  };

  // Toggle visibilidad de repo de GitHub en lista oculta
  const handleToggleHiddenRepo = (repoName) => {
    setConfigDraft((prev) => {
      const hiddenList = [...(prev.github.hiddenRepos || [])];
      const index = hiddenList.findIndex((r) => r.toLowerCase() === repoName.toLowerCase());
      if (index >= 0) {
        hiddenList.splice(index, 1);
      } else {
        hiddenList.push(repoName);
      }
      return {
        ...prev,
        github: {
          ...prev.github,
          hiddenRepos: hiddenList
        }
      };
    });
  };

  // Iniciar edición de proyecto existente
  const handleStartEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      id: proj.id,
      title: proj.title || '',
      category: proj.category || 'fullstack',
      categoryLabel: proj.categoryLabel || '🛒 Full Stack Web & PWA',
      repoUrl: proj.repoUrl || '',
      companionRepoUrl: proj.companionRepoUrl || '',
      companionRepoLabel: proj.companionRepoLabel || '',
      liveUrl: proj.liveUrl || '',
      description: proj.description || '',
      techStackText: Array.isArray(proj.techStack) ? proj.techStack.join(', ') : '',
      architectureText: Array.isArray(proj.architecture) ? proj.architecture.join('\n') : '',
      thumbnail: proj.thumbnail || '',
      visible: proj.visible !== false,
      gallery: proj.gallery || []
    });
  };

  // Iniciar creación de nuevo proyecto (opcionalmente precargado desde un repo de GitHub)
  const handleStartNewProject = (prefillRepo = null) => {
    const defaultTitle = prefillRepo ? prefillRepo.name : '';
    const defaultRepoUrl = prefillRepo 
      ? (prefillRepo.html_url || `https://github.com/williamfraile84/${prefillRepo.name}`)
      : 'https://github.com/williamfraile84/';
    const defaultDesc = prefillRepo 
      ? (prefillRepo.description || 'Proyecto de software desarrollado con buenas prácticas y arquitectura escalable.')
      : '';
    const defaultTech = prefillRepo?.language ? prefillRepo.language : 'JavaScript, React';

    setEditingProjectId('new');
    setProjectForm({
      id: prefillRepo ? prefillRepo.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'proyecto-' + Date.now().toString(36),
      title: defaultTitle,
      category: 'fullstack',
      categoryLabel: '🛒 Full Stack Web & PWA',
      repoUrl: defaultRepoUrl,
      companionRepoUrl: '',
      companionRepoLabel: '',
      liveUrl: '',
      description: defaultDesc,
      techStackText: defaultTech,
      architectureText: '• Arquitectura desacoplada y orientada a componentes\n• Manejo estructurado de estado y datos\n• Optimización de rendimiento y buenas prácticas',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      visible: true,
      gallery: []
    });
  };

  // Cancelar edición de proyecto
  const handleCancelProjectEdit = () => {
    setEditingProjectId(null);
  };

  // Cambiar categoría y actualizar etiqueta automáticamente
  const handleCategoryChange = (cat) => {
    const labels = {
      fullstack: '🛒 Full Stack Web & PWA',
      backend: '⚡ Backend API & Microservicios',
      hardware: '⚖️ Hardware & Automatización',
      auditoria: '🛡️ Auditoría Forense & OWASP',
      mobile: '📱 Mobile Nativo & OCR'
    };
    setProjectForm((prev) => ({
      ...prev,
      category: cat,
      categoryLabel: labels[cat] || prev.categoryLabel
    }));
  };

  // Autocompletar formulario al seleccionar un repo existente de GitHub
  const handleSelectRepoToPrefill = (repoName) => {
    if (!repoName) return;
    const found = liveRepos.find((r) => r.name.toLowerCase() === repoName.toLowerCase());
    if (found) {
      setProjectForm((prev) => ({
        ...prev,
        title: found.name,
        repoUrl: found.html_url || `https://github.com/williamfraile84/${found.name}`,
        description: found.description || prev.description,
        techStackText: found.language ? `${found.language}, Git` : prev.techStackText
      }));
    }
  };

  // Guardar proyecto creado o editado
  const handleSaveProjectForm = (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.title.trim()) {
      setStatusMsg({ text: 'El título del proyecto es obligatorio.', type: 'error' });
      return;
    }
    if (!projectForm.repoUrl || !projectForm.repoUrl.trim()) {
      setStatusMsg({ text: 'La URL del repositorio es obligatoria.', type: 'error' });
      return;
    }

    const techArray = projectForm.techStackText
      ? projectForm.techStackText.split(',').map(s => s.trim()).filter(Boolean)
      : ['Software'];

    const archArray = projectForm.architectureText
      ? projectForm.architectureText.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

    const projectToSave = {
      id: projectForm.id || ('proj-' + Date.now().toString(36)),
      title: projectForm.title.trim(),
      category: projectForm.category || 'fullstack',
      categoryLabel: projectForm.categoryLabel || '⚡ Software',
      repoUrl: projectForm.repoUrl.trim(),
      companionRepoUrl: projectForm.companionRepoUrl ? projectForm.companionRepoUrl.trim() : null,
      companionRepoLabel: projectForm.companionRepoLabel ? projectForm.companionRepoLabel.trim() : null,
      liveUrl: projectForm.liveUrl ? projectForm.liveUrl.trim() : null,
      description: projectForm.description.trim(),
      techStack: techArray,
      architecture: archArray,
      thumbnail: projectForm.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      visible: projectForm.visible !== false,
      gallery: projectForm.gallery && projectForm.gallery.length > 0 
        ? projectForm.gallery 
        : [{ url: projectForm.thumbnail, caption: projectForm.title }]
    };

    setConfigDraft((prev) => {
      let updatedList = [...prev.featuredProjects];
      if (editingProjectId === 'new') {
        updatedList.push(projectToSave);
      } else {
        updatedList = updatedList.map((p) => (p.id === editingProjectId ? projectToSave : p));
      }
      return { ...prev, featuredProjects: updatedList };
    });

    setEditingProjectId(null);
    setStatusMsg({ 
      text: editingProjectId === 'new' ? '¡Proyecto agregado! Pulsa "Publicar Globalmente" para subirlo a GitHub.' : '¡Proyecto actualizado! Pulsa "Publicar Globalmente" para subirlo a GitHub.', 
      type: 'success' 
    });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 5000);
  };

  // Eliminar proyecto destacado
  const handleDeleteProject = (projId) => {
    if (window.confirm("¿Seguro que deseas quitar este proyecto de la lista de Proyectos Destacados?")) {
      setConfigDraft((prev) => ({
        ...prev,
        featuredProjects: prev.featuredProjects.filter(p => p.id !== projId)
      }));
      setStatusMsg({ text: 'Proyecto quitado de los destacados.', type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    }
  };

  // Reordenar proyectos (subir/bajar)
  const handleMoveProject = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= configDraft.featuredProjects.length) return;

    setConfigDraft((prev) => {
      const list = [...prev.featuredProjects];
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, featuredProjects: list };
    });
  };

  // Publicar directamente en GitHub Pages para todo el mundo
  const handlePublishToGitHub = async () => {
    if (!githubToken || !githubToken.trim()) {
      setActiveTab('export');
      setPublishFeedback({
        success: false,
        message: 'Por favor ingresa tu Personal Access Token (PAT) de GitHub para poder publicar a nivel global.'
      });
      return;
    }

    setIsPublishing(true);
    setPublishFeedback(null);

    // Guardar cambios localmente en el draft
    saveActiveConfig(configDraft);
    onConfigUpdated(configDraft);

    // Enviar a la API de GitHub
    const res = await publishConfigToGitHub(configDraft, githubToken);
    setIsPublishing(false);
    setPublishFeedback(res);

    if (res.success) {
      setStatusMsg({ 
        text: '¡Cambios subidos a GitHub con éxito! El despliegue automático global ha iniciado.', 
        type: 'success' 
      });
    } else {
      setStatusMsg({ text: res.message, type: 'error' });
    }
  };

  const handleSaveTokenOnly = () => {
    saveGitHubToken(githubToken);
    setStatusMsg({ text: 'Token de GitHub guardado en este navegador de forma segura.', type: 'success' });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
  };

  const handleClearTokenOnly = () => {
    clearGitHubToken();
    setGithubToken('');
    setStatusMsg({ text: 'Token de GitHub eliminado de este navegador.', type: 'success' });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
  };

  // Cambiar contraseña maestra
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatusMsg({ text: 'Las contraseñas no coinciden.', type: 'error' });
      return;
    }
    const res = await changePassword(newPassword);
    if (res.success) {
      setStatusMsg({ text: 'Contraseña actualizada exitosamente.', type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
    } else {
      setStatusMsg({ text: res.message, type: 'error' });
    }
  };

  // Restablecer valores de fábrica
  const handleResetDefaults = () => {
    if (window.confirm("¿Seguro que deseas restablecer todos los ajustes a los valores iniciales?")) {
      const def = resetConfigToDefaults();
      setConfigDraft(def);
      onConfigUpdated(def);
      setStatusMsg({ text: 'Configuración restablecida a valores originales.', type: 'success' });
    }
  };

  // Copiar código para portfolio.config.js
  const handleCopyCode = () => {
    const code = generateConfigCode(configDraft);
    navigator.clipboard.writeText(code);
    setStatusMsg({ text: '¡Código copiado al portapapeles! Reemplaza src/portfolio.config.js en tu repo.', type: 'success' });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
  };

  // Descargar archivo
  const handleDownloadFile = () => {
    downloadConfigFile(configDraft);
    setStatusMsg({ text: 'Archivo portfolio.config.js descargado.', type: 'success' });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* ========================================================= */}
        {/* VISTA 1: FORMULARIO DE ACCESO (LOGIN)                     */}
        {/* ========================================================= */}
        {!authed ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full">
              Autenticación Criptográfica SHA-256
            </span>

            <h3 className="text-2xl font-bold text-white mt-4 mb-2">
              Panel Administrativo Privado
            </h3>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">
              Ingresa tu contraseña maestra para activar, desactivar y gestionar los proyectos, repositorios e información de contacto visible en tu portafolio.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña Maestra..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors pr-12"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 text-left flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loginLoading || !password}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:scale-102 disabled:opacity-50 transition-all"
                >
                  {loginLoading ? "Verificando..." : "Acceder al Panel"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================= */
          /* VISTA 2: PANEL DE CONTROL ADMINISTRATIVO                   */
          /* ========================================================= */
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Header del Admin */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>Panel de Control Privado</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 border border-emerald-800 text-emerald-400">
                      Modo Admin Activo
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Gestiona proyectos, repositorios y publicación global en GitHub Pages.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Cerrar Sesión
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification Banner */}
            {statusMsg.text && (
              <div className={`px-6 py-2.5 text-xs font-medium flex items-center gap-2 ${
                statusMsg.type === 'error' ? 'bg-rose-950/80 text-rose-300 border-b border-rose-800' : 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-800'
              }`}>
                {statusMsg.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 overflow-x-auto bg-slate-900">
              <button
                onClick={() => { setActiveTab('projects'); setEditingProjectId(null); }}
                className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all ${
                  activeTab === 'projects'
                    ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⭐ Proyectos Destacados ({configDraft.featuredProjects.length})
              </button>
              <button
                onClick={() => setActiveTab('github')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all ${
                  activeTab === 'github'
                    ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔄 Repositorios GitHub ({liveRepos.length})
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all ${
                  activeTab === 'profile'
                    ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                👤 Perfil & Contacto
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all ${
                  activeTab === 'export'
                    ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🚀 Publicar Globalmente
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all ${
                  activeTab === 'security'
                    ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔒 Seguridad
              </button>
            </div>

            {/* Tab Contents (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-grow space-y-6">
              
              {/* ========================================================= */}
              {/* TAB 1: GESTIÓN DE PROYECTOS DESTACADOS                     */}
              {/* ========================================================= */}
              {activeTab === 'projects' && (
                <div className="space-y-5">
                  
                  {/* Vista A: Formulario de Edición / Creación */}
                  {editingProjectId !== null ? (
                    <form onSubmit={handleSaveProjectForm} className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-sm font-bold text-white">
                            {editingProjectId === 'new' ? 'Agregar Nuevo Proyecto Destacado' : `Editar Proyecto: ${projectForm.title}`}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={handleCancelProjectEdit}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancelar
                        </button>
                      </div>

                      {/* Selector para autocompletar desde GitHub */}
                      {editingProjectId === 'new' && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <label className="text-[11px] font-bold text-slate-300 block mb-1">
                            🚀 Autocompletar desde un repositorio existente de GitHub:
                          </label>
                          <select
                            onChange={(e) => handleSelectRepoToPrefill(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-cyan-300 focus:outline-none"
                            defaultValue=""
                          >
                            <option value="">-- Elige un repositorio de GitHub para cargar sus datos --</option>
                            {liveRepos.map((r) => (
                              <option key={r.name} value={r.name}>
                                {r.name} ({r.language || 'Sin lenguaje'})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Título */}
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">Título del Proyecto *</label>
                          <input
                            type="text"
                            required
                            value={projectForm.title}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                            placeholder="Ej: FRUVER POS – Ecosistema Web"
                          />
                        </div>

                        {/* Categoría */}
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">Categoría Principal</label>
                          <select
                            value={projectForm.category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                          >
                            <option value="fullstack">🛒 Full Stack Web & PWA</option>
                            <option value="backend">⚡ Backend API & Microservicios</option>
                            <option value="hardware">⚖️ Hardware & Automatización</option>
                            <option value="auditoria">🛡️ Auditoría Forense & OWASP</option>
                            <option value="mobile">📱 Mobile Nativo & OCR</option>
                          </select>
                        </div>

                        {/* Etiqueta visible */}
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">Insignia / Etiqueta Visible</label>
                          <input
                            type="text"
                            value={projectForm.categoryLabel}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, categoryLabel: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                            placeholder="🛒 Full Stack Web & PWA"
                          />
                        </div>

                        {/* URL del Repositorio Principal */}
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">URL Repositorio Principal (GitHub) *</label>
                          <input
                            type="url"
                            required
                            value={projectForm.repoUrl}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, repoUrl: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                            placeholder="https://github.com/williamfraile84/..."
                          />
                        </div>

                        {/* Repositorio Compañero (Opcional) */}
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">URL Repositorio Compañero (Opcional)</label>
                          <input
                            type="url"
                            value={projectForm.companionRepoUrl}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, companionRepoUrl: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                            placeholder="https://github.com/williamfraile84/Backend-..."
                          />
                        </div>

                        {/* Etiqueta Compañero */}
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">Etiqueta Repo Compañero</label>
                          <input
                            type="text"
                            value={projectForm.companionRepoLabel}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, companionRepoLabel: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                            placeholder="Backend API / Frontend SPA"
                          />
                        </div>

                        {/* URL Demo Externa */}
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">URL Demo en Vivo (Opcional)</label>
                          <input
                            type="url"
                            value={projectForm.liveUrl}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, liveUrl: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                            placeholder="Dejar vacío si no aplica"
                          />
                        </div>

                        {/* Miniatura / Thumbnail */}
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">URL Imagen de Portada / Miniatura</label>
                          <input
                            type="url"
                            value={projectForm.thumbnail}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                            placeholder="https://raw.githubusercontent.com/.../screenshot.png"
                          />
                        </div>
                      </div>

                      {/* Descripción */}
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Descripción del Proyecto</label>
                        <textarea
                          rows="3"
                          value={projectForm.description}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-500"
                          placeholder="Explica qué problema resuelve, arquitectura utilizada y logros técnicos..."
                        />
                      </div>

                      {/* Tecnologías */}
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Stack Tecnológico (Separado por comas)
                        </label>
                        <input
                          type="text"
                          value={projectForm.techStackText}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, techStackText: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                          placeholder="React 19, FastAPI, PostgreSQL, Docker, Pytest"
                        />
                      </div>

                      {/* Puntos de Arquitectura */}
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Puntos Clave de Arquitectura (Un punto por línea)
                        </label>
                        <textarea
                          rows="3"
                          value={projectForm.architectureText}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, architectureText: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed font-mono focus:outline-none focus:border-cyan-500"
                          placeholder="• Arquitectura ASGI asíncrona no bloqueante&#10;• Persistencia dual con SQLite WAL&#10;• Suite automatizada de pruebas"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={handleCancelProjectEdit}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:scale-102"
                        >
                          Guardar Proyecto en Lista
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Vista B: Lista de Proyectos Destacados */
                    <>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>Proyectos Principales / Destacados</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-800 text-cyan-300">
                              {configDraft.featuredProjects.length} proyectos
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400">
                            Puedes editar los textos, cambiar enlaces, reordenar prioridades o agregar nuevos proyectos.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStartNewProject()}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all flex-shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar Proyecto</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {configDraft.featuredProjects.map((proj, idx) => {
                          const isVisible = proj.visible !== false;
                          return (
                            <div
                              key={proj.id || idx}
                              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                                isVisible ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-950/30 border-slate-900 opacity-60'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-grow">
                                <img
                                  src={proj.thumbnail}
                                  alt=""
                                  className="w-16 h-12 rounded-lg object-cover border border-slate-800 flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-sm text-white truncate">{proj.title}</span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 flex-shrink-0">
                                      {proj.categoryLabel}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{proj.description}</p>
                                  <div className="text-[11px] font-mono text-slate-500 truncate mt-1">
                                    {proj.repoUrl}
                                  </div>
                                </div>
                              </div>

                              {/* Acciones */}
                              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                                {/* Reordenar */}
                                <div className="flex items-center border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveProject(idx, -1)}
                                    disabled={idx === 0}
                                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-800"
                                    title="Subir orden"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveProject(idx, 1)}
                                    disabled={idx === configDraft.featuredProjects.length - 1}
                                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-800"
                                    title="Bajar orden"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Botón Editar */}
                                <button
                                  type="button"
                                  onClick={() => handleStartEditProject(proj)}
                                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-800 transition-colors"
                                  title="Editar proyecto"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {/* Botón Eliminar */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(proj.id)}
                                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 border border-slate-800 transition-colors"
                                  title="Quitar de destacados"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Switch Visibilidad */}
                                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
                                  <span className={`text-[11px] font-mono font-semibold ${isVisible ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {isVisible ? 'On' : 'Off'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleProject(proj.id)}
                                    className={`w-10 h-5 rounded-full transition-colors relative ${
                                      isVisible ? 'bg-emerald-500' : 'bg-slate-800'
                                    }`}
                                  >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                      isVisible ? 'translate-x-5.5' : 'translate-x-0.5'
                                    }`} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2: GITHUB API & LISTA NEGRA                           */}
              {/* ========================================================= */}
              {activeTab === 'github' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Sincronización en Tiempo Real</h4>
                      <p className="text-xs text-slate-400">Consultar automáticamente repositorios públicos de @{configDraft.github.username}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfigDraft(prev => ({ ...prev, github: { ...prev.github, autoSync: !prev.github.autoSync } }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${configDraft.github.autoSync ? 'bg-cyan-500' : 'bg-slate-800'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${configDraft.github.autoSync ? 'translate-x-6.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">Todos los Repositorios de GitHub ({liveRepos.length})</h4>
                        <p className="text-xs text-slate-400">Enciende o apaga repositorios, o conviértelos en Proyectos Destacados.</p>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-1 rounded border border-cyan-800/40">
                        {liveRepos.filter(r => !(configDraft.github.hiddenRepos || []).some(h => h.toLowerCase() === r.name.toLowerCase())).length} activos
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                      {liveRepos.map((repo) => {
                        const isHidden = (configDraft.github.hiddenRepos || []).some(r => r.toLowerCase() === repo.name.toLowerCase());
                        const isVisible = !isHidden;
                        return (
                          <div
                            key={repo.id || repo.name}
                            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                              isVisible ? 'bg-slate-950 border-slate-800' : 'bg-slate-950/40 border-slate-900 opacity-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Github className="w-4 h-4 text-slate-400" />
                              <span className="font-mono text-xs font-semibold text-white">{repo.name}</span>
                              {repo.language && (
                                <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                                  {repo.language}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Botón Destacar */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('projects');
                                  handleStartNewProject(repo);
                                }}
                                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-500/20 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                title="Promover a Proyecto Destacado"
                              >
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span>Destacar</span>
                              </button>

                              {/* Toggle Visible */}
                              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                                <span className={`text-xs font-mono ${isVisible ? 'text-cyan-400 font-semibold' : 'text-slate-500'}`}>
                                  {isVisible ? 'Mostrar' : 'Oculto'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleHiddenRepo(repo.name)}
                                  className={`w-10 h-5 rounded-full transition-colors relative ${isVisible ? 'bg-cyan-500' : 'bg-slate-800'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isVisible ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 3: PERFIL & DATOS DE CONTACTO                         */}
              {/* ========================================================= */}
              {activeTab === 'profile' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40">
                    <h4 className="text-sm font-bold text-white mb-1">Información de Contacto y Enlaces Directos</h4>
                    <p className="text-xs text-slate-400">
                      Modifica tus canales oficiales aquí. Los cambios se actualizarán al instante en la sección de Contacto, Navegación y Pie de página.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Correo Electrónico */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Correo Electrónico</span>
                      </label>
                      <input
                        type="email"
                        value={configDraft.personal.email || ''}
                        onChange={(e) => setConfigDraft(prev => ({ ...prev, personal: { ...prev.personal, email: e.target.value } }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        placeholder="williamfraile.trabajo@gmail.com"
                      />
                    </div>

                    {/* WhatsApp / Celular Texto */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp / Celular (Texto Visible)</span>
                      </label>
                      <input
                        type="text"
                        value={configDraft.personal.phone || ''}
                        onChange={(e) => setConfigDraft(prev => ({ ...prev, personal: { ...prev.personal, phone: e.target.value } }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        placeholder="(+57) 314 383 9318"
                      />
                    </div>

                    {/* Enlace WhatsApp Directo */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Enlace de WhatsApp (URL Directa)</span>
                      </label>
                      <input
                        type="url"
                        value={configDraft.personal.whatsappUrl || ''}
                        onChange={(e) => setConfigDraft(prev => ({ ...prev, personal: { ...prev.personal, whatsappUrl: e.target.value } }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        placeholder="https://wa.me/573143839318"
                      />
                    </div>

                    {/* LinkedIn URL */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                        <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                        <span>Perfil Profesional (LinkedIn URL)</span>
                      </label>
                      <input
                        type="url"
                        value={configDraft.personal.linkedinUrl || ''}
                        onChange={(e) => setConfigDraft(prev => ({ ...prev, personal: { ...prev.personal, linkedinUrl: e.target.value } }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        placeholder="https://www.linkedin.com/in/wyfb"
                      />
                    </div>

                    {/* GitHub URL */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                        <Github className="w-3.5 h-3.5 text-purple-400" />
                        <span>Código & Repositorios (GitHub URL)</span>
                      </label>
                      <input
                        type="url"
                        value={configDraft.personal.githubUrl || ''}
                        onChange={(e) => setConfigDraft(prev => ({ ...prev, personal: { ...prev.personal, githubUrl: e.target.value } }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        placeholder="https://github.com/williamfraile84"
                      />
                    </div>

                    {/* Nombre Completo */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Nombre Completo</span>
                      </label>
                      <input
                        type="text"
                        value={configDraft.personal.name || ''}
                        onChange={(e) => setConfigDraft(prev => ({ ...prev, personal: { ...prev.personal, name: e.target.value } }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        placeholder="William Yovany Fraile Bautista"
                      />
                    </div>
                  </div>

                  {/* Resumen Bio */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Resumen del Perfil (Bio)</label>
                    <textarea
                      rows="3"
                      value={configDraft.personal.bio || ''}
                      onChange={(e) => setConfigDraft(prev => ({ ...prev, personal: { ...prev.personal, bio: e.target.value } }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 4: PUBLICAR GLOBAL & EXPORTAR                         */}
              {/* ========================================================= */}
              {activeTab === 'export' && (
                <div className="space-y-6">
                  
                  {/* Tarjeta Principal: Publicación Directa en GitHub */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-slate-900 to-blue-950/40 border border-cyan-800/60 shadow-xl relative overflow-hidden">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white flex items-center gap-2">
                            <span>Publicar Globalmente en GitHub Pages</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-800 text-cyan-300">
                              Permanente Mundial
                            </span>
                          </h4>
                          <p className="text-xs text-slate-300">
                            Guarda tus cambios directamente en tu repositorio de GitHub para que cualquier visitante en el mundo los vea de inmediato.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Input de GitHub Token */}
                    <div className="space-y-3 mb-5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-cyan-400" />
                            <span>GitHub Personal Access Token (PAT)</span>
                          </label>
                          <a
                            href="https://github.com/settings/tokens/new?scopes=repo&description=Portafolio-Admin-AutoDeploy"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline"
                          >
                            <span>Generar Token en GitHub</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="relative">
                          <input
                            type={showToken ? "text" : "password"}
                            value={githubToken}
                            onChange={(e) => setGithubToken(e.target.value)}
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono pr-20"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setShowToken(!showToken)}
                              className="p-1 text-slate-400 hover:text-white"
                              title={showToken ? "Ocultar" : "Mostrar"}
                            >
                              {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            {githubToken && (
                              <button
                                type="button"
                                onClick={handleClearTokenOnly}
                                className="p-1 text-slate-500 hover:text-rose-400"
                                title="Borrar token"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          🔒 Se almacena únicamente en tu navegador (localStorage) y se utiliza para actualizar tu repositorio <code className="text-cyan-300 font-mono">williamfraile84/Portafolio</code>.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveTokenOnly}
                          disabled={!githubToken}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 border border-slate-700 transition-colors disabled:opacity-50"
                        >
                          Guardar Token en este Navegador
                        </button>
                      </div>
                    </div>

                    {/* Botón Principal de Publicación */}
                    <button
                      type="button"
                      onClick={handlePublishToGitHub}
                      disabled={isPublishing}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Guardando en GitHub y desplegando a nivel mundial...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-white" />
                          <span>🚀 Publicar Cambios en GitHub (Permanente para Todo el Mundo)</span>
                        </>
                      )}
                    </button>

                    {/* Feedback de publicación */}
                    {publishFeedback && (
                      <div className={`mt-4 p-4 rounded-xl text-xs flex items-start gap-3 ${
                        publishFeedback.success
                          ? 'bg-emerald-950/80 border border-emerald-800/80 text-emerald-200'
                          : 'bg-rose-950/80 border border-rose-800/80 text-rose-200'
                      }`}>
                        {publishFeedback.success ? (
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <p className="font-semibold">{publishFeedback.message}</p>
                          {publishFeedback.commitUrl && (
                            <a
                              href={publishFeedback.commitUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-cyan-300 underline font-mono text-[11px] mt-1"
                            >
                              <span>Ver commit en GitHub ({publishFeedback.commitSha})</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Respaldo Manual: Descargar / Copiar Código */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <h4 className="text-xs font-bold text-white mb-1">Respaldo Manual: Descargar o Copiar Código</h4>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Puedes descargar directamente el archivo <code className="text-cyan-400 font-mono">portfolio.config.js</code> generado con tus ajustes.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleDownloadFile}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Descargar portfolio.config.js</span>
                      </button>
                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copiar Código</span>
                      </button>
                    </div>
                  </div>

                  {/* Restablecer valores de fábrica */}
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={handleResetDefaults}
                      className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restablecer Configuración a Valores de Fábrica</span>
                    </button>
                  </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 5: SEGURIDAD                                          */}
              {/* ========================================================= */}
              {activeTab === 'security' && (
                <div className="max-w-md mx-auto py-4 space-y-4">
                  <div className="text-center mb-4">
                    <ShieldCheck className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                    <h4 className="text-base font-bold text-white">Cambiar Contraseña Maestra</h4>
                    <p className="text-xs text-slate-400">Actualiza la contraseña de acceso al panel secreto.</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Nueva Contraseña</label>
                      <input
                        type="password"
                        placeholder="Mínimo 6 caracteres..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Confirmar Contraseña</label>
                      <input
                        type="password"
                        placeholder="Repite la contraseña..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!newPassword || newPassword !== confirmPassword}
                      className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors disabled:opacity-50"
                    >
                      Actualizar Contraseña
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* Footer de Acciones Rápidas */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-slate-500">
                Panel Privado de Administración
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cerrar
                </button>
                <button
                  onClick={handlePublishToGitHub}
                  disabled={isPublishing}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:scale-102 transition-all disabled:opacity-60"
                >
                  {isPublishing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Publicar Globalmente</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
