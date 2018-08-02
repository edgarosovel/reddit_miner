var Snooper = require('reddit-snooper')
snooper = new Snooper({automatic_retries: true,
			api_requests_per_minuite: 60 })
var clean_url = require('./clean_url')
var twitter = require('./twitter')
const config = require(`${__dirname}/../config`)
var on_startup = true;

setTimeout(()=>{
	on_startup=false;
	console.log("Subreddits loaded, boi.");
},config.STARTUP_TIME);

function make_post_only_text(post) {
	let title = post.data.title
	twitter.tweet({txt:title},(err)=>{
		if (err) return;
		console.log(`rss: ${process.memoryUsage().rss/1024/1024} heapTotal: ${process.memoryUsage().heapTotal/1024/1024} heapUsed: ${process.memoryUsage().heapUsed/1024/1024} external: ${process.memoryUsage().external/1024/1024}`);
	});  	
}

function make_post_with_media(post) {
    if (post.kind !== 't3') return;
	let url = clean_url(post.data.domain, post.data.url);
	if (global.gc) global.gc();
	if (!url) return;
	let title = post.data.title
	let emoji = post.emojis
	twitter.tweet({media_URL:url, txt:title, emoji},(err)=>{
		if (err) return;
		console.log(`rss: ${process.memoryUsage().rss/1024/1024} heapTotal: ${process.memoryUsage().heapTotal/1024/1024} heapUsed: ${process.memoryUsage().heapUsed/1024/1024} external: ${process.memoryUsage().external/1024/1024}`);
	});  	
}

function handle_post(post){
	if (!post || post.data.stickied || post.data.title.length > config.MAX_TWEET_CHARACTERS) return; 
	if (global.gc) global.gc();
	if (post.type == 'media') make_post_with_media(post);
	else if(post.type == 'text') make_post_only_text(post);
}

module.exports = {
	watch_subreddit : (subreddit) => {
	    snooper.watcher.getListingWatcher(subreddit.subreddit, {
	        listing: subreddit.list,
	        limit: subreddit.num_of_posts
	    }).on('item', post => {
			if (on_startup) return;
			post.emojis = subreddit.emojis;
			post.type = subreddit.type;
			handle_post(post);
		}).on('error', console.error)
		console.log(`   ${subreddit.subreddit} | List: ${subreddit.list} | Posts: ${subreddit.num_of_posts}`); 
	}
}