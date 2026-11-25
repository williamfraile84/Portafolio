# ⚡ Portafolio Profesional en React 19 & Vite – William Fraile

Portafolio web interactivo de alto rendimiento desarrollado con **React 19, Vite, Tailwind CSS y Lucide Icons**, diseñado con sincronización en tiempo real con la **API pública de GitHub** y control granular para mostrar, destacar u ocultar proyectos.

[🌐 Demo en Vivo en GitHub Pages](https://williamfraile84.github.io/Portafolio/) · [⚙️ Configuración de Proyectos](#️-cómo-seleccionar-qué-mostrar-u-ocultar) · [🚀 Despliegue](#-despliegue-en-github-pages)

---

## 🔐 Panel de Control Secreto & Seguridad (Vista Admin)

El portafolio cuenta con una **vista administrativa secreta protegida por contraseña criptográfica (SHA-256)** que te permite encender y apagar proyectos, cambiar visibilidad de repositorios y modificar datos sin tocar código:

### Cómo Acceder al Panel Secreto:
Puedes abrir la vista secreta de 4 maneras distintas:
1. **Atajo de Teclado Global:** Presiona <kbd>Ctrl + Shift + A</kbd> (o <kbd>Cmd + Shift + A</kbd> en Mac) en cualquier parte de la página.
2. **Acceso Directo por URL:** Abre tu navegador con el hash `#admin`:  
   👉 `https://williamfraile84.github.io/Portafolio/#admin` (o `http://localhost:5173/Portafolio/#admin`).
3. **Disparador Oculto en el Logo:** Haz **3 clics rápidos seguidos** sobre el logo **WF** en la esquina superior izquierda del navbar.
4. **Disparador Discreto en el Footer:** Haz clic sobre el pequeño icono de candado en el pie de página junto al copyright.

### Credenciales y Seguridad Criptográfica:
- **Contraseña Maestra Inicial:** `WilliamAdmin2026!` o `admin123`.
- **Protección contra Fuerza Bruta:** Cuenta con bloqueo automático de 2 minutos tras 5 intentos fallidos consecutivos.
- **Cambio de Contraseña:** Dentro de la pestaña *Seguridad* del panel puedes cambiar tu contraseña maestra cuando desees.
- **Persistencia Local Inmediata:** Los cambios que guardes con *"Guardar Cambios Locales"* se aplican de inmediato en tu navegador.
- **Exportación Global:** Desde la pestaña *Guardar & Exportar*, puedes descargar o copiar el archivo `portfolio.config.js` actualizado con 1 solo clic para sincronizarlo permanentemente con tu repositorio de GitHub para todos los visitantes del mundo.

---

## 🌟 Características Principales

1. **Dogfooding & Credibilidad Técnica:** Construido 100% en **React 19**, demostrando de forma directa tus habilidades en desarrollo frontend moderno ante reclutadores y líderes técnicos.
2. **Sincronización Automática con GitHub API:** Cada vez que crees un nuevo repositorio público en tu cuenta `williamfraile84`, el portafolio lo detecta y lo muestra en la pestaña **"Nuevos Repos en Vivo"** sin que tengas que tocar una sola línea de código.
3. **Control Total (Mostrar, Destacar u Ocultar):** A través del archivo `src/portfolio.config.js`, puedes:
   - Configurar tus **7 proyectos insignia** con capturas de pantalla HD y desgloses de arquitectura.
   - Ocultar repositorios de prueba o antiguos agregándolos al array `hiddenRepos`.
4. **Visor de Capturas en Alta Resolución (Lightbox):** Modal interactivo integrado que permite explorar las interfaces de cada sistema con navegación por teclado (`←`, `→`, `Esc`).
5. **Despliegue Continuo (CI/CD):** Flujo de GitHub Actions preconfigurado en `.github/workflows/deploy.yml` que compila y publica automáticamente en cada `git push`.

---

## 🔐 Panel de Control Secreto & Seguridad (Vista Admin)

El portafolio cuenta con una **vista administrativa secreta protegida por contraseña criptográfica (SHA-256)** que te permite encender y apagar proyectos, cambiar visibilidad de repositorios y modificar datos sin tocar código:

### Cómo Acceder al Panel Secreto:
Puedes abrir la vista secreta de 4 maneras distintas:
1. **Atajo de Teclado Global:** Presiona <kbd>Ctrl + Shift + A</kbd> (o <kbd>Cmd + Shift + A</kbd> en Mac) en cualquier parte de la página.
2. **Acceso Directo por URL:** Abre tu navegador con el hash `#admin`:  
   👉 `https://williamfraile84.github.io/Portafolio/#admin` (o `http://localhost:5173/Portafolio/#admin`).
3. **Disparador Oculto en el Logo:** Haz **3 clics rápidos seguidos** sobre el logo **WF** en la esquina superior izquierda del navbar.
4. **Disparador Discreto en el Footer:** Haz clic sobre el pequeño icono de candado en el pie de página junto al copyright.

### Credenciales y Seguridad Criptográfica:
- **Contraseña Maestra Inicial:** `WilliamAdmin2026!` o `admin123`.
- **Protección contra Fuerza Bruta:** Cuenta con bloqueo automático de 2 minutos tras 5 intentos fallidos consecutivos.
- **Cambio de Contraseña:** Dentro de la pestaña *Seguridad* del panel puedes cambiar tu contraseña maestra cuando desees.
- **Persistencia Local Inmediata:** Los cambios que guardes con *"Guardar Cambios Locales"* se aplican de inmediato en tu navegador.
- **Exportación Global:** Desde la pestaña *Guardar & Exportar*, puedes descargar o copiar el archivo `portfolio.config.js` actualizado con 1 solo clic para sincronizarlo permanentemente con tu repositorio de GitHub para todos los visitantes del mundo.

---

## ⚙️ Cómo Seleccionar Qué Mostrar u Ocultar

Edita el archivo [`src/portfolio.config.js`](./src/portfolio.config.js):

### 1. Para Ocultar Repositorios Secundarios o de Prueba:
Agrega el nombre del repositorio en `hiddenRepos`:

```javascript
github: {
  username: "williamfraile84",
  autoSync: true,
  hiddenRepos: [
    "Sprint",
    "Software1-OIRI",
    "cliente_servidor",
    "mi-repo-privado-o-de-prueba" // <-- Agrega aquí cualquier repo que no quieras mostrar
  ]
}
```

### 2. Para Promover un Nuevo Repositorio a "Proyecto Destacado":
Simplemente agrega un nuevo objeto dentro del array `featuredProjects` con su título, descripción, badges y capturas:

```javascript
featuredProjects: [
  // ... tus proyectos actuales
  {
    id: "mi-nuevo-proyecto",
    title: "Nombre del Proyecto",
    category: "fullstack",
    categoryLabel: "🚀 Nuevo Lanzamiento",
    repoUrl: "https://github.com/williamfraile84/mi-nuevo-proyecto",
    description: "Descripción detallada del sistema...",
    techStack: ["React 19", "FastAPI", "Docker"],
    thumbnail: "URL_DE_CAPTURA",
    gallery: [
      { url: "URL_DE_CAPTURA_1", caption: "Vista Principal" }
    ]
  }
]
```

---

## 🔐 Panel de Control Secreto & Seguridad (Vista Admin)

El portafolio cuenta con una **vista administrativa secreta protegida por contraseña criptográfica (SHA-256)** que te permite encender y apagar proyectos, cambiar visibilidad de repositorios y modificar datos sin tocar código:

### Cómo Acceder al Panel Secreto:
Puedes abrir la vista secreta de 4 maneras distintas:
1. **Atajo de Teclado Global:** Presiona <kbd>Ctrl + Shift + A</kbd> (o <kbd>Cmd + Shift + A</kbd> en Mac) en cualquier parte de la página.
2. **Acceso Directo por URL:** Abre tu navegador con el hash `#admin`:  
   👉 `https://williamfraile84.github.io/Portafolio/#admin` (o `http://localhost:5173/Portafolio/#admin`).
3. **Disparador Oculto en el Logo:** Haz **3 clics rápidos seguidos** sobre el logo **WF** en la esquina superior izquierda del navbar.
4. **Disparador Discreto en el Footer:** Haz clic sobre el pequeño icono de candado en el pie de página junto al copyright.

### Credenciales y Seguridad Criptográfica:
- **Contraseña Maestra Inicial:** `WilliamAdmin2026!` o `admin123`.
- **Protección contra Fuerza Bruta:** Cuenta con bloqueo automático de 2 minutos tras 5 intentos fallidos consecutivos.
- **Cambio de Contraseña:** Dentro de la pestaña *Seguridad* del panel puedes cambiar tu contraseña maestra cuando desees.
- **Persistencia Local Inmediata:** Los cambios que guardes con *"Guardar Cambios Locales"* se aplican de inmediato en tu navegador.
- **Exportación Global:** Desde la pestaña *Guardar & Exportar*, puedes descargar o copiar el archivo `portfolio.config.js` actualizado con 1 solo clic para sincronizarlo permanentemente con tu repositorio de GitHub para todos los visitantes del mundo.

---

## 🛠️ Ejecución Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en [http://localhost:5173/Portafolio/](http://localhost:5173/Portafolio/)

---

## 🔐 Panel de Control Secreto & Seguridad (Vista Admin)

El portafolio cuenta con una **vista administrativa secreta protegida por contraseña criptográfica (SHA-256)** que te permite encender y apagar proyectos, cambiar visibilidad de repositorios y modificar datos sin tocar código:

### Cómo Acceder al Panel Secreto:
Puedes abrir la vista secreta de 4 maneras distintas:
1. **Atajo de Teclado Global:** Presiona <kbd>Ctrl + Shift + A</kbd> (o <kbd>Cmd + Shift + A</kbd> en Mac) en cualquier parte de la página.
2. **Acceso Directo por URL:** Abre tu navegador con el hash `#admin`:  
   👉 `https://williamfraile84.github.io/Portafolio/#admin` (o `http://localhost:5173/Portafolio/#admin`).
3. **Disparador Oculto en el Logo:** Haz **3 clics rápidos seguidos** sobre el logo **WF** en la esquina superior izquierda del navbar.
4. **Disparador Discreto en el Footer:** Haz clic sobre el pequeño icono de candado en el pie de página junto al copyright.

### Credenciales y Seguridad Criptográfica:
- **Contraseña Maestra Inicial:** `WilliamAdmin2026!` o `admin123`.
- **Protección contra Fuerza Bruta:** Cuenta con bloqueo automático de 2 minutos tras 5 intentos fallidos consecutivos.
- **Cambio de Contraseña:** Dentro de la pestaña *Seguridad* del panel puedes cambiar tu contraseña maestra cuando desees.
- **Persistencia Local Inmediata:** Los cambios que guardes con *"Guardar Cambios Locales"* se aplican de inmediato en tu navegador.
- **Exportación Global:** Desde la pestaña *Guardar & Exportar*, puedes descargar o copiar el archivo `portfolio.config.js` actualizado con 1 solo clic para sincronizarlo permanentemente con tu repositorio de GitHub para todos los visitantes del mundo.

---

## 🚀 Despliegue en GitHub Pages (`williamfraile84/Portafolio`)

### Método 1: Despliegue Automático con GitHub Actions (Recomendado)

1. Sube todo el código de esta carpeta `portafolio-react` a la rama `main` de tu repositorio [williamfraile84/Portafolio](https://github.com/williamfraile84/Portafolio):
   ```bash
   git init
   git remote add origin https://github.com/williamfraile84/Portafolio.git
   git add .
   git commit -m "feat: migración a React 19 con sincronización automática de GitHub API"
   git branch -M main
   git push -u origin main --force
   ```
2. En GitHub, ve a **Settings** -> **Pages** en tu repositorio:
   - En **Build and deployment** -> **Source**, selecciona **GitHub Actions**.
3. ¡Listo! Cada vez que hagas `git push`, GitHub Actions compilará y actualizará tu portafolio automáticamente.

---

## 🔐 Panel de Control Secreto & Seguridad (Vista Admin)

El portafolio cuenta con una **vista administrativa secreta protegida por contraseña criptográfica (SHA-256)** que te permite encender y apagar proyectos, cambiar visibilidad de repositorios y modificar datos sin tocar código:

### Cómo Acceder al Panel Secreto:
Puedes abrir la vista secreta de 4 maneras distintas:
1. **Atajo de Teclado Global:** Presiona <kbd>Ctrl + Shift + A</kbd> (o <kbd>Cmd + Shift + A</kbd> en Mac) en cualquier parte de la página.
2. **Acceso Directo por URL:** Abre tu navegador con el hash `#admin`:  
   👉 `https://williamfraile84.github.io/Portafolio/#admin` (o `http://localhost:5173/Portafolio/#admin`).
3. **Disparador Oculto en el Logo:** Haz **3 clics rápidos seguidos** sobre el logo **WF** en la esquina superior izquierda del navbar.
4. **Disparador Discreto en el Footer:** Haz clic sobre el pequeño icono de candado en el pie de página junto al copyright.

### Credenciales y Seguridad Criptográfica:
- **Contraseña Maestra Inicial:** `WilliamAdmin2026!` o `admin123`.
- **Protección contra Fuerza Bruta:** Cuenta con bloqueo automático de 2 minutos tras 5 intentos fallidos consecutivos.
- **Cambio de Contraseña:** Dentro de la pestaña *Seguridad* del panel puedes cambiar tu contraseña maestra cuando desees.
- **Persistencia Local Inmediata:** Los cambios que guardes con *"Guardar Cambios Locales"* se aplican de inmediato en tu navegador.
- **Exportación Global:** Desde la pestaña *Guardar & Exportar*, puedes descargar o copiar el archivo `portfolio.config.js` actualizado con 1 solo clic para sincronizarlo permanentemente con tu repositorio de GitHub para todos los visitantes del mundo.

---

### Método 2: Compilación Manual y Despliegue Estático

Si prefieres compilar en tu computadora y subir los archivos generados:

```bash
npm run build
```

Esto generará la carpeta `dist/`. Sube el contenido de `dist/` a la raíz de tu repositorio y configura GitHub Pages para servir desde la rama `main` (raíz `/`).
