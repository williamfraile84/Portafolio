import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, KeyRound, Eye, EyeOff, Save, Download, Copy, RotateCcw, 
  X, Check, AlertTriangle, ShieldCheck, Github, Sliders, User, RefreshCw, Plus, Trash2, Mail, MessageCircle, Linkedin,
  Globe, Send, ExternalLink, Loader2, Key
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
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'github' | 'profile' | 'security' | 'export'
  
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

  useEffect(() => {
    if (isOpen) {
      setAuthed(isAuthenticated());
      setConfigDraft(JSON.parse(JSON.stringify(activeConfig)));
      setPassword('');
      setLoginError('');
      setStatusMsg({ text: '', type: '' });
      setPublishFeedback(null);
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
        hiddenList.splice(index, 1); // Quitar de ocultos (hacerlo visible)
      } else {
        hiddenList.push(repoName); // Agregar a ocultos
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

  // Guardar en navegador (localStorage) y notificar al estado reactivo principal
  const handleSaveToBrowser = () => {
    const res = saveActiveConfig(configDraft);
    if (res.success) {
      onConfigUpdated(configDraft);
      setStatusMsg({ text: '¡Configuración guardada en este navegador con éxito!', type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
    } else {
      setStatusMsg({ text: 'Error al guardar en el navegador: ' + res.error, type: 'error' });
    }
  };

  // Publicar directamente en GitHub Pages para todo el mundo
  const handlePublishToGitHub = async () => {
    if (!githubToken || !githubToken.trim()) {
      setActiveTab('export');
      setPublishFeedback({
        success: false,
        message: 'Ingresa tu Personal Access Token (PAT) de GitHub para poder publicar a nivel global.'
      });
      return;
    }

    setIsPublishing(true);
    setPublishFeedback(null);

    // 1. Guardar primero en local
    saveActiveConfig(configDraft);
    onConfigUpdated(configDraft);

    // 2. Publicar en GitHub
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
                onClick={() => setActiveTab('projects')}
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
              
              {/* TAB 1: PROYECTOS DESTACADOS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">Activar / Desactivar Proyectos Principales</h4>
                      <p className="text-xs text-slate-400">Los proyectos apagados no se mostrarán en la página a los visitantes.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {configDraft.featuredProjects.map((proj) => {
                      const isVisible = proj.visible !== false;
                      return (
                        <div
                          key={proj.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                            isVisible ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-950/30 border-slate-900 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={proj.thumbnail}
                              alt=""
                              className="w-14 h-10 rounded-lg object-cover border border-slate-800 flex-shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white">{proj.title}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                                  {proj.categoryLabel}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-1">{proj.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <span className={`text-xs font-mono font-semibold ${isVisible ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {isVisible ? 'Visible' : 'Oculto'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleProject(proj.id)}
                              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                                isVisible ? 'bg-emerald-500' : 'bg-slate-800'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                isVisible ? 'translate-x-6.5' : 'translate-x-0.5'
                              }`} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: GITHUB API & LISTA NEGRA */}
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
                        <p className="text-xs text-slate-400">Enciende o apaga cuáles repositorios deseas que aparezcan en el portafolio público.</p>
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

                            <div className="flex items-center gap-3">
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
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PERFIL & DATOS DE CONTACTO */}
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
                        placeholder="ejemplo@correo.com"
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

              {/* TAB 4: PUBLICAR GLOBAL & EXPORTAR */}
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

              {/* TAB 5: SEGURIDAD */}
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
