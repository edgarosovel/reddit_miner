var reddit = require('./libs/reddit')
var download = require('./libs/download')
var clean_url = require('./libs/clean_url')
var log = require('./libs/log')
var twitter = require('./libs/twitter')
var db = require('./libs/db')
const config = require('./config')

var waiting_for_post = false
var subreddits = config.subreddits
var intervalID

log.info('||||||||STARTING|||||||||')

for (let subreddit in subreddits){
    reddit.watch_subreddit(subreddit, subreddits[subreddit][1],subreddits[subreddit][2], subreddits[subreddit][0], db.save_post, wait_for_post)
}

intervalID = setInterval(make_post, config.MINS_BETWEEN_TWEETS*60000)

function make_post(){
    db.get_post((err,post)=>{
        // log.info(`selected ${post[0].data.title} ${post[0].data.id}`)
        if (err) {throw err}
        if (post[0]===null || post[0]===undefined) {
            waiting_for_post = true
            // log.info(`waiting for post`)
            return clearInterval(intervalID)
        }
        // log.info(`stickied: ${post[0].data.stickied} t3: ${post[0].kind} url: ${post[0].data.url} title: ${post[0].data.title}`)
        if (!post[0].data.stickied && post[0].kind === 't3') {
            let url = clean_url(post[0].data.domain,post[0].data.url)
            log.info(`url cleaned: ${url}`)
            if (url===undefined) return delete_and_retry(post[0]._id)
            download(url[0], url[1], post[0].data.id, (err, media_path)=>{
                if (err) return delete_and_retry(post[0]._id)
                // log.info(`Downloaded ${media_path}`)
                let title = post[0].data.title
                let emoji = post[0].emoji
                // let author = post[0].data.author
                // let texto: ${post[0].data.selftext}
                // let link: ${post[0].data.permalink}
                twitter.tweet(media_path,title,emoji,(err)=>{
                    if (err) return delete_and_retry(post[0]._id)
                    // log.info(`tweeted! ${media_path}`)
                    if (intervalID===undefined) intervalID = setInterval(make_post, config.MINS_BETWEEN_TWEETS*60000)
                    db.delete_post(post[0]._id,()=>{})
                })  
            })
        }else{
           delete_and_retry(post[0]._id)
        }
    })
}

function wait_for_post(err){
    if (waiting_for_post) {
        intervalID = setInterval(make_post, config.MINS_BETWEEN_TWEETS*60000)
        waiting_for_post = false
    }
}

function delete_and_retry(id){
    // log.info('delete_and_retry')
    db.delete_post(id,()=>{
        make_post()
    })
    clearInterval(intervalID)
    intervalID=undefined
}
