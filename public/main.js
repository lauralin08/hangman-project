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
    
    var badGuessCache = [];

    function getSecretWord() {
        $.ajax('/words' , {
            success: function(secretWord) {
                secretWord = secretWord.toUpperCase();
                if (wordCache[secretWord]) {
                    getSecretWord();
                } else {
                    wordCache[secretWord] = true;
                    var userProgress = [];
                    for (var i = 0; i < secretWord.length; i++) {
                        userProgress[i] = '__';
                    }
                    console.log('You have 6 guesses. Guess the following word: ' + userProgress);

                    var match;
                    var userGuess;
                    var guessed;
                    var totalGuesses = 6;
                    // var guessCache = {};

                    var $livesLeft = $('.lives-left');

                    function showLivesLeft() {
                        $livesLeft.empty();

                        var $lives = $('You have ' + totalGuesses + ' guesses left. Guess a letter!');
                        $livesLeft.append($lives);
                    }

                    function guessAgain() {
                        $livesLeft.empty();

                        var $guessAgain = $('Please guess a letter in the English alphabet.');
                        $livesLeft.append($guessAgain);
                    }

                    function showProgress() {
                        var $userProgress = $('.user-progress');
                        $userProgress.empty();

                        var $userGuess = $('<div>Your guess: ' + userGuess + '      ');
                        $userProgress.append($userGuess);

                        var $progress = $(' Your progress: ' + userProgress + '</div>');
                        $userProgress.append($progress);
                    }

                    function showBadGuesses() {
                        var $badGuessCache = $('.bad-guesses');
                        $badGuessCache.empty();
                        
                        var $badGuesses = $('<br><div>Incorrectly guessed: ' + badGuessCache + '<div>');
                        $badGuessCache.append($badGuesses);
                    }

                    var $guessSubmit = $('.guess-submit');
                    $guessSubmit.on('click', function(event) {
                        var $userGuess = $('.form-control');
                        userGuess = $userGuess.val();
                        while (totalGuesses > 0 && !guessed) {
                            showLivesLeft(); //HOW TO UPPERCASE FORM INPUT???
                            // if (guessCache[userGuess]) {
                            //     userGuess = prompt('You already guessed that letter! Guess another letter.').toUpperCase();
                            // }
                            while (!LETTERS[userGuess]) {
                                guessAgain();
                            }
                            // guessCache[userGuess] = true;
                            match = false;
                            for (var i = 0; i < secretWord.length; i++) {
                                if (userGuess === secretWord[i]) {
                                    match = true;
                                    userProgress[i] = userGuess;
                                }
                            }
                            if (!match) {
                                totalGuesses--;
                                badGuessCache.push(userGuess);
                                console.log('Ouch... the rope tightened.');
                            }
                            showProgress();                
                            if (userProgress.indexOf('__') === -1) {
                                guessed = true;
                                console.log('You guessed the word and saved him! Congratulations--you won!');
                            }
                        }
                    })
                    if (!guessed) {
                        console.log('Sorry, you lost! The word was "' + secretWord + '". Too bad... Click "Play Now" to try again.');
                    }
                }
            }
        })
    }

});