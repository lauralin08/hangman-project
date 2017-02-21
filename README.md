# hangman-project
Hangman project for LinkedIn REACH


### Running the game on a local server
1. Go to the game repository [here](https://github.com/lauralin08/hangman-project "Hangman repository").
2. Clone the repository to your chosen directory.
3. Open the command terminal and navigate to your chosen directory.
5. Run `npm install` to install the necessary dependencies.
6. Run `npm start` to start the local server.
7. In your web browser, go to [localhost:3000](https://localhost:3000 "Local server").
8. Play Hangman!


### Play an online demo
1. In your web browser, go to [Don't Hang the Man](https://dont-hang-the-man.herokuapp.com "Hangman game").
2. Play Hangman!


### More information
This project used:
- [npm](https://www.npmjs.com/), the package manager for JavaScript, to install the necessary modules and start the local server.
- [Express](https://expressjs.com/), the web framework for Node.js, to run a light-weight, beginner-friendly server that could also route API requests.
- [axios](https://github.com/mzabriskie/axios), a promise-based HTTP client, to make requests to the LinkedIn REACH Dictionary API.
- [jQuery](https://jquery.com/), the JavaScript library, to handle API requests and manipulate the DOM.
- [Bootstrap](https://getbootstrap.com/getting-started/), for beginner-friendly and responsive CSS styling.
- [Heroku](https://dashboard.heroku.com/apps), the cloud application platform, to deploy the demo.

How it works:
- When the user clicks "Play Now" or "Play Again", this clears the contents of the containers on the page along with the guess cache and the bad guess cache, and then runs a function that sends a request to the Word API.
- This function retrieves the difficulty level from the select input before sending an Ajax request to the API with the difficulty parameter added.
- Hitting the API triggers the server-side axios request, which retrieves a list of words within the given difficulty.
- This list is then split into an array of words and cached for faster word retrieval if the user chooses to stay at the same difficulty level. If there is already a cache of proper-difficulty-level words, this step is skipped.
- The server generates a random word from this cache and then sends the word back as an Ajax response. The word is converted to all uppercase. If the word has been chosen before, the function runs again. Otherwise, the word is added to the word cache and each letter is replaced with a set of double underscores.
- This set of underscores is displayed on the page, and the game inferface prompts the user to start guessing.
- The user can submit guesses by entering a letter into the text input field and clicking "Guess" or hitting "Enter". If a secret word has not been chosen yet, the game prompts the user to "Play Now".
- Each time a guess is submitted, the game makes sure that the word has not already been guessed and that the user has guesses remaining. If either of these cases are false, the game ends.
- Otherwise, if the guess is a single letter, the game first checks if the letter is valid and new. If not, it prompts the user to guess again. If so, it checks for matches and replaces all instances of the letter in the set of underscores shown.
- If the guess is an entire word, the game checks if all letters match. If so, the word is revealed.
- The guess is saved into the guess cache. If the letter or word did not match, the user's number of total guesses goes down by one.
- The guess result, user progress, lives left, and incorrect guesses are all loaded onto the page. If no underscores are left, the user wins. If there are no guesses left and the word has not been guessed, the user loses.
- Each time the number of total guesses left changes, the game loads a new Hangman image to show the user's progress visually.

Fixed issues:
- In an early version, the "guessed" variable was never reset, so the game could not be played after the player won once.
- In an early version, the "secretWord" variable was never reset, so if the next word was shorter than the previous words, too many underscores or letters would show up.
- In an early version, the game did not give an error if the user guess was blank.
- Most fonts were visually incompatible with double underscores.
- Code was long and complicated and needed to be organized into smaller functions to improve readability.
- Originally, there were going to be separate buttons for guessing a word and a letter, but this proved unnecessary.
- When the capability for full word guesses was added in, the secret word was treated as an array instead of a string, so the game was unable to compare the guess and the secret word.
- When naming classes for later CSS styling, "progress" turned out to be an existing Bootstrap class and had to be renamed.
- Adding the difficulty parameter proved especially difficult. When the difficulty was declared and retrieved as a global variable, the function containing the asynchronous Ajax request was unable to run. The declaration and retrieval had to be moved inside the function. Then, console logs were required to figure out how exactly Ajax was sending the requested difficulty to the server.
- Console logs are kept throughout the code to confirm game functionality.

Possible extensions:
- Add a leaderboard using local storage
- Keep word cache using local storage 
- Add capability to filter words based on length
- Add end-game animations
- Style "Results" fonts
- Style background colors instead of text colors for "Results" and "Incorrect Guesses" displays
