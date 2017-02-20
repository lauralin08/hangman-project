$(document).ready(function() {
    const LETTERS = {
        'A': true,
        'B': true,
        'C': true,
        'D': true,
        'E': true,
        'F': true,
        'G': true,
        'H': true,
        'I': true,
        'J': true,
        'K': true,
        'L': true,
        'M': true,
        'N': true,
        'O': true,
        'P': true,
        'Q': true,
        'R': true,
        'S': true,
        'T': true,
        'U': true,
        'V': true,
        'W': true,
        'X': true,
        'Y': true,
        'Z': true
    }
    var wordCache = {};
    var guessCache = {};
    var badGuessCache = [];
    var userProgress = [];
    var totalGuesses = 6;
    var userGuess;
    var match;
    var guessed;

    var $userProgress = $('.user-progress');
    var $badGuessCache = $('.bad-guesses');
    var $livesLeft = $('.lives-left');
    var $guessResult = $('.guess-result');
    var $guessSubmit = $('.guess-submit');
    var $guess = $('.form-control');

    function showProgress() { 
        $userProgress.empty();

        var $userGuess = $('<div class="guess">Your guess: ' + userGuess + '</div>');
        $userProgress.append($userGuess);
        console.log('Your guess: ' + userGuess);

        var $progress = $('<div class="progress">Your progress: ' + userProgress + '</div>');
        $userProgress.append($progress);
        console.log('Your progress: ' + userProgress);
    }

    function showBadGuesses() {
        $badGuessCache.empty();
        if (badGuessCache.length) {
            var $badGuesses = $('<div class="bad">Incorrectly guessed: ' + badGuessCache + '<div>');
            $badGuessCache.append($badGuesses);
            console.log('Incorrectly guessed: ' + badGuessCache);
        } else {
            var $none = $('<div class="good">No wrong guesses so far!</div>');
            $badGuessCache.append($none);
            console.log('No wrong guesses so far!');
        }
    }

    function showLivesLeft() {
        $livesLeft.empty();
        var $lives = $('<div>You have ' + totalGuesses + ' guesses left. Guess a letter!</div>');
        $livesLeft.append($lives);
        console.log('You have ' + totalGuesses + ' guesses left. Guess a letter!');
    }

    function startGame() {
        $livesLeft.empty();
        var $start = $('<div>You have 6 guesses. Guess the following word: ' + userProgress + '<div>');
        $livesLeft.append($start);
        console.log('You have 6 guesses. Guess the following word: ' + userProgress);
    }

    function guessAgain() {
        $guessResult.empty();
        var $invalid = $('<div class="bad">Invalid guess</div>');
        $guessResult.append($invalid);
        
        $livesLeft.empty();
        var $guessAgain = $('<div class="bad">Please guess again. Make sure it\'s an English letter that you haven\'t guessed yet!</div>');
        $livesLeft.append($guessAgain);
        console.log("Invalid guess. Please guess again. Make sure it's an English letter that you haven't guessed yet!");
    }
   
    function showResult() {
        $guessResult.empty();
        if (match) {
            var $correct = $('<div class="good">Good job!</div>');
            $guessResult.append($correct);
            console.log('Good job!');
        } else if (!match) {
            var $incorrect = $('<div class="bad">Ouch... the rope tightened.</div>');
            $guessResult.append($incorrect);
            console.log('Ouch... the rope tightened.');
        }
    }

    function userWins() {
        $guessResult.empty();
        var $winner = $('<div class="winner good">You guessed the word and saved the hanging man! Congratulations&mdash;you won! Click "Play Now" to play again.</div>');
        $guessResult.append($winner);
        console.log('You guessed the word and saved the hanging man! Congratulations--you won! Click "Play Now" to play again.');
    }

    function userLoses() {
        $guessResult.empty();
        var $loser = $('<div class="loser bad">Sorry, you lost! The word was "' + secretWord + '". Too bad... Click "Play Now" to try again.</div>');
        $guessResult.append($loser);
        console.log('Sorry, you lost! The word was ' + secretWord + '. Too bad... Click "Play Now" to try again.');
    }
    
    function getSecretWord() {
        $.ajax('/words' , {
            success: function(word) {
                secretWord = word.toUpperCase();
                if (wordCache[secretWord]) {
                    getSecretWord();
                } 
                wordCache[secretWord] = true;
                for (var i = 0; i < secretWord.length; i++) {
                    userProgress[i] = '__';
                }
                startGame();
            }
        });
    }

    var $playNow = $('.play-now');
    $playNow.on('click', function(event) {
        getSecretWord();
        badGuessCache.length = 0;
        for (var key in guessCache) {
            delete guessCache[key];
        }
        totalGuesses = 6;
        $guessResult.empty();
        $badGuessCache.empty();
        $userProgress.empty();
    });

    function playGame() {
        if (totalGuesses > 0 && !guessed) {
            match = false;
            setUserGuess();
            if (guessCache[userGuess] || !LETTERS[userGuess]) {
                guessAgain();
                return;
            }
            guessCache[userGuess] = true;     
            for (var i = 0; i < secretWord.length; i++) {
                if (userGuess === secretWord[i]) {
                    match = true;
                    userProgress[i] = userGuess;
                }
            }
            if (!match) {
                badGuessCache.push(userGuess);
                totalGuesses--;
            }
            showProgress(); 
            showResult();
            showLivesLeft();
            showBadGuesses();               
            if (userProgress.indexOf('__') === -1) {
                guessed = true;
                userWins();
            }
        }
        if (totalGuesses === 0 && !guessed) {
            userLoses();
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
        playGame();
        var $inputGuess = $('#inputGuess');
        $inputGuess.val('');
    });
});