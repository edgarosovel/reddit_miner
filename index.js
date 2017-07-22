var download = require('./libs/download')
var clean_url = require('./libs/clean_url')
var Snooper = require('reddit-snooper')
var winston = require('winston')
var log = require('./libs/log')
var twitter = require('./libs/twitter')
require('dotenv').config()

var subreddits = {
    pics:process.env.NUM_OF_POSTS,
    funny:process.env.NUM_OF_POSTS,
    mildlyinteresting:process.env.NUM_OF_POSTS
}

snooper = new Snooper({automatic_retries: true,
            api_requests_per_minuite: 60 })

for (let subreddit in subreddits){
    watch_subreddit(subreddit)
}

function watch_subreddit(sub){
    snooper.watcher.getListingWatcher(sub, {
        listing: 'top_day',
        limit: process.env.NUM_OF_POSTS
    }).on('item', handle_post).on('error', ()=>{
        log.error(`Error on watcher of ${sub}`)
        setTimeout(watch_subreddit(sub), process.env.RETRY_MINS*60000);
    })
}

function handle_post(post){
    let subreddit = post.data.subreddit_name_prefixed.slice(2)
    if (subreddits[subreddit]!==0) return subreddits[subreddit]--
    let author
    let title
    let link
    if (!post.data.stickied && post.kind === 't3') {
        let url = clean_url(post.data.domain,post.data.url)
        if (url===undefined) return //log.error(`\nCouldn't clean url of media: ${post.data.url}Post: ${post.data.permalink}`)
        console.log("post")
        download(url[0], url[1], post.data.id, format_tweet)
        title = post.data.title
        // author = post.data.author
        // texto: ${post.data.selftext}
        // link: ${post.data.permalink}
    }

    function format_tweet(file_path){
        let txt = `"${title}"`
        twitter.tweet_with_media(file_path, title, txt)
    }
}
