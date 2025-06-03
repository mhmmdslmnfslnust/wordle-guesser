import React, { useState, useEffect, useMemo } from 'react';
import { WORD_LIST } from './wordsList';

// Dark mode integration for React
const ThemeContext = React.createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

// ThemeProvider component to manage dark mode state
const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return storedTheme === 'dark' || (!storedTheme && prefersDark);
  });

  // Update both React state and document classes
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      
      // Update document classes for CSS
      if (newMode) {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
        document.body.classList.remove('dark-mode');
      }
      
      return newMode;
    });
  };

  // Update document classes on initial render
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
const useTheme = () => React.useContext(ThemeContext);

// Dark mode toggle component for React
const DarkModeToggle = () => {
  const { toggleDarkMode } = useTheme();
  
  return (
    <button className="dark-mode-toggle" aria-label="Toggle dark mode" onClick={toggleDarkMode}>
      {/* Improved Sun icon for dark mode */}
      <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      
      {/* Moon icon for light mode */}
      <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001zm-7.001 22c-6.617 0-12-5.383-12-12s5.383-12 12-12c1.894 0 3.63.497 5.37 1.179-2.948.504-9.37 3.266-9.37 10.821 0 7.454 5.917 10.208 9.37 10.821-1.5.846-3.476 1.179-5.37 1.179z"/>
      </svg>
    </button>
  );
};

