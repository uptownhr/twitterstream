var util = require('util'),
    twitter = require('twitter');

var twit = new twitter({
    consumer_key: '0pBTNm0NPIUG3uoLFSEGUG0Ae',
    consumer_secret: 'iqgQV9AiFO2yM3uWDL8wdfZwNoKPJJ7SSWSMY9JGzQ0SYfqsce',
    access_token_key: '1408850774-Rk77XBX3yhwDBW3Z2fjQyVp0GNoAOUVzXKzFekh',
    access_token_secret: '65zgt44BUkcPmkCDFLN9wajxXvRtgfiVpKLBbtjRWAlqH'
});

//node-twitter also supports user, filter and site streams:
var track = '#startups,#startup,#launch';
console.log('streaing starts');
twit.stream('filter', {track:track}, function(stream) {
    console.log('inside stream');
    stream.on('data', function(data) {
        console.log(data.id,data.text);
    });
    // Disconnect stream after five seconds
    setTimeout(stream.destroy, 50000);
});