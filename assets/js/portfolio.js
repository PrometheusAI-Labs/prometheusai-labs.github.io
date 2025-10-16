(function() {
  "use strict";
  
  // Конфигурация
  const CONFIG = {
    projectsFile: './data/projects.json',
    animationDelay: 100 // Задержка между анимациями карточек
  };
  
  // Глобальные переменные
  let projects = [];
  let filteredProjects = [];
  let currentFilter = 'all';
  
  // Инициализация портфолио
  function initPortfolio() {
    loadProjects();
    initFilters();
    initTVEffect();
    initProjectModal();
  }
  
  // Загрузка проектов из JSON
  async function loadProjects() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    try {
      loadingIndicator.style.display = 'block';
      errorMessage.style.display = 'none';
      
      const response = await fetch(CONFIG.projectsFile);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      projects = await response.json();
      filteredProjects = [...projects];
      
      loadingIndicator.style.display = 'none';
      renderProjects();
      
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
      loadingIndicator.style.display = 'none';
      errorMessage.style.display = 'block';
    }
  }
  
  // Рендеринг проектов
  function renderProjects() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    if (!portfolioGrid) return;
    
    // Очищаем сетку
    portfolioGrid.innerHTML = '';
    
    if (filteredProjects.length === 0) {
      portfolioGrid.innerHTML = '<div class="no-projects" data-i18n="noProjects">Проекты не найдены</div>';
      return;
    }
    
    // Создаем карточки проектов
    filteredProjects.forEach((project, index) => {
      const card = createProjectCard(project, index);
      portfolioGrid.appendChild(card);
    });
  }
  
  // Создание карточки проекта
  function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.style.animationDelay = `${index * CONFIG.animationDelay}ms`;
    card.setAttribute('data-project-id', project.id);
    
    // Формируем HTML карточки
    card.innerHTML = `
      <div class="portfolio-card-header">
        <div class="portfolio-card-category" data-category="${project.category}">
          ${getCategoryName(project.category)}
        </div>
        <h3 class="portfolio-card-title">${project.title}</h3>
        <p class="portfolio-card-description">${project.description}</p>
      </div>
      
      ${project.technologies ? `
        <div class="portfolio-card-tech">
          <div class="portfolio-card-tech-title" data-i18n="technologies">Технологии:</div>
          <div class="portfolio-card-tech-list">
            ${project.technologies.map(tech => 
              `<span class="portfolio-card-tech-item">${tech}</span>`
            ).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="portfolio-card-links">
        ${project.demo ? 
          `<a href="${project.demo}" target="_blank" rel="noopener" class="portfolio-card-link" data-i18n="viewDemo">Демо</a>` : 
          `<span class="portfolio-card-link" data-i18n="viewDemo">Демо</span>`
        }
        ${project.github ? 
          `<a href="${project.github}" target="_blank" rel="noopener" class="portfolio-card-link" data-i18n="viewCode">Код</a>` : 
          `<span class="portfolio-card-link" data-i18n="viewCode">Код</span>`
        }
        ${project.case ? 
          `<a href="${project.case}" target="_blank" rel="noopener" class="portfolio-card-link" data-i18n="viewCase">Кейс</a>` : 
          `<span class="portfolio-card-link" data-i18n="viewCase">Кейс</span>`
        }
      </div>
      
      <div class="portfolio-card-expand">
        <button class="portfolio-card-expand-btn" data-i18n="viewDetails" aria-label="Открыть детали проекта">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          Подробнее
        </button>
      </div>
    `;
    
    // Добавляем обработчик клика для открытия модального окна
    card.addEventListener('click', function(e) {
      // Проверяем, что клик не по ссылке
      if (!e.target.closest('a') && !e.target.closest('button')) {
        openProjectModal(project);
      }
    });
    
    // Обработчик для кнопки "Подробнее"
    const expandBtn = card.querySelector('.portfolio-card-expand-btn');
    if (expandBtn) {
      expandBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openProjectModal(project);
      });
    }
    
    return card;
  }
  
  // Получение названия категории
  function getCategoryName(category) {
    const categoryNames = {
      'automation': 'Автоматизация',
      'chatbots': 'Чат-боты',
      'ai-tools': 'AI-инструменты',
      'analytics': 'Аналитика',
      'integration': 'Интеграция'
    };
    return categoryNames[category] || category;
  }
  
  // Инициализация фильтров
  function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        
        // Проверяем, не тот ли это уже активный фильтр
        if (this.classList.contains('active')) {
          return;
        }
        
        // Обновляем активную кнопку
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Фильтруем проекты с эффектом
        filterProjects(filter);
      });
    });
  }
  
  // Фильтрация проектов
  function filterProjects(filter) {
    currentFilter = filter;
    
    if (filter === 'all') {
      filteredProjects = [...projects];
    } else {
      filteredProjects = projects.filter(project => project.category === filter);
    }
    
    // Анимация скрытия/показа карточек с эффектом телевизора
    animateFilterTransitionWithTVEffect();
  }
  
  // Анимация перехода при фильтрации
  function animateFilterTransition() {
    const cards = document.querySelectorAll('.portfolio-card');
    
    // Скрываем все карточки
    cards.forEach(card => {
      card.classList.add('hidden');
    });
    
    // Показываем нужные карточки через небольшую задержку
    setTimeout(() => {
      renderProjects();
    }, 300);
  }

  // Анимация перехода при фильтрации с эффектом телевизора
  function animateFilterTransitionWithTVEffect() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    const overlay = document.querySelector('.tv-effect-overlay');
    const scanlines = document.querySelector('.tv-scanlines');
    
    if (portfolioGrid && overlay) {
      // Эффект выключения
      portfolioGrid.classList.add('tv-turn-off');
      overlay.classList.add('active');
      if (scanlines) scanlines.classList.add('active');
      
      // Через половину времени анимации показываем новые карточки
      setTimeout(() => {
        renderProjects();
        // Эффект включения
        portfolioGrid.classList.remove('tv-turn-off');
        portfolioGrid.classList.add('tv-turn-on');
        
        // Убираем оверлей и сканирующие линии
        setTimeout(() => {
          overlay.classList.remove('active');
          if (scanlines) scanlines.classList.remove('active');
          portfolioGrid.classList.remove('tv-turn-on');
        }, 300);
      }, 400);
    } else {
      // Fallback к обычной анимации
      animateFilterTransition();
    }
  }
  
  // Поиск по проектам
  function searchProjects(query) {
    if (!query.trim()) {
      filteredProjects = [...projects];
    } else {
      const searchTerm = query.toLowerCase();
      filteredProjects = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        (project.technologies && project.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm)
        ))
      );
    }
    
    renderProjects();
  }

  // Инициализация эффекта выключающегося телевизора
  function initTVEffect() {
    // Создаем оверлей для эффекта
    const overlay = document.createElement('div');
    overlay.className = 'tv-effect-overlay';
    document.body.appendChild(overlay);

    // Создаем эффект сканирующих линий
    const scanlines = document.createElement('div');
    scanlines.className = 'tv-scanlines';
    document.body.appendChild(scanlines);

    // Обработчик переключения вкладок
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        // Страница скрыта - эффект выключения
        triggerTVTurnOff();
      } else {
        // Страница видна - эффект включения
        triggerTVTurnOn();
      }
    });

    // Обработчик фокуса/потери фокуса окна
    window.addEventListener('blur', function() {
      triggerTVTurnOff();
    });

    window.addEventListener('focus', function() {
      triggerTVTurnOn();
    });
  }

  // Эффект выключения телевизора
  function triggerTVTurnOff() {
    const overlay = document.querySelector('.tv-effect-overlay');
    const scanlines = document.querySelector('.tv-scanlines');
    const main = document.querySelector('main');
    
    if (overlay && main) {
      overlay.classList.add('active');
      if (scanlines) scanlines.classList.add('active');
      main.classList.add('tv-turn-off');
    }
  }

  // Эффект включения телевизора
  function triggerTVTurnOn() {
    const overlay = document.querySelector('.tv-effect-overlay');
    const scanlines = document.querySelector('.tv-scanlines');
    const main = document.querySelector('main');
    
    if (overlay && main) {
      // Убираем эффект выключения
      main.classList.remove('tv-turn-off');
      main.classList.add('tv-turn-on');
      
      // Добавляем эффект мерцания
      main.classList.add('tv-flicker');
      
      // Убираем оверлей и сканирующие линии через небольшую задержку
      setTimeout(() => {
        overlay.classList.remove('active');
        if (scanlines) scanlines.classList.remove('active');
        main.classList.remove('tv-turn-on');
        
        // Убираем мерцание через еще одну задержку
        setTimeout(() => {
          main.classList.remove('tv-flicker');
        }, 200);
      }, 600);
    }
  }
  
  // Инициализация модального окна проекта
  function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const overlay = document.getElementById('projectModalOverlay');
    const closeBtn = document.getElementById('projectModalClose');
    
    if (!modal || !overlay || !closeBtn) return;
    
    // Закрытие по клику на оверлей
    overlay.addEventListener('click', closeProjectModal);
    
    // Закрытие по клику на кнопку закрытия
    closeBtn.addEventListener('click', closeProjectModal);
    
    // Закрытие по нажатию Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }
  
  // Открытие модального окна проекта
  function openProjectModal(project) {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    // Заполняем данные проекта
    document.getElementById('projectModalCategory').textContent = getCategoryName(project.category);
    document.getElementById('projectModalTitle').textContent = project.title;
    document.getElementById('projectModalYear').textContent = project.year || '2024';
    document.getElementById('projectModalClient').textContent = project.client || 'Конфиденциально';
    document.getElementById('projectModalDescription').textContent = project.description;
    document.getElementById('projectModalResultsText').textContent = project.results || 'Результаты не указаны';
    
    // Устанавливаем изображение
    const image = document.getElementById('projectModalImage');
    if (image && project.image) {
      image.src = project.image;
      image.alt = `Изображение проекта: ${project.title}`;
    }
    
    // Заполняем технологии
    const techList = document.getElementById('projectModalTechList');
    if (techList && project.technologies) {
      techList.innerHTML = project.technologies.map(tech => 
        `<span class="project-modal-tech-item">${tech}</span>`
      ).join('');
    }
    
    // Настраиваем ссылки
    const demoLink = document.getElementById('projectModalDemo');
    const githubLink = document.getElementById('projectModalGithub');
    const caseLink = document.getElementById('projectModalCase');
    
    if (demoLink) {
      if (project.demo) {
        demoLink.href = project.demo;
        demoLink.style.display = 'flex';
      } else {
        demoLink.href = '#';
        demoLink.style.display = 'flex';
      }
    }
    
    if (githubLink) {
      if (project.github) {
        githubLink.href = project.github;
        githubLink.style.display = 'flex';
      } else {
        githubLink.href = '#';
        githubLink.style.display = 'flex';
      }
    }
    
    if (caseLink) {
      if (project.case) {
        caseLink.href = project.case;
        caseLink.style.display = 'flex';
      } else {
        caseLink.href = '#';
        caseLink.style.display = 'flex';
      }
    }
    
    // Показываем модальное окно
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Фокус на кнопке закрытия для доступности
    setTimeout(() => {
      closeBtn.focus();
    }, 100);
  }
  
  // Закрытие модального окна проекта
  function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Экспорт функций для внешнего использования
  window.PortfolioManager = {
    initPortfolio,
    searchProjects,
    filterProjects,
    loadProjects,
    openProjectModal,
    closeProjectModal
  };
  
  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initPortfolio();
      // Эффект включения при загрузке страницы
      setTimeout(() => {
        triggerTVTurnOn();
      }, 100);
    });
  } else {
    initPortfolio();
    // Эффект включения при загрузке страницы
    setTimeout(() => {
      triggerTVTurnOn();
    }, 100);
  }
})();