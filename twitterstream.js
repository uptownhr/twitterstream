var util = require('util'),
    twitter = require('twitter');

var config = require('./config.js');

//example
/*
module.exports = {
    consumer_key: 'plYNGZfnZAyHlUjE2rXn2vHtN',
    consumer_secret: 'xnxNzfnokN7PaMvaTXDjQb4l1eC0cyoRVHbelZ5luU3i6Ujdto',
    access_token_key: '1408850774-X5y2WLU6OC02pV51qpLLRMqZa8Ey8rtgJAQBMOl',
    access_token_secret: 'IX1VDJE0xaOM94fQejOSoUhyxA8Kbnttco5zFiqHlRVQ5'
};
*/
var twit = new twitter(config);

//node-twitter also supports user, filter and site streams:
//var track = '#startups,#startup,#launch,#entrepreneurs';
var users = [];
var track = 'producthunt,betalist,startupletters,startuplist,venturehacks,newsycombinator,hackernews,growthhackers,launchingnext,astartupworld';
console.log('streaming starts');
twit.stream('filter', {track:track}, function(stream) {
    console.log('listening', track);
    stream.on('data', function(data) {
        var user = data.user;
	var user_favorited = users.indexOf(user.id);

	console.log(user.screen_name,data.text);
	console.log(user.id, user_favorited);

	if(user.id && user_favorited == -1){
	    var followers = user.followers_count;
            var friends = user.friends_count;
            var friend_ratio = followers / friends;
	    var retweet_check = retweeted(data.text);
	    var track_mentions = track_keyword_mentioned(data.text);

	    console.log('friend ratio: ',friend_ratio);
	    console.log('retweet_check: ', retweet_check);
	    console.log('track_mentions: ', track_mentions);
	    
	    if(friend_ratio >= 1 && retweet_check == false && track_mentions == false){
		console.log('pass');
		users.push(user.id);
		var tweet_id = data.id_str;
		createFavorite(tweet_id);
	    }else{
		console.log('fail');
	    }
	}else{
	    console.log('fail: already favorited user');
	}
    });
    
    stream.on('error', function(data){
	console.log(data);
    });
    // Disconnect stream after five seconds
    //setTimeout(stream.destroy, 500000);
});

function createFavorite(tweet_id){
    var random = getRandom(15,100) * 1000;
    setTimeout( function(){
        twit.post('/favorites/create.json',{id:tweet_id}, function(data){
            if(data.favorited){
                console.log('favorited',tweet_id, data.user.screen_name, data.text);
            }
        });
    },random);
}

// Returns a random number between min and max
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}


function retweeted(tweet){
    if(tweet.indexOf('RT ') != -1){
 return true;
    }

    return false;
}

function track_keyword_mentioned(tweet){
    var keywords = track.split(',');
    var found = false;
    keywords.forEach( function(v){
	var text = '@' + v;
	var regex = new RegExp(text,"i");

	if(tweet.search(regex) != -1){
	    console.log('@' + v);
	    found = true;
	    return true;
	}
    } );

    return found;
}
