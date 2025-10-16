// Переводы для сайта Prometheus AI
const translations = {
  ru: {
    // Meta
    title: "IT сфера, AI‑студия Prometheus AI™: внедрение искусственного интеллекта в бизнес‑процессы: автоматизация, чат‑боты, кастомные AI‑инструменты",
    description: "IT сфера, AI‑студия Prometheus AI™: внедрение искусственного интеллекта в бизнес‑процессы: автоматизация, чат‑боты, кастомные AI‑инструменты.",
    
    // Header
    brandAriaLabel: "Prometheus AI — на главную",
    socialAriaLabel: "Социальные ссылки",
    
    // Hero section
    heroTitle: "IT сфера, AI‑студия Prometheus AI™",
    heroLead: "Внедрение искусственного интеллекта в бизнес‑процессы: автоматизация, чат‑боты, кастомные AI‑инструменты.",
    
    // Footer
    footerCopyright: "© 2025 Prometheus AI™. Все права защищены.",
    
    // Language switcher
    langSwitch: "Язык",
    langRu: "Русский",
    langEn: "English",
    langZh: "中文",
    
    // Navigation
    navHome: "Главная",
    navPortfolio: "Портфолио",
    
    // Portfolio
    portfolioTitle: "Портфолио проектов",
    portfolioLead: "Примеры внедрения искусственного интеллекта в бизнес-процессы наших клиентов.",
    filterAll: "Все проекты",
    filterAutomation: "Автоматизация",
    filterChatbots: "Чат-боты",
    filterAiTools: "AI-инструменты",
    technologies: "Технологии:",
    viewDemo: "Демо",
    viewCode: "Код",
    viewCase: "Кейс",
    loading: "Загрузка проектов...",
    error: "Ошибка загрузки проектов",
    noProjects: "Проекты не найдены"
  },
  
  en: {
    // Meta
    title: "IT sector, AI studio Prometheus AI™: AI implementation in business processes: automation, chatbots, custom AI tools",
    description: "IT sector, AI studio Prometheus AI™: AI implementation in business processes: automation, chatbots, custom AI tools.",
    
    // Header
    brandAriaLabel: "Prometheus AI — to homepage",
    socialAriaLabel: "Social links",
    
    // Hero section
    heroTitle: "IT sector, AI studio Prometheus AI™",
    heroLead: "AI implementation in business processes: automation, chatbots, custom AI tools.",
    
    // Footer
    footerCopyright: "© 2025 Prometheus AI™. All rights reserved.",
    
    // Language switcher
    langSwitch: "Language",
    langRu: "Русский",
    langEn: "English",
    langZh: "中文",
    
    // Navigation
    navHome: "Home",
    navPortfolio: "Portfolio",
    
    // Portfolio
    portfolioTitle: "Project Portfolio",
    portfolioLead: "Examples of AI implementation in our clients' business processes.",
    filterAll: "All Projects",
    filterAutomation: "Automation",
    filterChatbots: "Chatbots",
    filterAiTools: "AI Tools",
    technologies: "Technologies:",
    viewDemo: "Demo",
    viewCode: "Code",
    viewCase: "Case Study",
    loading: "Loading projects...",
    error: "Error loading projects",
    noProjects: "No projects found"
  },
  
  zh: {
    // Meta
    title: "IT领域，AI工作室 Prometheus AI™：在业务流程中实施人工智能：自动化、聊天机器人、定制AI工具",
    description: "IT领域，AI工作室 Prometheus AI™：在业务流程中实施人工智能：自动化、聊天机器人、定制AI工具。",
    
    // Header
    brandAriaLabel: "Prometheus AI — 返回首页",
    socialAriaLabel: "社交链接",
    
    // Hero section
    heroTitle: "IT领域，AI工作室 Prometheus AI™",
    heroLead: "在业务流程中实施人工智能：自动化、聊天机器人、定制AI工具。",
    
    // Footer
    footerCopyright: "© 2025 Prometheus AI™. 版权所有。",
    
    // Language switcher
    langSwitch: "语言",
    langRu: "Русский",
    langEn: "English",
    langZh: "中文",
    
    // Navigation
    navHome: "首页",
    navPortfolio: "作品集",
    
    // Portfolio
    portfolioTitle: "项目作品集",
    portfolioLead: "我们客户业务流程中人工智能实施示例。",
    filterAll: "所有项目",
    filterAutomation: "自动化",
    filterChatbots: "聊天机器人",
    filterAiTools: "AI工具",
    technologies: "技术栈：",
    viewDemo: "演示",
    viewCode: "代码",
    viewCase: "案例研究",
    loading: "加载项目中...",
    error: "加载项目时出错",
    noProjects: "未找到项目"
  }
};

// Функция для получения перевода
function getTranslation(key, lang = 'ru') {
  return translations[lang]?.[key] || translations['ru'][key] || key;
}

// Функция для определения языка браузера
function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0]; // Получаем только код языка (ru, en, etc.)
  
  // Поддерживаемые языки
  const supportedLangs = ['ru', 'en', 'zh'];
  
  // Если язык браузера поддерживается, используем его, иначе русский по умолчанию
  return supportedLangs.includes(langCode) ? langCode : 'ru';
}

// Функция для применения переводов
function applyTranslations(lang = 'ru') {
  // Обновляем атрибут lang у html
  document.documentElement.setAttribute('lang', lang);
  
  // Обновляем title
  document.title = getTranslation('title', lang);
  
  // Обновляем meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', getTranslation('description', lang));
  }
  
  // Обновляем контент с data-i18n атрибутами
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(key, lang);
    
    if (element.tagName === 'INPUT' && element.type === 'text') {
      element.placeholder = translation;
    } else if (element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', translation);
    } else {
      element.textContent = translation;
    }
  });
  
  // Сохраняем выбранный язык
  localStorage.setItem('preferred-language', lang);
}

// Функция для инициализации языка
function initLanguage() {
  // Проверяем сохраненный язык
  const savedLang = localStorage.getItem('preferred-language');
  
  // Если есть сохраненный язык, используем его, иначе определяем по браузеру
  const lang = savedLang || detectBrowserLanguage();
  
  applyTranslations(lang);
  return lang;
}

// Экспортируем функции для использования в main.js
window.LanguageManager = {
  getTranslation,
  detectBrowserLanguage,
  applyTranslations,
  initLanguage
};