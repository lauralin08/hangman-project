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

var words;
function getRandomWord() {
    var randomNumber = Math.floor(Math.random() * words.length);
    return words[randomNumber];
}

app.get('/words', function (req, res) {
    if (!words) {
        axios.get('http://linkedin-reach.hagbpyjegb.us-west-2.elasticbeanstalk.com/words', {
            params: {
                difficulty: 5 // Restricted words to average difficulty, add variable later
            }
        })
        .then(function(response) {
            words = response.data.split('\n');
            res.send(getRandomWord());
            console.log(getRandomWord());
        })
        .catch(function(error) {
            console.log(error);
        });
    } else {
        res.send(getRandomWord());
        console.log(getRandomWord());
    }  
});

// Load assets from static path
app.use(express.static(staticPath));

// Start listening on designated port
app.listen(PORT, function () {
    console.log('Listening on port ' + PORT + '!');
});