# Wordle Guesser

An interactive tool to help you solve Wordle puzzles by suggesting possible words based on your previous guesses and feedback.

![Wordle Guesser Screenshot](https://i.imgur.com/example.png) <!-- Replace with actual screenshot when available -->

## Features

- Enter your Wordle guesses and receive color-coded feedback
- Get suggestions for valid next guesses based on all previous feedback
- Filter possible words in real-time as you enter more guesses
- Simple, intuitive user interface with Tailwind CSS
- Over 10,000 five-letter words built into the application
- Instant word filtering with efficient algorithms
- Mobile-responsive design

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wordle-guesser.git
   cd wordle-guesser
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## How to Use

1. Enter your Wordle guess (a 5-letter word) in the "Guess" field
2. Add feedback by clicking the colored buttons:
   - 🟩 Green: The letter is in the correct position
   - 🟨 Yellow: The letter is in the word but in the wrong position
   - ⬛ Gray: The letter is not in the word
3. Click "Add Guess" to register your guess and feedback
4. View the filtered list of possible words
5. Click on any suggested word to use it as your next guess
6. Use the "Reset" button to start a new game

### Example Workflow

1. Start with a guess like "STARE" (a good starting word with common letters)
2. In Wordle, enter "STARE" and note the color feedback
3. In Wordle Guesser, type "STARE" and click the color buttons to match the feedback
4. Click "Add Guess" to see filtered suggestions
5. Choose a logical next guess from the suggestions and repeat

## How the Algorithm Works

The word filtering algorithm considers several important constraints:

1. **Green letters**: Must be in the exact position specified
2. **Yellow letters**: Must be in the word, but not in the position where they were marked yellow
3. **Gray letters**: Must not appear in the word, unless that letter also appears elsewhere and is marked yellow or green
4. **Letter frequency**: Handles cases where a letter appears multiple times correctly

For example, if you guess "HELLO" and get:
- H: gray
- E: green
- L: yellow
- L: gray
- O: gray

The algorithm knows:
- The second letter must be E
- The word must contain exactly one L (not in position 3)
- The word cannot contain H or O

## Wordle Strategy Tips

- Start with words that have common letters (E, A, R, T, S, I, O, N)
- Use words with many different letters in your first few guesses
- After finding some letters, use the suggestions to narrow down possibilities
- Look for common prefixes and suffixes in the remaining words
- Sometimes it's better to use a word that will eliminate many possibilities rather than trying to guess the answer immediately

## Word List

The application includes a comprehensive list of over 10,000 five-letter English words. This includes:

- Common English words
- Some proper nouns
- Various word forms (plurals, past tenses, etc.)

## Technologies Used

- **React**: Frontend library for building the user interface
- **Tailwind CSS**: Utility-first CSS framework for styling
- **JavaScript**: Core programming language
- **React Hooks**: For state management and side effects

## Optimization

The app uses several optimization techniques:
- Debouncing word filtering operations
- Efficient filtering algorithms
- Loading spinner for operations that might take time
- Limiting displayed words to prevent UI slowdowns

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin new-feature`
5. Submit a pull request

### Potential Improvements

- Add dark mode support
- Implement letter frequency analysis to rank suggestions
- Add statistics on most likely words
- Create a history feature to review past games
- Add a "Hard Mode" that enforces Wordle's hard mode rules

## License

MIT
