/**
 * CONFIGURACIÓN CENTRAL DEL PORTAFOLIO - WILLIAM YOVANY FRAILE BAUTISTA
 * 
 * Aquí puedes gestionar:
 * 1. Qué repositorios mostrar como Proyectos Destacados (con capturas HD y detalles).
 * 2. Qué repositorios ocultar para que no aparezcan en la sincronización en vivo.
 * 3. Nuevos proyectos que se sincronizan automáticamente con la API de GitHub.
 */

export const portfolioConfig = {
  personal: {
    name: "William Yovany Fraile Bautista",
    shortName: "William Fraile",
    title: "Ingeniero de Sistemas · Full Stack Developer · Seguridad & Auditoría de Software",
    bio: "Graduado de la Universidad de los Llanos y tecnólogo del SENA. Especializado en arquitecturas web modernas con React 19 y FastAPI, bases de datos SQL (PostgreSQL, SQLite WAL) e integración de hardware/automatización con Python. Aporto un valor diferencial único respaldado por proyectos de auditoría pericial forense y ciberseguridad bajo estándares OWASP Top 10 e ISO 25010.",
    email: "williamfraile84@gmail.com",
    phone: "(+57) 314 383 9318",
    whatsappUrl: "https://wa.me/573143839318",
    linkedinUrl: "https://www.linkedin.com/in/wyfb",
    githubUrl: "https://github.com/williamfraile84"
  },

  github: {
    username: "williamfraile84",
    autoSync: true,
    hiddenRepos: [
      "Portafolio"
    ]
  },

  // Catálogo completo de repositorios públicos conocidos del usuario en GitHub
  allKnownRepos: [
    { name: "Auditoria-CNG-web", language: "JavaScript", description: "Portal interactivo para dictamen pericial informático y auditoría forense" },
    { name: "Backend-Inventario", language: "Python", description: "API REST asíncrona FastAPI con persistencia dual SQLite WAL y PostgreSQL" },
    { name: "Backend-Remisiones", language: "Python", description: "Servicios FastAPI para control de remisiones y almacenamiento multi-cloud" },
    { name: "Cliente-Servidor", language: "Java", description: "Arquitectura cliente-servidor con sockets y concurrencia" },
    { name: "cliente_servidor", language: "Java", description: "Implementación de comunicación distribuida en Java" },
    { name: "Frontend-Inventario", language: "JavaScript", description: "SPA moderna para control de inventarios y facturación" },
    { name: "Frontend-Remisiones", language: "JavaScript", description: "Interfaz interactiva para conciliación y gestión de remisiones" },
    { name: "Fruver-POS", language: "Python", description: "Control de báscula serial, pesaje en tiempo real y automatización POS" },
    { name: "HANZI-APP", language: "Kotlin", description: "App Android nativa con Jetpack Compose y OCR offline" },
    { name: "Portafolio", language: "JavaScript", description: "Portafolio profesional en React 19 y Vite" },
    { name: "proyecto-final", language: "Java", description: "Proyecto de ingeniería de software en Java" },
    { name: "Software1-OIRI", language: "CSS", description: "Sistema y portal web institucional" },
    { name: "Sprint", language: "HTML", description: "Desarrollo y prototipado ágil" }
  ],

  // TUS 7 PROYECTOS PRINCIPALES (Curados con capturas reales y descripciones arquitectónicas)
  featuredProjects: [
    {
      id: "fruver-inventario",
      title: "FRUVER POS – Frontend Web SPA & PWA",
      category: "fullstack",
      categoryLabel: "🛒 Full Stack Web & PWA",
      repoUrl: "https://github.com/williamfraile84/Frontend-Inventario",
      companionRepoUrl: "https://github.com/williamfraile84/Backend-Inventario",
      companionRepoLabel: "Backend API",
      liveUrl: null,
      description: "Interfaz reactiva desacoplada para punto de venta, inventario en tiempo real y facturación de alta velocidad. Integra lectura en vivo de códigos de barra y QR con la cámara del dispositivo y procesamiento OCR.",
      techStack: ["React 19", "Vite", "Tailwind CSS 4", "html5-qrcode", "PWA Ready", "Axios", "Oxlint"],
      architecture: [
        "Frontend React 19 modular con arquitectura basada en componentes",
        "Lector de códigos de barra (EAN-13, Code128) y QR DIAN con cámara web",
        "Modo PWA con soporte offline para inventario en bodega"
      ],
      thumbnail: "https://raw.githubusercontent.com/williamfraile84/Frontend-Inventario/main/docs/screenshots/03_consulta_precios.png",
      gallery: [
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Frontend-Inventario/main/docs/screenshots/03_consulta_precios.png",
          caption: "Módulo de Consulta Rápida de Precios en Vivo y Stock"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Frontend-Inventario/main/docs/screenshots/04_catalogo_productos.png",
          caption: "Catálogo General de Productos con Búsqueda Instantánea y Filtros"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Frontend-Inventario/main/docs/screenshots/01_login_dark.png",
          caption: "Autenticación Segura (Modo Oscuro) con Roles de Cajero y Administrador"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Frontend-Inventario/main/docs/screenshots/06_bulk_price_editor.png",
          caption: "Editor Masivo de Precios y Actualización de Márgenes de Ganancia"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Frontend-Inventario/main/docs/screenshots/08_dian_qr_assistant_modal.png",
          caption: "Asistente de Escaneo QR Fiscal DIAN con Cámara Web en Tiempo Real"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Frontend-Inventario/main/docs/screenshots/10_mobile_view.png",
          caption: "Diseño 100% Responsivo adaptado a tablets y teléfonos de bodega"
        }
      ]
    },
    {
      id: "fruver-backend",
      title: "FRUVER POS – Backend API & Core Services",
      category: "backend",
      categoryLabel: "⚡ Backend API & Microservicios",
      repoUrl: "https://github.com/williamfraile84/Backend-Inventario",
      companionRepoUrl: "https://github.com/williamfraile84/Frontend-Inventario",
      companionRepoLabel: "Frontend SPA",
      liveUrl: null,
      description: "API REST asíncrona de alto desempeño construida sobre ASGI con FastAPI. Implementa una estrategia de persistencia dual: PostgreSQL en nube y SQLite con modo WAL (Write-Ahead Logging) para ultra-baja latencia local.",
      techStack: ["Python 3.12", "FastAPI", "SQLAlchemy 2.0", "SQLite WAL", "PostgreSQL", "Docker", "Pytest", "OCR Engine"],
      architecture: [
        "Arquitectura ASGI asíncrona no bloqueante",
        "SQLite WAL: lecturas concurrentes sin bloqueo de escrituras",
        "Módulo de procesamiento de imágenes OCR para captura de facturas",
        "Empaquetamiento reproducible con Docker y Docker Compose"
      ],
      thumbnail: "https://raw.githubusercontent.com/williamfraile84/Backend-Inventario/main/docs/screenshots/04_catalogo_productos.png",
      gallery: [
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Backend-Inventario/main/docs/screenshots/04_catalogo_productos.png",
          caption: "Esquemas Pydantic y Serialización de Catálogo en FastAPI"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Backend-Inventario/main/docs/screenshots/07_facturas_processor.png",
          caption: "Procesador de Facturas y Extracción OCR Automatizada"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Backend-Inventario/main/docs/screenshots/09_admin_panel_users.png",
          caption: "Gestión de Permisos, Roles y Logs de Auditoría en Base de Datos"
        }
      ]
    },
    {
      id: "fruver-hardware-pos",
      title: "FRUVER POS – Báscula Inteligente & Automatización Hardware",
      category: "hardware",
      categoryLabel: "⚖️ Hardware & Automatización",
      repoUrl: "https://github.com/williamfraile84/Fruver-POS",
      companionRepoUrl: null,
      liveUrl: null,
      description: "Solución integral de automatización e integración de hardware de punto de venta: lectura en tiempo real de básculas electrónicas seriales/USB, apertura de cajón monedero e impresión térmica ESC/POS con 49 tests automáticos.",
      techStack: ["Python 3.10+", "Playwright", "PySerial", "ESC/POS", "Pytest (49 Tests)", "Windows API"],
      architecture: [
        "Captura en tiempo real de peso bruto, neto y tara desde puertos COM seriales",
        "Inyección automatizada en sistemas de facturación web vía Playwright",
        "Batería de 49 pruebas automatizadas para tolerancia a desconexión de hardware"
      ],
      thumbnail: "https://raw.githubusercontent.com/williamfraile84/Fruver-POS/main/docs/assets/screenshots/01_pos_checkout_interface.png",
      gallery: [
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Fruver-POS/main/docs/assets/screenshots/01_pos_checkout_interface.png",
          caption: "Interfaz de Pesaje y Checkout en Tiempo Real con Báscula Conectada"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Fruver-POS/main/docs/assets/screenshots/02_modal_repeat_product_light.png",
          caption: "Detección de Productos Repetidos y Actualización Automática de Cantidad"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Fruver-POS/main/docs/assets/screenshots/04_modal_scale_zero_light.png",
          caption: "Control de Calibración de Báscula en Cero y Alertas de Desbalance"
        }
      ]
    },
    {
      id: "remisiones-ecosystem",
      title: "Sistema de Remisiones & Conciliación Multi-Cloud",
      category: "fullstack",
      categoryLabel: "📦 Multi-Cloud & Logística",
      repoUrl: "https://github.com/williamfraile84/Frontend-Remisiones",
      companionRepoUrl: "https://github.com/williamfraile84/Backend-Remisiones",
      companionRepoLabel: "Backend API (61 Tests)",
      liveUrl: null,
      description: "Sistema web empresarial de punta a punta para el control logístico, emisión de remisiones, pesaje de surtido y conciliación de costos. Incluye capa de almacenamiento documental redundante sincronizada en AWS S3 y Google Drive API.",
      techStack: ["FastAPI", "React 19", "AWS S3 (boto3)", "Google Drive API", "PostgreSQL", "Pytest (61 Tests)", "Pydantic"],
      architecture: [
        "Capa agnóstica de almacenamiento documental multi-proveedor (S3 + Drive)",
        "Suite de 61 pruebas unitarias e integración aprobadas al 100% con Pytest",
        "Calculadora automática de empaques, cestas, mermas y liquidación financiera"
      ],
      thumbnail: "https://raw.githubusercontent.com/williamfraile84/Frontend-Remisiones/main/docs/screenshots/02_dashboard_pedidos.png",
      gallery: [
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Frontend-Remisiones/main/docs/screenshots/02_dashboard_pedidos.png",
          caption: "Dashboard Central de Monitoreo de Pedidos y Estados de Remisiones"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Frontend-Remisiones/main/docs/screenshots/03_modal_ingreso_texto.png",
          caption: "Captura Rápida de Pedidos mediante Procesamiento de Texto Inteligente"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Frontend-Remisiones/main/docs/screenshots/04_modal_calculadora_empaque.png",
          caption: "Calculadora de Empaque y Conversión Automática de Cestas / Kilos"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Frontend-Remisiones/main/docs/screenshots/07_surtido_checklist_pesaje.png",
          caption: "Checklist de Pesaje Operativo en Báscula con Control de Mermas"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Frontend-Remisiones/main/docs/screenshots/09_modal_conciliacion_pos.png",
          caption: "Módulo de Conciliación Cruzada entre Remisiones de Bodega y Ventas POS"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Frontend-Remisiones/main/docs/screenshots/10_liquidacion_financiera.png",
          caption: "Liquidación Financiera y Generación de Comprobantes en AWS S3"
        }
      ]
    },
    {
      id: "auditoria-cng-web",
      title: "Portal Pericial & Dictamen Forense – Plataforma CNG",
      category: "auditoria",
      categoryLabel: "🛡️ Auditoría Forense & OWASP",
      repoUrl: "https://github.com/williamfraile84/Auditoria-CNG-web",
      companionRepoUrl: null,
      liveUrl: null,
      description: "Portal interactivo para la divulgación del dictamen pericial informático de la plataforma Centro de Negocios Ganaderos. Estructurado en 4 pilares: Ciberseguridad OWASP Top 10, Telemetría en vivo, Integridad DBA SQL Server RCSI y Calidad ISO 25010 / CMMI.",
      techStack: ["JavaScript", "HTML5", "CSS3", "OWASP Top 10", "ISO/IEC 25010", "ISO 31000", "CMMI", "SQL Server RCSI", "Azure Functions"],
      architecture: [
        "Metodología pericial formal en 4 dimensiones críticas de auditoría",
        "Telemetría en tiempo real de consumo y latencia de endpoints en Azure",
        "Evaluación de base de datos SQL Server y configuración de aislamiento RCSI",
        "Batería de 42 pruebas de carga, estrés y seguridad certificadas"
      ],
      thumbnail: "https://raw.githubusercontent.com/williamfraile84/Auditoria-CNG-web/gh-pages/assets/screenshots/view_01_landing.png",
      gallery: [
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Auditoria-CNG-web/gh-pages/assets/screenshots/view_01_landing.png",
          caption: "Landing Principal del Portal Pericial con Indicadores Ejecutivos"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Auditoria-CNG-web/gh-pages/assets/screenshots/view_03_estadisticas_publicas.png",
          caption: "Tablero de Estadísticas de Rendimiento, Disponibilidad y Métricas ISO 25010"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Auditoria-CNG-web/gh-pages/assets/screenshots/view_07_admin_fincas.png",
          caption: "Auditoría de Integridad de Datos en Gestión Ganadera y Trazabilidad"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Auditoria-CNG-web/gh-pages/assets/screenshots/evidence_backend_01_consola_azure_functions.png",
          caption: "Evidencia Backend: Consola de Azure Functions y Análisis de Latencia"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Auditoria-CNG-web/gh-pages/assets/screenshots/evidence_dba_01_sqlserver_config_rcsi.png",
          caption: "Evidencia DBA: Configuración de Aislamiento RCSI en SQL Server contra Deadlocks"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/Auditoria-CNG-web/gh-pages/assets/screenshots/stress_step5_remediacion_blindaje.png",
          caption: "Batería de Pruebas de Estrés y Plan de Remediación Técnico"
        }
      ]
    },
    {
      id: "hanzi-app",
      title: "HanziMemo · App Móvil Nativa Android & OCR 100% Offline",
      category: "mobile",
      categoryLabel: "📱 Android & Kotlin",
      repoUrl: "https://github.com/williamfraile84/HANZI-APP",
      companionRepoUrl: null,
      liveUrl: null,
      description: "Aplicación móvil nativa en Kotlin para aprendizaje acelerado mediante mnemotecnia visual, algoritmos de repetición espaciada (SRS) y reconocimiento óptico de caracteres (OCR) ejecutado 100% en el procesador del dispositivo móvil.",
      techStack: ["Kotlin 1.9", "Jetpack Compose", "Material 3", "Room Database (SQLite)", "Offline OCR", "MVI Architecture", "Android SDK"],
      architecture: [
        "Arquitectura MVI (Model-View-Intent) con flujo unidireccional de datos",
        "Pipeline de visión artificial OCR on-device con latencia cero y privacidad total",
        "Persistencia local con Room Database y algoritmo SRS basado en curva del olvido"
      ],
      thumbnail: "https://raw.githubusercontent.com/williamfraile84/HANZI-APP/main/docs/screenshots/01-diccionario-busqueda.png",
      gallery: [
        {
          url: "https://raw.githubusercontent.com/williamfraile84/HANZI-APP/main/docs/screenshots/01-diccionario-busqueda.png",
          caption: "Diccionario Mnemotécnico con Búsqueda Instantánea por Radical y Pinyin"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/HANZI-APP/main/docs/screenshots/02-detalle-mnemotecnico-superior.png",
          caption: "Descomposición Visual de Caracteres y Reglas de Memoria"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/HANZI-APP/main/docs/screenshots/03-detalle-animacion-trazos.png",
          caption: "Animación Vectorial del Orden de Trazos Caligráficos Guiados"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/HANZI-APP/main/docs/screenshots/04-flashcard-anverso.png",
          caption: "Flashcards Activas con Algoritmo de Repetición Espaciada (SRS)"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/HANZI-APP/main/docs/screenshots/06-caligrafia-trazo-activo.png",
          caption: "Lienzo de Escritura Táctil Interactiva con Retroalimentación de Precisión"
        },
        {
          url: "https://raw.githubusercontent.com/williamfraile84/HANZI-APP/main/docs/screenshots/07-progreso-metricas-estudio.png",
          caption: "Métricas de Retención de Memoria y Estadísticas de Aprendizaje"
        }
      ]
    }
  ]
};
