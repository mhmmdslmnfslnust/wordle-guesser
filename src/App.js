import { useState, useEffect } from 'react';

const WordleGuesser = () => {
  const [allWords, setAllWords] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [possibleWords, setPossibleWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load words from the file
    fetch('/words.txt')
      .then(response => response.text())
      .then(text => {
        const words = text.split('\n').filter(word => word.trim().length === 5);
        setAllWords(words);
        setPossibleWords(words);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to load word list:", error);
        setLoading(false);
      });
  }, []);

  const handleSubmitGuess = (e) => {
    e.preventDefault();
    
    if (currentGuess.length !== 5 || feedback.length !== 5) {
      alert("Guess must be 5 letters and feedback must be 5 characters.");
      return;
    }
    
    const newGuess = {
      word: currentGuess.toLowerCase(),
      feedback: feedback
    };
    
    const updatedGuesses = [...guesses, newGuess];
    setGuesses(updatedGuesses);
    setCurrentGuess('');
    setFeedback('');
    
    // Filter possible words based on new guess and feedback
    filterPossibleWords(updatedGuesses);
  };

  const filterPossibleWords = (allGuesses) => {
    setLoading(true);
    
    // Use setTimeout to prevent UI freezing during filtering
    setTimeout(() => {
      const filtered = allWords.filter(word => {
        return allGuesses.every(guess => isCompatible(word, guess));
      });
      
      setPossibleWords(filtered);
      setLoading(false);
    }, 10);
  };

  const isCompatible = (word, guess) => {
    const guessWord = guess.word.toLowerCase();
    const guessFeedback = guess.feedback;
    
    // Check green positions (correct letter, correct position)
    for (let i = 0; i < 5; i++) {
      if (guessFeedback[i] === '🟩' && word[i] !== guessWord[i]) {
        return false;
      }
    }
    
    // Check yellow positions (letter in word, wrong position)
    for (let i = 0; i < 5; i++) {
      if (guessFeedback[i] === '🟨') {
        if (word[i] === guessWord[i] || !word.includes(guessWord[i])) {
          return false;
        }
      }
    }
    
    // Track min and max occurrences of each letter
    const minCount = {};
    const maxCount = {};
    
    // Initialize with unlimited max counts
    const uniqueLetters = new Set(guessWord);
    uniqueLetters.forEach(letter => {
      maxCount[letter] = 5; // Start with a high limit
    });
    
    // Process green and yellow letters
    for (let i = 0; i < 5; i++) {
      const letter = guessWord[i];
      if (guessFeedback[i] === '🟩' || guessFeedback[i] === '🟨') {
        minCount[letter] = (minCount[letter] || 0) + 1;
      }
    }
    
    // Process gray letters
    for (let i = 0; i < 5; i++) {
      const letter = guessWord[i];
      if (guessFeedback[i] === '⬛') {
        maxCount[letter] = minCount[letter] || 0;
      }
    }
    
    // Check letter count constraints
    for (const letter of uniqueLetters) {
      const count = (word.match(new RegExp(letter, 'g')) || []).length;
      if (count < (minCount[letter] || 0) || count > maxCount[letter]) {
        return false;
      }
    }
    
    return true;
  };
  
  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setFeedback('');
    setPossibleWords(allWords);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Wordle Guesser</h1>
      
      {/* Form to enter guess and feedback */}
      <form onSubmit={handleSubmitGuess} className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/3">
            <label htmlFor="guess" className="block text-sm font-medium text-gray-700">Guess (5 letters)</label>
            <input
              type="text"
              id="guess"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value.toLowerCase().substring(0, 5))}
              className="mt-1 p-2 w-full border rounded-md"
              maxLength="5"
              placeholder="Enter your guess"
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">Feedback</label>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                className="button-primary bg-green-500"
                onClick={() => setFeedback(feedback.length < 5 ? feedback + '🟩' : feedback)}
              >
                🟩
              </button>
              <button
                type="button"
                className="button-primary bg-yellow-500"
                onClick={() => setFeedback(feedback.length < 5 ? feedback + '🟨' : feedback)}
              >
                🟨
              </button>
              <button
                type="button"
                className="button-primary bg-gray-500"
                onClick={() => setFeedback(feedback.length < 5 ? feedback + '⬛' : feedback)}
              >
                ⬛
              </button>
              <input
                type="text"
                id="feedback"
                value={feedback}
                className="p-2 w-full border rounded-md"
                placeholder="Click buttons"
                readOnly
              />
              <button
                type="button"
                className="button-secondary"
                onClick={() => setFeedback(feedback.slice(0, -1))}
              >
                ←
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <button
              type="submit"
              className="button-primary mt-6 w-full"
              disabled={currentGuess.length !== 5 || feedback.length !== 5}
            >
              Add Guess
            </button>
          </div>
        </div>
      </form>
      
      {/* Display guesses with feedback */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Guesses</h2>
        {guesses.length === 0 ? (
          <p className="text-gray-500">No guesses yet. Enter a guess and feedback above.</p>
        ) : (
          <div className="space-y-2">
            {guesses.map((guess, index) => (
              <div key={index} className="flex gap-2">
                {Array.from(guess.word).map((letter, i) => (
                  <div
                    key={i}
                    className={`letter-tile ${
                      guess.feedback[i] === '🟩' ? 'letter-tile-green' :
                      guess.feedback[i] === '🟨' ? 'letter-tile-yellow' : 'letter-tile-gray'
                    }`}
                  >
                    {letter.toUpperCase()}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Reset button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={resetGame}
          className="button-danger"
        >
          Reset
        </button>
      </div>
      
      {/* Display possible words */}
      <div>
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="spinner"></div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-2">Possible Words ({possibleWords.length})</h2>
            {possibleWords.length === 0 ? (
              <p className="text-gray-500">No matching words found. Try different guesses or check your feedback.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {possibleWords.slice(0, 100).map((word, index) => (
                  <div key={index} className="word-suggestion"
                       onClick={() => setCurrentGuess(word)}>
                    {word}
                  </div>
                ))}
                {possibleWords.length > 100 && (
                  <div className="p-2 col-span-full text-center text-gray-500">
                    ...and {possibleWords.length - 100} more words
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordleGuesser;
