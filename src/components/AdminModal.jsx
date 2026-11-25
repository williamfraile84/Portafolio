import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, KeyRound, Eye, EyeOff, Save, Download, Copy, RotateCcw, 
  X, Check, AlertTriangle, ShieldCheck, Github, Sliders, User, RefreshCw, Plus, Trash2
} from 'lucide-react';
import { isAuthenticated, login, logout, changePassword } from '../services/authService';
import { saveActiveConfig, resetConfigToDefaults, downloadConfigFile, generateConfigCode } from '../services/configService';

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

  useEffect(() => {
    if (isOpen) {
      setAuthed(isAuthenticated());
      setConfigDraft(JSON.parse(JSON.stringify(activeConfig)));
      setPassword('');
      setLoginError('');
      setStatusMsg({ text: '', type: '' });
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
          // Si está explícitamente en false, poner true; si es true o undefined, poner false
          const isCurrentlyVisible = p.visible !== false;
          return { ...p, visible: !isCurrentlyVisible };
        }
        return p;
      });
      return { ...prev, featuredProjects: updated };
    });
  };

  // Toggle visibilidad de repo de GitHub en lista negra / oculta
  const handleToggleHiddenRepo = (repoName) => {
    setConfigDraft((prev) => {
      const hiddenList = [...prev.github.hiddenRepos];
      const index = hiddenList.findIndex((r) => r.toLowerCase() === repoName.toLowerCase());
      if (index >= 0) {
        hiddenList.splice(index, 1); // Quitar de ocultos (hacerlo visible)
      } else {
        hiddenList.push(repoName); // Agregar a ocultos
      }
      return {
        ...prev,
        github: { ...prev.github, hiddenRepos: hiddenList }
      };
    });
  };

  // Guardar cambios en el navegador
  const handleSaveToBrowser = () => {
    const res = saveActiveConfig(configDraft);
    if (res.success) {
      onConfigUpdated(configDraft);
      showFlash("¡Configuración guardada exitosamente en este navegador!", "success");
    } else {
      showFlash("Error al guardar: " + res.error, "error");
    }
  };

  // Restablecer por defecto
  const handleResetDefaults = () => {
    if (window.confirm("¿Seguro que deseas restablecer la configuración a los valores originales de portfolio.config.js?")) {
      const restored = resetConfigToDefaults();
      setConfigDraft(restored);
      onConfigUpdated(restored);
      showFlash("Configuración restablecida a los valores de fábrica.", "success");
    }
  };

  // Copiar código generado
  const handleCopyCode = () => {
    const code = generateConfigCode(configDraft);
    navigator.clipboard.writeText(code);
    showFlash("Código de portfolio.config.js copiado al portapapeles.", "success");
  };

  // Descargar archivo
  const handleDownloadFile = () => {
    downloadConfigFile(configDraft);
    showFlash("Descargando portfolio.config.js...", "success");
  };

  // Cambio de contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showFlash("Las contraseñas no coinciden.", "error");
      return;
    }
    const res = await changePassword(newPassword);
    if (res.success) {
      showFlash(res.message, "success");
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showFlash(res.message, "error");
    }
  };

  const showFlash = (text, type = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
      
      {/* Container Card */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* ========================================================= */}
        {/* VISTA 1: PANTALLA DE LOGIN DE SEGURIDAD                    */}
        {/* ========================================================= */}
        {!authed ? (
          <div className="p-8 sm:p-12 flex flex-col items-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 text-xs font-mono font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Autenticación Criptográfica SHA-256</span>
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-2">
              Panel Administrativo Secreto
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
              Ingresa tu contraseña maestra para activar, desactivar y gestionar los proyectos y repositorios visibles en tu portafolio.
            </p>

            <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña Maestra..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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

            <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
              Contraseña inicial: <code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded">WilliamAdmin2026!</code> o <code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded">admin123</code>
            </div>
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
                    <span>Panel de Control Secreto</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 border border-emerald-800 text-emerald-400">
                      Modo Admin Activo
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Gestiona la visibilidad de proyectos, sincronización con GitHub y configuraciones.
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
                👤 Perfil & Disponibilidad
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
              <button
                onClick={() => setActiveTab('export')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all ${
                  activeTab === 'export'
                    ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💾 Guardar & Exportar
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
                    <h4 className="text-sm font-bold text-white mb-1">Repositorios Detectados de GitHub</h4>
                    <p className="text-xs text-slate-400 mb-3">Enciende o apaga cuáles repositorios deseas que aparezcan en el portafolio público.</p>

                    <div className="space-y-2">
                      {liveRepos.map((repo) => {
                        const isHidden = configDraft.github.hiddenRepos.some(r => r.toLowerCase() === repo.name.toLowerCase());
                        const isVisible = !isHidden;
                        return (
                          <div
                            key={repo.id || repo.name}
                            className={`p-3 rounded-xl border flex items-center justify-between ${
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
                              <span className={`text-xs font-mono ${isVisible ? 'text-cyan-400' : 'text-slate-500'}`}>
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

              {/* TAB 3: PERFIL & DISPONIBILIDAD */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        value={configDraft.personal.name}
                        onChange={(e) => setConfigDraft(prev => ({ ...prev, personal: { ...prev.personal, name: e.target.value } }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Correo Electrónico</label>
                      <input
                        type="email"
                        value={configDraft.personal.email}
                        onChange={(e) => setConfigDraft(prev => ({ ...prev, personal: { ...prev.personal, email: e.target.value } }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Teléfono / WhatsApp</label>
                      <input
                        type="text"
                        value={configDraft.personal.phone}
                        onChange={(e) => setConfigDraft(prev => ({ ...prev, personal: { ...prev.personal, phone: e.target.value } }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Ubicación y Disponibilidad</label>
                      <input
                        type="text"
                        value={configDraft.personal.location}
                        onChange={(e) => setConfigDraft(prev => ({ ...prev, personal: { ...prev.personal, location: e.target.value } }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Resumen del Perfil (Bio)</label>
                    <textarea
                      rows="3"
                      value={configDraft.personal.bio}
                      onChange={(e) => setConfigDraft(prev => ({ ...prev, personal: { ...prev.personal, bio: e.target.value } }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: SEGURIDAD */}
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

              {/* TAB 5: GUARDAR & EXPORTAR */}
              {activeTab === 'export' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/50">
                    <h4 className="text-sm font-bold text-white mb-1">Opción A: Guardar en este Navegador</h4>
                    <p className="text-xs text-slate-300 mb-3">
                      Aplica tus cambios de inmediato en tu sesión local de Chrome/Edge sin necesidad de recompilar.
                    </p>
                    <button
                      onClick={handleSaveToBrowser}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-white font-semibold text-xs hover:bg-cyan-400 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios Locales</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-1">Opción B: Descargar o Copiar Código (Para todo el mundo)</h4>
                    <p className="text-xs text-slate-400 mb-4">
                      Para que los cambios sean permanentes para cualquier visitante de tu GitHub Pages en todo el mundo, descarga o copia el código y reemplaza <code className="text-cyan-400 font-mono">src/portfolio.config.js</code> en tu repositorio.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleDownloadFile}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
                      >
                        <Download className="w-4 h-4 text-cyan-400" />
                        <span>Descargar portfolio.config.js</span>
                      </button>
                      <button
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-emerald-400" />
                        <span>Copiar Código</span>
                      </button>
                    </div>
                  </div>

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

            </div>

            {/* Footer de Acciones Rápidas */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                Atajo de teclado para reabrir este panel: <kbd className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-cyan-400">Ctrl + Shift + A</kbd>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSaveToBrowser}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:scale-102 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Aplicar Cambios</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
