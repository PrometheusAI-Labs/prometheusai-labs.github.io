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
    langEn: "English"
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
    langEn: "English"
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
  const supportedLangs = ['ru', 'en'];
  
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