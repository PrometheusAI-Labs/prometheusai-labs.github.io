(function() {
  "use strict";
  // Time-of-day theme: light for day, dark for night
  function setThemeForCurrentTime() {
    var hour = new Date().getHours();
    var theme = (hour >= 7 && hour < 20) ? "light" : "dark"; // 07:00–19:59 local time = light
    document.documentElement.setAttribute("data-theme", theme);
  }

  setThemeForCurrentTime();
})();