// Main WordleGuesser component
const WordleGuesser = () => {
  const [allWords, setAllWords] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [feedback, setFeedback] = useState(['', '', '', '', '']);
  const [possibleWords, setPossibleWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [letterStatuses, setLetterStatuses] = useState({});
  const [sortMethod, setSortMethod] = useState('alphabetical');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Enable debugging to help troubleshoot issues
  const DEBUG = true;
  
  // Define the KEYBOARD_LAYOUT constant
  const KEYBOARD_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  // Feedback types with clear symbols and colors
  const FEEDBACK_TYPES = [
    { symbol: '', color: 'bg-white border-2 border-gray-300', text: 'text-gray-400', description: 'No feedback' },
    { symbol: '🟩', color: 'bg-green-500', text: 'text-white', description: 'Correct letter, correct position' },
    { symbol: '🟨', color: 'bg-yellow-500', text: 'text-white', description: 'Correct letter, wrong position' },
    { symbol: '⬛', color: 'bg-gray-500', text: 'text-white', description: 'Letter not in word' }
  ];
  
  // Load the full word list from wordsList.js on component mount
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure words are properly formatted (lowercase, 5 letters)
      const words = WORD_LIST
        .map(word => word.toLowerCase().trim())
        .filter(word => word.length === 5);
      
      if (DEBUG) console.log(`Loaded ${words.length} words from wordsList.js`);
      
      // Check if we actually have words
      if (words.length === 0) {
        throw new Error("No valid 5-letter words found in wordsList.js");
      }
      
      // Set both allWords (master list) and possibleWords (filtered list)
      setAllWords(words);
      setPossibleWords(words);
      
      if (DEBUG) {
        console.log("First 10 words:", words.slice(0, 10));
        console.log("Last 10 words:", words.slice(-10));
      }
    } catch (err) {
      console.error("Failed to load word list:", err);
      setError(`Error loading words: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Calculate letter frequencies for best word suggestions
  const letterFrequencies = useMemo(() => {
    if (!possibleWords.length) return { overall: {}, byPosition: [] };
    
    const frequencies = {};
    const positionFrequencies = Array(5).fill().map(() => ({}));
    
    possibleWords.forEach(word => {
      [...word].forEach((letter, index) => {
        // Overall frequency
        frequencies[letter] = (frequencies[letter] || 0) + 1;
        
        // Position-specific frequency
        positionFrequencies[index][letter] = (positionFrequencies[index][letter] || 0) + 1;
      });
    });
    
    return { overall: frequencies, byPosition: positionFrequencies };
  }, [possibleWords]);
  
  // Helper functions for word scoring
  const getWordScore = (word, frequencies) => {
    // Count unique letters only
    const uniqueLetters = [...new Set(word)];
    return uniqueLetters.reduce((score, letter) => score + (frequencies[letter] || 0), 0);
  };
  
  const getPositionalWordScore = (word, positionFrequencies) => {
    return [...word].reduce((score, letter, index) => {
      return score + (positionFrequencies[index][letter] || 0);
    }, 0);
  };

  // Sort filtered words based on selected method
  const rankedWords = useMemo(() => {
    if (!possibleWords.length) return [];
    
    // Apply search filter first
    let filtered = possibleWords;
    if (searchTerm) {
      filtered = possibleWords.filter(word => 
        word.includes(searchTerm.toLowerCase())
      );
    }
    
    // Now sort according to the selected method
    return [...filtered].sort((a, b) => {
      if (sortMethod === 'frequency') {
        const scoreA = getWordScore(a, letterFrequencies.overall);
        const scoreB = getWordScore(b, letterFrequencies.overall);
        return scoreB - scoreA;
      } else if (sortMethod === 'positional') {
        const scoreA = getPositionalWordScore(a, letterFrequencies.byPosition);
        const scoreB = getPositionalWordScore(b, letterFrequencies.byPosition);
        return scoreB - scoreA;
      } else {
        return a.localeCompare(b);
      }
    });
  }, [possibleWords, letterFrequencies, sortMethod, searchTerm]);
  
  // Update letter statuses based on guesses
  useEffect(() => {
    const statuses = {};
    
    guesses.forEach(guess => {
      [...guess.word].forEach((letter, index) => {
        letter = letter.toLowerCase();
        const status = guess.feedback[index];
        
        // Don't downgrade a letter's status
        // Green > Yellow > Gray
        if (status === '🟩') {
          statuses[letter] = '🟩';
        } else if (status === '🟨' && statuses[letter] !== '🟩') {
          statuses[letter] = '🟨';
        } else if (!statuses[letter]) {
          statuses[letter] = '⬛';
        }
      });
    });
    
    setLetterStatuses(statuses);
  }, [guesses]);

  // Cycle through feedback options for a letter
  const cycleLetterFeedback = (index) => {
    if (currentGuess.length <= index) return;
    
    const newFeedback = [...feedback];
    const currentTypeIndex = newFeedback[index] ? 
      FEEDBACK_TYPES.findIndex(type => type.symbol === newFeedback[index]) : 0;
      
    const nextTypeIndex = (currentTypeIndex + 1) % FEEDBACK_TYPES.length;
    newFeedback[index] = FEEDBACK_TYPES[nextTypeIndex].symbol;
    setFeedback(newFeedback);
  };

  // Add a new guess with feedback
  const handleSubmitGuess = (e) => {
    e.preventDefault();
    
    if (currentGuess.length !== 5) {
      alert("Please enter a 5-letter word.");
      return;
    }
    
    // Convert any empty feedback to gray (not in word)
    const processedFeedback = feedback.map((f, i) => f || '⬛');
    
    const newGuess = {
      word: currentGuess.toLowerCase(),
      feedback: processedFeedback
    };
    
    const updatedGuesses = [...guesses, newGuess];
    setGuesses(updatedGuesses);
    
    if (DEBUG) console.log("Added guess:", newGuess);
    
    // Reset input fields
    setCurrentGuess('');
    setFeedback(['', '', '', '', '']);
    
    // Filter possible words based on new guess and feedback
    filterPossibleWords(updatedGuesses);
  };

  // Filter words based on all guesses and feedback
  const filterPossibleWords = (allGuesses) => {
    setLoading(true);
    
    // Use setTimeout to prevent UI freezing during filtering
    setTimeout(() => {
      try {
        if (DEBUG) {
          console.log(`Starting to filter from ${allWords.length} words based on ${allGuesses.length} guesses`);
          console.log("All guesses:", allGuesses);
        }
        
        // Make sure we have words to filter
        if (!allWords.length) {
          console.error("No words to filter from");
          setError("Word list is empty. Please reload the page.");
          setLoading(false);
          return;
        }
        
        const filtered = allWords.filter(word => {
          return allGuesses.every(guess => isWordCompatible(word, guess));
        });
        
        if (DEBUG) {
          console.log(`Found ${filtered.length} compatible words`);
          if (filtered.length < 20) {
            console.log("Compatible words:", filtered);
          } else {
            console.log("First 10 compatible words:", filtered.slice(0, 10));
          }
        }
        
        setPossibleWords(filtered);
      } catch (error) {
        console.error("Error during filtering:", error);
        setError(`Error filtering words: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }, 10);
  };

  // Improved compatibility check between a candidate word and a guess+feedback
  const isWordCompatible = (candidate, guess) => {
    const candidateWord = candidate.toLowerCase();
    const guessWord = guess.word.toLowerCase();
    const guessFeedback = guess.feedback;
    
    if (DEBUG && candidate === "about") {
      console.log(`Checking if "about" is compatible with guess: ${guessWord}, feedback: ${guessFeedback}`);
    }
    
    // Track counts of each letter in the candidate word
    const letterCounts = {};
    for (const letter of candidateWord) {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }
    
    // Create a copy for tracking "used" letters
    const availableLetters = { ...letterCounts };
    
    // First process green matches to ensure they're prioritized
    for (let i = 0; i < 5; i++) {
      if (guessFeedback[i] === '🟩') {
        // Green = exact match required
        if (candidateWord[i] !== guessWord[i]) {
          return false;
        }
        // Mark this letter as "used"
        availableLetters[guessWord[i]]--;
      }
    }
    
    // Now process yellow matches
    for (let i = 0; i < 5; i++) {
      if (guessFeedback[i] === '🟨') {
        // Yellow = letter must exist somewhere else in the word
        
        // If it's the same letter at the same position, it can't be yellow
        if (candidateWord[i] === guessWord[i]) {
          return false;
        }
        
        // If the letter doesn't exist or all instances are used, word doesn't match
        if (!availableLetters[guessWord[i]] || availableLetters[guessWord[i]] <= 0) {
          return false;
        }
        
        // Mark this letter as "used"
        availableLetters[guessWord[i]]--;
      }
    }
    
    // Finally process gray letters
    for (let i = 0; i < 5; i++) {
      if (guessFeedback[i] === '⬛') {
        // Gray = letter must not exist in word (unless it's used by a green or yellow)
        const letter = guessWord[i];
        
        // If the candidate still has this letter available, it doesn't match the constraint
        if (availableLetters[letter] && availableLetters[letter] > 0) {
          return false;
        }
      }
    }
    
    return true;
  };

  // Reset the game
  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setFeedback(['', '', '', '', '']);
    setPossibleWords(allWords);
    setLetterStatuses({});
    setSearchTerm('');
    setError(null);
  };

  // Get CSS class for letter status
  const getLetterStatusClass = (letter) => {
    const status = letterStatuses[letter.toLowerCase()];
    if (!status) return 'bg-gray-200 text-black';
    
    switch (status) {
      case '🟩': return 'bg-green-500 text-white';
      case '🟨': return 'bg-yellow-500 text-white';
      case '⬛': return 'bg-gray-500 text-white';
      default: return 'bg-gray-200 text-black';
    }
  };
  
  // Generate statistics for remaining words
  const getStatistics = () => {
    if (!possibleWords.length) return {};
    
    const letterCounts = {};
    
    // Count letters
    possibleWords.forEach(word => {
      [...new Set(word)].forEach(letter => {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      });
    });
    
    // Sort letters by frequency
    const sortedLetters = Object.entries(letterCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([letter, count]) => ({ 
        letter, 
        count, 
        percentage: Math.round((count / possibleWords.length) * 100) 
      }));
    
    return {
      totalWords: possibleWords.length,
      topLetters: sortedLetters
    };
  };
  
  const stats = getStatistics();
  
  // Format results for clipboard
  const copyResultsToClipboard = () => {
    const guessesText = guesses.map(g => 
      `${g.word.toUpperCase()}: ${g.feedback.join('')}`
    ).join('\n');
    
    const resultsText = 
      `Wordle Guesser Results\n\n${guessesText}\n\nPossible words: ${possibleWords.length}\n${possibleWords.slice(0, 10).join(', ')}${possibleWords.length > 10 ? '...' : ''}`;
    
    navigator.clipboard.writeText(resultsText)
      .then(() => alert('Results copied to clipboard!'))
      .catch(err => alert('Failed to copy: ' + err));
  };
  
  // Get description for feedback type
  const getFeedbackDescription = (index) => {
    if (index < 0 || index >= feedback.length || !feedback[index]) return '';
    const feedbackType = FEEDBACK_TYPES.find(type => type.symbol === feedback[index]);
    return feedbackType ? feedbackType.description : '';
  };

  // Add a new function to handle clicks on the keyboard
  const handleKeyboardClick = (key) => {
    // Only add letters if we're under 5 characters
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key.toLowerCase());
    }
  };
  
  // Add a function to handle backspace from keyboard
  const handleBackspace = () => {
    setCurrentGuess(prev => prev.slice(0, -1));
    // If removing a letter, also remove its feedback
    if (feedback[currentGuess.length - 1]) {
      const newFeedback = [...feedback];
      newFeedback[currentGuess.length - 1] = '';
      setFeedback(newFeedback);
    }
  };

  // Custom class names that respect theme
  const themeClasses = {
    container: "container mx-auto p-4 max-w-4xl",
    virtualKeyboard: "mb-6 bg-white p-4 border border-gray-200 rounded-lg shadow-sm",
    statisticsPanel: "p-4 bg-gray-100 rounded-lg shadow",
    wordItem: "p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
  };

  return (
    <ThemeProvider>
      <div className={themeClasses.container}>
        {/* Updated header with centered title and toggle on side */}
        <header className="header-container mb-6">
          <h1 className="header-title centered-title">Wordle Guesser</h1>
          <div className="toggle-container">
            <DarkModeToggle />
          </div>
        </header>
        
        {/* Loading status */}
        <div className="mb-4 text-center">
          {loading ? (
            <p className="text-blue-600">Loading words...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <p>
              Words loaded: <strong>{allWords.length}</strong>, 
              Possible matches: <strong>{possibleWords.length}</strong>
            </p>
          )}
        </div>
        
        {/* Make the virtual keyboard a highlighted section */}
        <div className={`${themeClasses.virtualKeyboard} highlight-section`}>
          <h2 className="text-xl font-semibold mb-2">Virtual Keyboard</h2>
          <p className="text-sm text-gray-500 mb-2">Click or tap letters to type • Colors show letter statuses</p>
          <div className="flex flex-col items-center gap-1 mb-2">
            {KEYBOARD_LAYOUT.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {rowIndex === 2 && (
                  <button
                    className="w-12 h-11 flex items-center justify-center font-medium rounded bg-gray-300 text-black"
                    onClick={handleBackspace}
                  >
                    ⌫
                  </button>
                )}
                {row.map(key => (
                  <button 
                    key={key} 
                    className={`w-9 h-11 flex items-center justify-center font-medium rounded ${getLetterStatusClass(key)} hover:opacity-80 active:opacity-70 cursor-pointer transition-all`}
                    onClick={() => handleKeyboardClick(key)}
                  >
                    {key}
                  </button>
                ))}
                {rowIndex === 2 && (
                  <button
                    className="w-12 h-11 flex items-center justify-center font-medium rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={handleSubmitGuess}
                    disabled={currentGuess.length !== 5}
                  >
                    ↵
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Form to enter guess - Update input styles */}
        <form onSubmit={handleSubmitGuess} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/2">
              <label htmlFor="guess" className="block text-sm font-medium text-gray-700">Guess (5 letters)</label>
              <input
                type="text"
                id="guess"
                value={currentGuess}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().substring(0, 5);
                  setCurrentGuess(value);
                  
                  // Reset feedback for positions beyond the current word length
                  if (value.length < currentGuess.length) {
                    const newFeedback = [...feedback];
                    for (let i = value.length; i < 5; i++) {
                      newFeedback[i] = '';
                    }
                    setFeedback(newFeedback);
                  }
                }}
                className="mt-1 p-2 w-full border rounded-md uppercase"
                maxLength="5"
                placeholder="Enter your guess or use keyboard below"
              />
            </div>
            
            <div className="w-full md:w-1/2 mt-2">
              <div className="flex justify-end mb-2">
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={currentGuess.length !== 5}
                >
                  Add Guess
                </button>
              </div>
            </div>
          </div>
          
          {/* Interactive feedback selector */}
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Click on each letter to set feedback color:
            </label>
            <div className="flex justify-center gap-2">
              {Array(5).fill().map((_, index) => (
                <div 
                  key={index}
                  onClick={() => cycleLetterFeedback(index)}
                  className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded-md cursor-pointer uppercase transition-colors ${
                    feedback[index] ? FEEDBACK_TYPES.find(t => t.symbol === feedback[index])?.color : 'bg-white border-2 border-gray-300'
                  } ${
                    feedback[index] ? FEEDBACK_TYPES.find(t => t.symbol === feedback[index])?.text : 'text-gray-700'
                  }`}
                  title={getFeedbackDescription(index)}
                >
                  {index < currentGuess.length ? currentGuess[index].toUpperCase() : '?'}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2 text-sm text-gray-600">
              <p>Click tiles to cycle: Empty → Green (🟩) → Yellow (🟨) → Gray (⬛) → Empty</p>
            </div>
          </div>
        </form>
        
        {/* Toolbar with reset and copy buttons */}
        <div className="flex justify-between mb-6">
          <button
            type="button"
            onClick={resetGame}
            className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reset
          </button>
          
          <button
            type="button"
            onClick={copyResultsToClipboard}
            className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            disabled={guesses.length === 0}
          >
            Copy Results
          </button>
        </div>
        
        {/* Display guesses with feedback */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Guesses</h2>
          {guesses.length === 0 ? (
            <p className="text-gray-500">No guesses yet. Enter a guess and feedback above.</p>
          ) : (
            <div className="space-y-2">
              {guesses.map((guess, index) => (
                <div key={index} className="flex gap-2">
                  {[...guess.word].map((letter, i) => {
                    const feedbackSymbol = guess.feedback[i];
                    const feedbackType = FEEDBACK_TYPES.find(type => type.symbol === feedbackSymbol) || FEEDBACK_TYPES[3]; // Default to gray
                    return (
                      <div
                        key={i}
                        className={`w-10 h-10 flex items-center justify-center font-bold uppercase ${feedbackType.color} ${feedbackType.text} rounded-md`}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Statistics section - Update card backgrounds */}
        <div className="mb-4 highlight-section">
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className={themeClasses.statisticsPanel}>
              <h3 className="text-lg font-semibold mb-2">Top Letters in Possible Words</h3>
              {stats.topLetters && stats.topLetters.length > 0 ? (
                <ul className="list-disc list-inside">
                  {stats.topLetters.map((letterInfo, index) => (
                    <li key={index} className="text-gray-700">
                      {letterInfo.letter.toUpperCase()}: {letterInfo.count} (
                      {letterInfo.percentage}%)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No statistics available yet.</p>
              )}
            </div>
            
            <div className={themeClasses.statisticsPanel}>
              <h3 className="text-lg font-semibold mb-2">Game Stats</h3>
              <p className="text-gray-700">
                Total Words: <strong>{stats.totalWords}</strong>
              </p>
            </div>
          </div>
        </div>
        
        {/* Search and sort controls - Update input styles */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search within possible words..."
            className="p-2 border rounded w-full mb-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select 
              value={sortMethod}
              onChange={(e) => setSortMethod(e.target.value)}
              className="p-1 border rounded"
            >
              <option value="alphabetical">Alphabetical</option>
              <option value="frequency">Letter Frequency</option>
              <option value="positional">Positional Frequency</option>
            </select>
          </div>
        </div>
        
        {/* Display possible words - Update word items */}
        <div>
          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Possible Words ({rankedWords.length} of {possibleWords.length} total)
              </h2>
              
              {rankedWords.length === 0 ? (
                <p className="text-gray-500">No matching words found. Try different guesses or check your feedback.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {rankedWords.slice(0, 100).map((word, index) => (
                    <div 
                      key={index} 
                      className={themeClasses.wordItem}
                      onClick={() => setCurrentGuess(word)}
                    >
                      {word}
                    </div>
                  ))}
                  {rankedWords.length > 100 && (
                    <div className="p-2 col-span-full text-center text-gray-500">
                      ...and {rankedWords.length - 100} more words
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default WordleGuesser;
