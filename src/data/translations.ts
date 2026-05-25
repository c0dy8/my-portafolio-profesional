export const translations = {
  es: {
    nav: {
      about: 'Acerca de',
      skills: 'Habilidades',
      projects: 'Proyectos',
      experience: 'Experiencia',
      contact: 'Contacto',
    },
    hero: {
      titles: ['Desarrollador Full Stack', 'Entusiasta IA', 'LLM Builder'],
      subtitle: 'Construyendo el puente entre software e inteligencia artificial — desde Medellín 🇨🇴',
      cta_projects: 'Ver proyectos',
      cta_contact: 'Contacto',
    },
    about: {
      label: '// sobre mí',
      heading: 'Hola, soy',
      bio: 'Soy Briam, desarrollador Full Stack con 1 año de experiencia y una fuerte inclinación hacia el mundo de la IA. Me especializo en construir aplicaciones que integran LLMs, RAG pipelines y sistemas inteligentes usando LangChain, LangFuse y técnicas de fine-tuning.',
      status: 'Disponible',
      contact_text: 'Contactar',
      download_cv: 'Descargar CV',
    },
    skills: {
      label: '// habilidades',
      heading: 'Stack técnico',
      subheading: 'Tecnologías con las que construyo soluciones Full Stack e IA.',
    },
    projects: {
      label: '// proyectos',
      heading: 'Proyectos',
      titles: ['Proyecto 01', 'Proyecto 02', 'Proyecto 03'],
      placeholder: 'Descripción próximamente. Este espacio está reservado para uno de mis proyectos más destacados.',
    },
    experience: {
      label: '// experiencia',
      heading: 'Experiencia',
      roles: [
        'Especialista de Soporte & Automatización',
        'Soporte IT Remoto · Robótica',
        'Restaurant Success Manager',
      ],
      descriptions: [
        'Atendí PQRs, disputas de pago y consultas de usuarios en una plataforma fintech de pagos digitales. Mi mayor impacto fue desarrollar una automatización con Playwright que transformó por completo el flujo de trabajo del equipo: en lugar de copiar manualmente cada correo y rellenar campos uno a uno en Salesforce, el script analiza el correo entrante, identifica el tipo de caso y completa todos los campos requeridos de forma automática — reduciendo el tiempo de creación de casos y eliminando errores humanos en el proceso.',
        'Brindé soporte IT remoto para los robots Flippy de Miso Robotics, unidades de cocina autónoma desplegadas en restaurantes de cadena en Estados Unidos. Mi trabajo consistía en monitorear el estado de los robots en tiempo real, detectar bloqueos o fallos operativos y resolverlos mediante comandos remotos sin interrumpir el servicio. Adicionalmente, redacté documentación técnica detallada por turno registrando incidentes, tiempos de respuesta y soluciones aplicadas, lo que servía como base para el equipo de ingeniería.',
        'Trabajé como punto de contacto principal para múltiples restaurantes aliados en la plataforma Uber Eats. Apoyé a los dueños en la configuración y optimización de sus tiendas digitales, diseño de campañas promocionales, organización de menús y resolución de problemas operativos dentro de la plataforma. Gestioné cuentas simultáneamente usando Salesforce y herramientas internas, asegurando que cada restaurante mantuviera visibilidad, rendimiento y una experiencia de cliente óptima.',
      ],
    },
    contact: {
      label: '// contacto',
      heading: '¿Hablamos?',
      subheading: 'Abierto a oportunidades, proyectos freelance y colaboraciones en IA. No dudes en escribir.',
      footer: '© 2025 Briam Vanegas',
      built: 'Built with React · TypeScript · Motion',
    },
  },
  en: {
    nav: {
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      experience: 'Experience',
      contact: 'Contact',
    },
    hero: {
      titles: ['Full Stack Developer', 'AI Enthusiast', 'LLM Builder'],
      subtitle: 'Building the bridge between software and artificial intelligence — from Medellín 🇨🇴',
      cta_projects: 'View projects',
      cta_contact: 'Contact',
    },
    about: {
      label: '// about',
      heading: "Hi, I'm",
      bio: "I'm Briam, a Full Stack Developer with 1 year of experience and a strong passion for AI. I specialize in building applications that integrate LLMs, RAG pipelines, and intelligent systems using LangChain, LangFuse, and fine-tuning techniques.",
      status: 'Available',
      contact_text: 'Contact',
      download_cv: 'Download CV',
    },
    skills: {
      label: '// skills',
      heading: 'Tech stack',
      subheading: 'Technologies I use to build Full Stack and AI solutions.',
    },
    projects: {
      label: '// projects',
      heading: 'Projects',
      titles: ['Project 01', 'Project 02', 'Project 03'],
      placeholder: 'Description coming soon. This space is reserved for one of my most notable projects.',
    },
    experience: {
      label: '// experience',
      heading: 'Experience',
      roles: [
        'Support Specialist & Process Automation',
        'Remote IT Support · Robotics',
        'Restaurant Success Manager',
      ],
      descriptions: [
        'Handled customer inquiries, payment disputes, and user requests for a digital payments fintech platform. My biggest impact was building a Playwright automation that transformed the team\'s workflow: instead of manually copying each email and filling fields one by one in Salesforce, the script analyzes incoming emails, identifies the case type, and fills all required fields automatically — cutting case creation time and eliminating human error in the process.',
        'Provided remote IT support for Miso Robotics\' Flippy robots, autonomous kitchen units deployed in chain restaurants across the United States. My role involved monitoring robot status in real time, detecting operational jams or failures, and resolving them via remote commands without interrupting service. I also produced detailed shift-based technical documentation logging incidents, response times, and applied solutions — serving as a reference for the engineering team.',
        'Served as the primary point of contact for multiple restaurant partners on the Uber Eats platform. Supported owners with digital storefront setup, promotional campaign design, menu organization, and operational issue resolution within the platform. Managed multiple accounts simultaneously using Salesforce and internal tools, ensuring each restaurant maintained strong visibility, performance, and an optimal customer experience.',
      ],
    },
    contact: {
      label: '// contact',
      heading: "Let's talk?",
      subheading: 'Open to opportunities, freelance projects, and AI collaborations. Feel free to reach out.',
      footer: '© 2025 Briam Vanegas',
      built: 'Built with React · TypeScript · Motion',
    },
  },
}

export type Lang = 'es' | 'en'
export type Translations = typeof translations['es']
