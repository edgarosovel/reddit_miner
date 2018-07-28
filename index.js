var reddit = require('./libs/reddit')
var log = require('./libs/log')
const http = require('http')
const config = require('./config')
var subreddits = config.subreddits

console.log(`    ||||||||STARTING|||||||||   `)

console.log('Loading subreddits...');
for (let subreddit of subreddits){
    reddit.watch_subreddit(subreddit);
}

//keep alive on heroku
// setInterval(function () {
//     var options = {
//       host: 'google.com',
//       port: 80,
//       path: '/'
//     };
  
//     http.get(options, function(res) {
//       res.on('data', function(chunk) {
//           //pass
//       });
//     }).on('error', function(err) {
//         console.error(err);
//     });
//   }, 1800000); // Cada 30 minutos.