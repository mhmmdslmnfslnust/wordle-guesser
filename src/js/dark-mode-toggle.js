/**
 * Dark Mode Toggle Functionality
 */

// Check for user preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');

// Set initial theme based on stored preference or system preference
if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
  document.body.classList.add('dark-mode');
} else {
  document.body.classList.remove('dark-mode');
}

// Initialize dark mode toggle
function initDarkModeToggle() {
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  
  if (!darkModeToggle) {
    console.warn('Dark mode toggle not found in DOM');
    return;
  }

  // Add event listener to toggle
  darkModeToggle.addEventListener('click', () => {
    // Toggle dark mode class
    document.body.classList.toggle('dark-mode');
    
    // Store preference
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  });
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', initDarkModeToggle);
