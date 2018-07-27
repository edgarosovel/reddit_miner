var Snooper = require('reddit-snooper')
snooper = new Snooper({automatic_retries: true,
            api_requests_per_minuite: 60 })
var i = 4

module.exports = {
	watch_subreddit : (subreddit, list, emoji ,num_of_posts, save_post, notify) => {
	    snooper.watcher.getListingWatcher(subreddit, {
	        listing: list,
	        limit: num_of_posts
	    }).on('item', post => {
	    	setTimeout(()=>{
	    		post.emoji = emoji
	    		i = i <= 0 ? 0 : i-0.2
	    		save_post(post, notify)
	    	}, (Math.random()*(i-0)+0)*1000)
	    }).on('error', console.error//()=>{
	        //log.error(`Error on watcher of ${sub}`)
	        //setTimeout(watch_subreddit, config.RETRY_MINS*60000,sub)
	    	//}
	    )
	}
}