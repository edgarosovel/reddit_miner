var reddit = require('./libs/reddit')
var log = require('./libs/log')
const config = require('./config')
var subreddits = config.subreddits

log.info(`    ||||||||STARTING|||||||||   `)

console.log('Loading subreddits...');
for (let subreddit of subreddits){
    reddit.watch_subreddit(subreddit);
}