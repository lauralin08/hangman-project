// Retrieve path module
var path = require('path');
// Retrieve express module
var express = require('express');
// Call express module
var app = express();
// Retrieve axios module
var axios = require('axios');

// Retrieve port number OR use local host 3000
var PORT = process.env.PORT || 3000;

// Generate static path from current directory and public folder
var staticPath = path.join(__dirname, '/public');

var words = {};
function getRandomWord(difficulty) {
    var levelWords = words[difficulty];
    var randomNumber = Math.floor(Math.random() * levelWords.length);
    return levelWords[randomNumber];
}

app.get('/words', function (req, res) {
    console.log('query', req.query);
    var difficulty = req.query.difficulty;
    if (!words[difficulty]) {
        axios.get('http://linkedin-reach.hagbpyjegb.us-west-2.elasticbeanstalk.com/words', {
            params: {
                difficulty: difficulty
            }
        })
        .then(function(response) {
            words[difficulty] = response.data.split('\n');
            res.send(getRandomWord(difficulty));
        })
        .catch(function(error) {
            console.log(error);
        });
    } else {
        res.send(getRandomWord(difficulty));
    }  
});

// Load assets from static path
app.use(express.static(staticPath));

// Start listening on designated port
app.listen(PORT, function () {
    console.log('Listening on port ' + PORT + '!');
});