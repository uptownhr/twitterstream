var util = require('util'),
    twitter = require('twitter'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.56.254/tweetfav', function(err,res){
    console.log(err,res);
});

var tweetSchema = new mongoose.Schema({
    tweet: {},
    created: {type: Date, default: Date.now },
    updated: {type: Date, default: Date.now }
});



var twit = new twitter({
    consumer_key: 'ElPeiVDhBcGH1G6r7vjVJ2vrm',
    consumer_secret: 'I1nkwdMTO2o6BMK5Ou6IX3Mq4zDHvLPHjzkfwy84QvVAANGFOy',
    access_token_key: '1408850774-X5y2WLU6OC02pV51qpLLRMqZa8Ey8rtgJAQBMOl',
    access_token_secret: 'IX1VDJE0xaOM94fQejOSoUhyxA8Kbnttco5zFiqHlRVQ5'
});

//node-twitter also supports user, filter and site streams:
var track = '#startups,#startup,#launch,#entrepreneurs';
console.log('streaing starts');
twit.stream('filter', {track:track}, function(stream) {
    console.log('listening', track);
    stream.on('data', function(data) {
        var user = data.user;
        var followers = user.followers_count;
        var friends = user.friends_count;

        var friend_ratio = followers / friends;
        var tweet_id = data.id_str;

        var random = getRandom(1,5) * 1000;

        if(followers > 100 & friend_ratio > 3 & user.lang == 'en'){
            if(!data.favorited & (data.text.split("#").length - 1) <= 2 ){
                console.log("\n\nfound one",random);
                setTimeout(
                    createFavorite(tweet_id),
                    random
                );
            }

        }else{
            console.log("\n\nnot good enough",friend_ratio, user.screen_name,user.description, user.verified);
        }
    });
    // Disconnect stream after five seconds
    //setTimeout(stream.destroy, 500000);
});

function createFavorite(tweet_id){
    twit.post('/favorites/create.json',{id:tweet_id}, function(data){
        if(data.favorited){
            console.log('favorited',tweet_id, data.user.screen_name, data.text);
        }
    });
}

// Returns a random number between min and max
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}