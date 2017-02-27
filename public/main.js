$(document).ready(function() {

    var wordCache = {};
    var guessCache = {};
    var badGuessCache = [];
    var userProgress = [];
    var totalGuesses = 6;
    var userGuess;
    var match;
    var secretWord;

    var $userProgress = $('.user-progress');
    var $badGuessCache = $('.bad-guesses');
    var $livesLeft = $('.lives-left');
    var $guessResult = $('.guess-result');
    var $guess = $('.form-control');
    var $hangman = $('.hangman-container');
    var $guessSubmit = $('.guess-submit');

    function showProgress() { 
        $userProgress.empty();

        var $userGuess = $('<div class="guess">Your guess: ' + userGuess + '</div>');
        $userProgress.append($userGuess);
        console.log('Your guess: ' + userGuess);

        var $progress = $('<div class="user-progress">Your progress: ' + userProgress + '</div>');
        $userProgress.append($progress);
        console.log('Your progress: ' + userProgress);
    }

    function showBadGuesses() {
        $badGuessCache.empty();
        if (badGuessCache.length) {
            var $badGuesses = $('<div class="text-danger padded">Incorrectly guessed: ' + badGuessCache + '<div>');
            $badGuessCache.append($badGuesses);
            console.log('Incorrectly guessed: ' + badGuessCache);
        } else {
            var $none = $('<div class="text-success padded">No wrong guesses so far!</div>');
            $badGuessCache.append($none);
            console.log('No wrong guesses so far!');
        }
    }

    function showLivesLeft() {
        $livesLeft.empty();
        var $lives = $('<div class="padded">You have ' + totalGuesses + ' guesses left. Guess a letter or a word!</div>');
        $livesLeft.append($lives);
        console.log('You have ' + totalGuesses + ' guesses left. Guess a letter or a word!');
    }

    function showHangman() {
        $hangman.empty();
        var $hangmanimage = $('<img class="img-responsive center-block hangman-image" src="Hangman' + totalGuesses + '.png" alt="Hangman Diagram"/>');
        $hangman.append($hangmanimage);
    }

    function startGame() {
        $livesLeft.empty();
        var $start = $('<div>You have 6 guesses. Guess the following word: ' + userProgress + '<div>');
        $livesLeft.append($start);
        console.log('You have 6 guesses. Guess the following word: ' + userProgress);
    }

    function noSecretWord() {
        $livesLeft.empty();
        var $error = $('<div class="padded">Click "Play Now" to start the game!</div>');
        $livesLeft.append($error);
        console.log('Click "Play Now" to start the game!');
    }

    function guessAgain() {
        $guessResult.empty();
        var $invalid = $('<div class="text-danger">Invalid guess</div>');
        $guessResult.append($invalid);
        
        $livesLeft.empty();
        var $guessAgain = $('<div class="text-danger">Please guess again. Make sure it\'s an English letter or word that you haven\'t guessed yet!</div>');
        $livesLeft.append($guessAgain);

        showProgress();
        console.log("Invalid guess. Please guess again. Make sure it's an English letter or word that you haven't guessed yet!");
    }
   
    function showResult() {
        $guessResult.empty();
        if (match) {
            var $correct = $('<div class="text-success">Good job!</div>');
            $guessResult.append($correct);
            console.log('Good job!');
        } else if (!match) {
            var $incorrect = $('<div class="text-danger">Ouch... the rope tightened.</div>');
            $guessResult.append($incorrect);
            console.log('Ouch... the rope tightened.');
        }
    }

    function userWins() {
        $guessResult.empty();
        var $success = $('<div class="winner text-success">You guessed the word and saved the hanging man!</div>');
        var $winner = $('<div class="winner text-success">Congratulations&mdash;you won! Click "Play Again" to play again.</div>')
        $guessResult.append($success);
        $guessResult.append($winner);
        console.log('You guessed the word and saved the hanging man! Congratulations--you won! Click "Play Again" to play again.');
    }

    function userLoses() {
        $guessResult.empty();
        var $sorry = $('<div class="loser text-danger">Sorry, you lost! The word was "' + secretWord + '".</div>');
        var $loser = $('<div class="loser text-danger">Too bad... Click "Play Again" to try again.</div>')
        $guessResult.append($sorry);
        $guessResult.append($loser);
        console.log('Sorry, you lost! The word was ' + secretWord + '. Too bad... Click "Play Again" to try again.');
    }

    var $playNow = $('.play-now');
    $playNow.on('click', function(event) {
        userProgress.length = 0;
        badGuessCache.length = 0;
        for (var key in guessCache) {
            delete guessCache[key];
        }
        totalGuesses = 6;
        $guessResult.empty();
        $badGuessCache.empty();
        $userProgress.empty();
        getSecretWord();
    });

    function getSecretWord() {
        var $difficulty = $('.difficulty');
        var difficulty;
        difficulty = $difficulty.val();
        console.log('Difficulty level: ' + difficulty);
        $.ajax('/words' , {
            data: {
                difficulty: difficulty
            },
            success: function(word) {
                secretWord = word.toUpperCase();
                if (wordCache[secretWord]) {
                    getSecretWord();
                } 
                wordCache[secretWord] = true;
                for (var i = 0; i < secretWord.length; i++) {
                    userProgress[i] = '__';
                }
                $('#playNow').html('Play Again!');
                startGame();
            }
        });
    }

    function playGame() {
        if (totalGuesses === 0) {
            userLoses();
        } else {
            match = false;
            setUserGuess();
            
            var updater = letterIsOK() ?updateLetterProgress
            : wordIsOK() ?updateWordProgress
            : null;

            if (updater) { // if letter
                updater();
            } else {
                return guessAgain();
            }

            guessCache[userGuess] = true;  
            if (!match) {
                badGuessCache.push(userGuess);
                totalGuesses--;
            }
            updateBoard();
            if (isWordGuessed()) { // if word is guessed
                userWins();
            }
        }
    }

    function isWordGuessed() {
        return (userProgress.indexOf('__') === -1);
    }

    function updateBoard() {
        showHangman();
        showProgress(); 
        showResult();
        showLivesLeft();
        showBadGuesses();    
    }

    function isValidLetter(letter) {
        const A = "A".charCodeAt();
        const Z = "Z".charCodeAt();
        const L = letter.charCodeAt();
        return (L >= A && L <= Z);
    }

    function letterIsOK() {
        return (userGuess.length === 1 && !guessCache[userGuess] && isValidLetter(userGuess));
    }

    function updateLetterProgress() {
        for (var i = 0; i < secretWord.length; i++) { 
            if (userGuess === secretWord[i]) {
                match = true;
                userProgress[i] = userGuess;
            }
        }
    }

    function wordIsOK() {
        return (userGuess.length > 1 && !guessCache[userGuess]);
    }

    function updateWordProgress() {
        if (secretWord === userGuess) {
            match = true;
            for (var i = 0; i < userGuess.length; i++) {
                userProgress[i] = userGuess[i];
            }
        }
    }
    
    function setUserGuess() {
        userGuess = $guess.val().toUpperCase();
    }


    $guess.keyup(function(event) {
        if (event.keyCode == '13') {
            $guessSubmit.click();
        }
    });

    $guessSubmit.on('click', function() {
        if (secretWord) {
            playGame();
        } else {
            noSecretWord();
        }
        var $inputGuess = $('#inputGuess');
        $inputGuess.val('');
    });
});