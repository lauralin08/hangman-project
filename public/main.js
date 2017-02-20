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
    var $hangman = $('.hangman-container');

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
            var $badGuesses = $('<div class="text-danger">Incorrectly guessed: ' + badGuessCache + '<div>');
            $badGuessCache.append($badGuesses);
            console.log('Incorrectly guessed: ' + badGuessCache);
        } else {
            var $none = $('<div class="text-success">No wrong guesses so far!</div>');
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

    function showHangman() {
        $hangman.empty();
        switch(totalGuesses) {
            case 5:
                var $hangman5 = $('<img class="img-responsive center-block hangman-image" src="Hangman5.png" alt="Hangman Diagram"/>');
                $hangman.append($hangman5);
                break;
            case 4:
                var $hangman4 = $('<img class="img-responsive center-block hangman-image" src="Hangman4.png" alt="Hangman Diagram"/>');
                $hangman.append($hangman4);
                break;
            case 3:
                var $hangman3 = $('<img class="img-responsive center-block hangman-image" src="Hangman3.png" alt="Hangman Diagram"/>');
                $hangman.append($hangman3);
                break;
            case 2:
                var $hangman2 = $('<img class="img-responsive center-block hangman-image" src="Hangman2.png" alt="Hangman Diagram"/>');
                $hangman.append($hangman2);
                break;
            case 1:
                var $hangman1 = $('<img class="img-responsive center-block hangman-image" src="Hangman1.png" alt="Hangman Diagram"/>');
                $hangman.append($hangman1);
                break;
            case 0:
                var $hangman0 = $('<img class="img-responsive center-block hangman-image" src="Hangman0.png" alt="Hangman Diagram"/>');
                $hangman.append($hangman0);
                break;
            default:
                var $hangman6 = $('<img class="img-responsive center-block hangman-image" src="Hangman6.png" alt="Hangman Diagram"/>');
                $hangman.append($hangman6);
                break;
        }
    }

    function startGame() {
        $livesLeft.empty();
        var $start = $('<div>You have 6 guesses. Guess the following word: ' + userProgress + '<div>');
        $livesLeft.append($start);
        console.log('You have 6 guesses. Guess the following word: ' + userProgress);
    }

    function guessAgain() {
        $guessResult.empty();
        var $invalid = $('<div class="text-danger">Invalid guess</div>');
        $guessResult.append($invalid);
        
        $livesLeft.empty();
        var $guessAgain = $('<div class="text-danger">Please guess again. Make sure it\'s an English letter that you haven\'t guessed yet!</div>');
        $livesLeft.append($guessAgain);
        console.log("Invalid guess. Please guess again. Make sure it's an English letter that you haven't guessed yet!");
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
        var $winner = $('<div class="winner text-success">You guessed the word and saved the hanging man! Congratulations&mdash;you won! Click "Play Now" to play again.</div>');
        $guessResult.append($winner);
        console.log('You guessed the word and saved the hanging man! Congratulations--you won! Click "Play Now" to play again.');
    }

    function userLoses() {
        $guessResult.empty();
        var $loser = $('<div class="loser text-danger">Sorry, you lost! The word was "' + secretWord + '". Too bad... Click "Play Now" to try again.</div>');
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
            showHangman();
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