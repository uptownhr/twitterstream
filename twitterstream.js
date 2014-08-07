var util = require('util'),
    twitter = require('twitter');

var twit = new twitter({
    consumer_key: 'plYNGZfnZAyHlUjE2rXn2vHtN',
    consumer_secret: 'xnxNzfnokN7PaMvaTXDjQb4l1eC0cyoRVHbelZ5luU3i6Ujdto',
    access_token_key: '1408850774-X5y2WLU6OC02pV51qpLLRMqZa8Ey8rtgJAQBMOl',
    access_token_secret: 'IX1VDJE0xaOM94fQejOSoUhyxA8Kbnttco5zFiqHlRVQ5'
});

//node-twitter also supports user, filter and site streams:
//var track = '#startups,#startup,#launch,#entrepreneurs';
var track = 'producthunt,startuplist,startupletter,betalist';
console.log('streaming starts');
twit.stream('filter', {track:track}, function(stream) {
    console.log('listening', track);
    stream.on('data', function(data) {
	console.log('wtf');
        var user = data.user;
        var followers = user.followers_count;
        var friends = user.friends_count;

        var friend_ratio = followers / friends;

	if(data.text.split('@').length > 2 && data.text.length > 40){
	    
            if(followers > 100 & friend_ratio > 2 & user.lang == 'en'){
		if(!data.favorited & (data.text.split("#").length - 1) <= 2 ){
                    var tweet_id = data.id_str;
                    console.log("\n\nfound one",tweet_id);
                    createFavorite(tweet_id);
		}else{
                    console.log("\n\nnot good enough", data.text);
		}

            }else{
		console.log("\n\nnot good enough",friend_ratio, user.screen_name,user.description, user.verified);
            }
	}else{
	    console.log("\n\n not enough mentions \n");
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
