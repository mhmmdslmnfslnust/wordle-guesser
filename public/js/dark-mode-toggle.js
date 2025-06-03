/**
 * Dark Mode Toggle Functionality
 */

// Wrap all code in an IIFE to avoid global variable conflicts
(function() {
  // Check for user preference
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme');

  // Set initial theme based on stored preference or system preference
  if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
    document.documentElement.classList.remove('dark-mode');
  }

  // Initialize dark mode toggle
  function initDarkModeToggle() {
    // Add event listener to document for capturing dark mode toggle clicks
    document.body.addEventListener('click', (e) => {
      if (e.target.closest('.dark-mode-toggle')) {
        // Toggle dark mode class on both body and html elements
        document.body.classList.toggle('dark-mode');
        document.documentElement.classList.toggle('dark-mode');
        
        // Store preference
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      }
    });
    
    // Create and insert a toggle button if it doesn't exist already
    if (!document.querySelector('.dark-mode-toggle')) {
      const appHeader = document.querySelector('header') || document.getElementById('root');
      if (appHeader) {
        // Create a container for the toggle if needed
        let container = appHeader.querySelector('.toggle-container');
        
        if (!container) {
          container = document.createElement('div');
          container.className = 'toggle-container';
          container.style.position = 'absolute';
          container.style.right = '20px';
          container.style.top = '20px';
          container.style.zIndex = '1000';
          appHeader.appendChild(container);
        }
        
        // Create the toggle button with improved sun icon
        const toggle = document.createElement('button');
        toggle.className = 'dark-mode-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.innerHTML = `
          <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          
          <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001zm-7.001 22c-6.617 0-12-5.383-12-12s5.383-12 12-12c1.894 0 3.63.497 5.37 1.179-2.948.504-9.37 3.266-9.37 10.821 0 7.454 5.917 10.208 9.37 10.821-1.5.846-3.476 1.179-5.37 1.179z"/>
          </svg>
        `;
        container.appendChild(toggle);
      }
    }
  }

  // Expose function to window for use from React
  window.initDarkModeToggle = initDarkModeToggle;

  // Run when DOM is ready
  document.addEventListener('DOMContentLoaded', initDarkModeToggle);
})(); // End of IIFE
