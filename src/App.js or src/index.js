<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#e6b91e" />
    <meta name="description" content="Wordle Guesser - Help solve Wordle puzzles" />
    <title>Wordle Guesser</title>
    <link rel="stylesheet" href="%PUBLIC_URL%/styles/schooloflife-theme.css">
    <script>
      // Pre-fetch the words list to improve load time
      fetch('/words.txt')
        .catch(err => console.warn('Words list pre-fetch failed, will try again during app load'));
      
      // Check for dark mode preference
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      const storedTheme = localStorage.getItem('theme');
      
      // Apply theme based on preference
      if (storedTheme === 'dark' || (!storedTheme && prefersDarkScheme.matches)) {
        document.documentElement.classList.add('dark-mode');
      }
    </script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    
    <script>
      // Initialize dark mode toggle once DOM is loaded
      document.addEventListener('DOMContentLoaded', () => {
        const rootEl = document.getElementById('root');
        if (!rootEl) return;
        
        // Add dark mode toggle functionality if not handled by React
        document.body.addEventListener('click', (e) => {
          if (e.target.closest('.dark-mode-toggle')) {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
          }
        });
      });
    </script>
  </body>
</html>