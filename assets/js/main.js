(function() {
  "use strict";
  
  // Time-of-day theme: light for day, dark for night
  function setThemeForCurrentTime() {
    var hour = new Date().getHours();
    var theme = (hour >= 7 && hour < 20) ? "light" : "dark"; // 07:00–19:59 local time = light
    document.documentElement.setAttribute("data-theme", theme);
  }

  // Language switching functionality
  function initLanguageSwitcher() {
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (!langBtn || !langDropdown) return;
    
    // Toggle dropdown
    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      langDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      langDropdown.classList.remove('active');
    });
    
    // Handle language selection
    langOptions.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const selectedLang = this.getAttribute('data-lang');
        
        // Apply translations
        if (window.LanguageManager) {
          window.LanguageManager.applyTranslations(selectedLang);
        }
        
        // Close dropdown
        langDropdown.classList.remove('active');
        
        // Update active state
        langOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
  
  // Initialize everything when DOM is loaded
  function init() {
    setThemeForCurrentTime();
    
    // Initialize language system
    if (window.LanguageManager) {
      const currentLang = window.LanguageManager.initLanguage();
      
      // Mark current language as active
      const activeOption = document.querySelector(`[data-lang="${currentLang}"]`);
      if (activeOption) {
        activeOption.classList.add('active');
      }
    }
    
    // Initialize language switcher
    initLanguageSwitcher();
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
