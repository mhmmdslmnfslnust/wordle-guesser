import { useState, useEffect, useMemo } from 'react';
import allWordsList from './wordsList'; // Import words directly if available

const WordleGuesser = () => {
  const [allWords, setAllWords] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [feedback, setFeedback] = useState(['', '', '', '', '']);
  const [possibleWords, setPossibleWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [letterStatuses, setLetterStatuses] = useState({});
  const [sortMethod, setSortMethod] = useState('alphabetical');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayLimit, setDisplayLimit] = useState(100);

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
  
  // Load all words on component mount
  useEffect(() => {
    const loadWords = async () => {
      setLoading(true);
      try {
        let words;
        
        // Attempt to fetch from words.txt first
        try {
          const response = await fetch('/words.txt');
          const text = await response.text();
          words = text.split('\n')
            .filter(word => word.trim().length === 5)
            .map(word => word.toLowerCase());
          
          console.log(`Loaded ${words.length} words from words.txt`);
        } catch (fetchError) {
          // Fallback to imported list
          console.warn("Failed to load from words.txt, using built-in list");
          words = allWordsList;
        }
        
        if (!words || words.length < 1000) {
          console.warn("Word list seems incomplete, may affect functionality");
        }
        
        setAllWords(words);
        setPossibleWords(words);
        console.log(`Total words loaded: ${words.length}`);
      } catch (error) {
        console.error("Failed to load word list:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadWords();
  }, []);
  
  // Calculate letter frequencies for best word suggestions
  const letterFrequencies = useMemo(() => {
    if (!possibleWords.length) return { overall: {}, byPosition: [] };
    
    const frequencies = {};
    const positionFrequencies = Array(5).fill().map(() => ({}));
    
    possibleWords.forEach(word => {
      const seen = new Set();
      
      [...word].forEach((letter, index) => {
        // Overall frequency
        frequencies[letter] = (frequencies[letter] || 0) + 1;
        
        // Position-specific frequency
        positionFrequencies[index][letter] = (positionFrequencies[index][letter] || 0) + 1;
        
        seen.add(letter);
      });
    });
    
    return { overall: frequencies, byPosition: positionFrequencies };
  }, [possibleWords]);

  // Calculate word score based on letter frequencies
  const getWordScore = (word, frequencies) => {
    const uniqueLetters = [...new Set(word)];
    return uniqueLetters.reduce((score, letter) => score + (frequencies[letter] || 0), 0);
  };

  // Calculate word score based on positional letter frequencies
  const getPositionalWordScore = (word, positionFrequencies) => {
    return [...word].reduce((score, letter, index) => {
      return score + (positionFrequencies[index][letter] || 0);
    }, 0);
  };

  // Filter displayed words based on search term
  const filteredWords = useMemo(() => {
    if (!searchTerm) return possibleWords;
    return possibleWords.filter(word => 
      word.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [possibleWords, searchTerm]);
  
  // Sort the filtered words
  const displayedWords = useMemo(() => {
    if (!filteredWords.length) return [];
    
    return [...filteredWords].sort((a, b) => {
      if (sortMethod === 'frequency') {
        // Score based on unique letter frequency
        const scoreA = getWordScore(a, letterFrequencies.overall);
        const scoreB = getWordScore(b, letterFrequencies.overall);
        return scoreB - scoreA;
      } else if (sortMethod === 'positional') {
        // Score based on positional letter frequency
        const scoreA = getPositionalWordScore(a, letterFrequencies.byPosition);
        const scoreB = getPositionalWordScore(b, letterFrequencies.byPosition);
        return scoreB - scoreA;
      } else {
        // Default alphabetical sorting
        return a.localeCompare(b);
      }
    });
  }, [filteredWords, sortMethod, letterFrequencies]);

  // Update letter statuses based on guesses
  useEffect(() => {
    const statuses = {};
    
    guesses.forEach(guess => {
      [...guess.word].forEach((letter, index) => {
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
    if (currentGuess.length <= index) return; // Don't cycle if no letter at this position
    
    const newFeedback = [...feedback];
    // Find current feedback type index
    const currentTypeIndex = newFeedback[index] ? 
      FEEDBACK_TYPES.findIndex(type => type.symbol === newFeedback[index]) : 0;
      
    // Cycle to next feedback type
    const nextTypeIndex = (currentTypeIndex + 1) % FEEDBACK_TYPES.length;
    newFeedback[index] = FEEDBACK_TYPES[nextTypeIndex].symbol;
    setFeedback(newFeedback);
  };

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
    setCurrentGuess('');
    setFeedback(['', '', '', '', '']);
    
    // Filter possible words based on new guess and feedback
    filterPossibleWords(updatedGuesses);
    
    console.log("Added guess:", newGuess); // Debug info
  };

  const loadMoreWords = () => {
    setDisplayLimit(prev => prev + 100);
  };
  
  // Modify the filterPossibleWords function to log more information
  const filterPossibleWords = (allGuesses) => {
    setLoading(true);
    
    // Use setTimeout to prevent UI freezing during filtering
    setTimeout(() => {
      try {
        console.log(`Filtering from ${allWords.length} total words`);
        
        const filtered = allWords.filter(word => {
          return allGuesses.every(guess => isCompatible(word, guess));
        });
        
        setPossibleWords(filtered);
        console.log(`Found ${filtered.length} compatible words`);
        
        // Reset display limit when filtering changes results
        setDisplayLimit(100);
      } catch (error) {
        console.error("Error during filtering:", error);
      } finally {
        setLoading(false);
      }
    }, 10);
  };

  const isCompatible = (word, guess) => {
    const guessWord = guess.word.toLowerCase();
    const guessFeedback = guess.feedback;
    
    // Create arrays of letters for better handling
    const wordLetters = [...word];
    const guessLetters = [...guessWord];
    
    // First check: green positions (correct letter, correct position)
    for (let i = 0; i < 5; i++) {
      if (guessFeedback[i] === '🟩' && wordLetters[i] !== guessLetters[i]) {
        return false;
      }
    }
    
    // Create a map to track available letters in the candidate word
    // This helps handle duplicate letters correctly
    const availableLetters = {};
    wordLetters.forEach(letter => {
      availableLetters[letter] = (availableLetters[letter] || 0) + 1;
    });
    
    // Mark green positions as used
    for (let i = 0; i < 5; i++) {
      if (guessFeedback[i] === '🟩') {
        availableLetters[guessLetters[i]]--;
      }
    }
    
    // Check yellow positions (letter in word, wrong position)
    for (let i = 0; i < 5; i++) {
      if (guessFeedback[i] === '🟨') {
        // The letter should be in the word but not at this position
        if (wordLetters[i] === guessLetters[i] || 
            !availableLetters[guessLetters[i]] || 
            availableLetters[guessLetters[i]] <= 0) {
          return false;
        }
        availableLetters[guessLetters[i]]--;
      }
    }
    
    // Check gray positions (letter not in word, unless already marked as green or yellow)
    for (let i = 0; i < 5; i++) {
      if (guessFeedback[i] === '⬛') {
        // If this gray letter still has available slots, it means there are too many of this letter
        if (availableLetters[guessLetters[i]] && availableLetters[guessLetters[i]] > 0) {
          return false;
        }
      }
    }
    
    return true;
  };
  
  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setFeedback(['', '', '', '', '']);
    setPossibleWords(allWords);
    setLetterStatuses({});
  };

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

  const getFeedbackDescription = (index) => {
    if (index < 0 || index >= feedback.length || !feedback[index]) return '';
    const feedbackType = FEEDBACK_TYPES.find(type => type.symbol === feedback[index]);
    return feedbackType ? feedbackType.description : '';
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Wordle Guesser</h1>
      
      {/* Form to enter guess */}
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
              placeholder="Enter your guess"
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
            {currentGuess.split('').map((letter, index) => (
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
                {letter}
              </div>
            ))}
            {Array(5 - currentGuess.length).fill().map((_, index) => (
              <div
                key={`empty-${index}`}
                className="w-12 h-12 flex items-center justify-center border-2 border-gray-200 rounded-md text-gray-400"
              >
                ?
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
      
      {/* Add search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search within possible words..."
          className="p-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Word sorting options */}
      <div className="mb-4 flex items-center gap-2">
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
      
      {/* Display possible words with improved messaging */}
      <div>
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Possible Words ({filteredWords.length} of {possibleWords.length} total)
            </h2>
            
            {filteredWords.length === 0 ? (
              <p className="text-gray-500">No matching words found. Try different guesses or check your feedback.</p>
            ) : (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {displayedWords.slice(0, displayLimit).map((word, index) => (
                    <div 
                      key={index} 
                      className="p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => setCurrentGuess(word)}
                    >
                      {word}
                    </div>
                  ))}
                </div>
                
                {filteredWords.length > displayLimit && (
                  <div className="text-center mt-4">
                    <p className="text-gray-500 mb-2">
                      Showing {displayLimit} of {filteredWords.length} words
                    </p>
                    <button 
                      className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={loadMoreWords}
                    >
                      Load 100 More Words
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Visual keyboard */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Letter Status</h2>
        <div className="flex flex-col items-center gap-1 mb-4">
          {KEYBOARD_LAYOUT.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {rowIndex === 2 && <div className="w-4"></div>} {/* Offset for bottom row */}
              {row.map(key => (
                <div 
                  key={key} 
                  className={`w-8 h-10 flex items-center justify-center font-medium rounded ${getLetterStatusClass(key)}`}
                >
                  {key}
                </div>
              ))}
              {rowIndex === 2 && <div className="w-4"></div>} {/* Offset for bottom row */}
            </div>
          ))}
        </div>
      </div>
      
      {/* Statistics section */}
      {stats.totalWords > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          <p className="mb-1">Total possible words: <span className="font-bold">{stats.totalWords}</span></p>
          <div>
            <p className="mb-1">Most common letters in remaining words:</p>
            <div className="flex flex-wrap gap-2">
              {stats.topLetters.map(({ letter, count, percentage }) => (
                <div key={letter} className="px-2 py-1 bg-blue-100 rounded text-sm">
                  <span className="font-bold uppercase">{letter}</span>: {percentage}% ({count})
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordleGuesser;
