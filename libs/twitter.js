const Twit = require('twit')
const path = require('path')
var log = require('winston')
const request = require('request')
const config = require(`${__dirname}/../config`)
const bl = require('bl');

var T = new Twit({
  consumer_key:         config.CONSUMER_KEY,
  consumer_secret:      config.CONSUMER_SECRET,
  access_token:         config.ACCES_TOKEN,
  access_token_secret:  config.ACCES_TOKEN_SECRET
})

function is_size_ok(size, type){
	if (type == '.gif') 
		return size < config.MAX_GIF_SIZE;
	if (type == '.jpg' || type == '.jpeg' || type == '.png'){
		return size < config.MAX_PIC_SIZE;
	}
	return size < config.MAX_MEDIA_SIZE;
}

function tweet_with_media (media_URL, txt, emoji, callback){
	let text = `${emoji}: "${txt}"`;
	request(media_URL).pipe(bl(function (err, data) {
			if (err) return callback(err)
			if (!is_size_ok(data.toString().length, path.extname(media_URL).toLowerCase())) return callback(true);
			T.post('media/upload', { media_data: data.toString('base64') }, 	function (err, data, response) {
				delete data;
				if (err) {
					console.log(`Error uploading: ${media_URL} ${err}`);
					return callback(err);
				}
				var mediaIdStr = data.media_id_string;
				var altText = txt;
				var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
		
				T.post('media/metadata/create', meta_params, function (err, data, response) {
					delete data;
					if (err) {
						console.log(`Error updating metadata: ${media_URL} for ${mediaIdStr}`); // log.error(`Error updating metadata: ${media_path} for ${mediaIdStr}`)
						return callback(err)
					}
					var params = { status: text, media_ids: [mediaIdStr] }
		
					T.post('statuses/update', params, function (err, data, response) {
						if (err) {
							console.log(`Error tweeting: ${err} ${text}`); // log.error(`Error tweeting: ${err} ${text}`)
							return callback(err)
						}
						//tweeted!
						return callback(false)
					})
		
				})
			});
		}))
		.on('error', (err)=>{
			console.log(`Error downloading media ${err}`)
			return callback(err)
		});
}

function tweet_only_text (txt, callback){
	var params = { status: txt}
	T.post('statuses/update', params, function (err, data, response) {
		if (err) {
			console.log(`Error tweeting: ${err} ${txt}`); // log.error(`Error tweeting: ${err} ${txt}`)
			return callback(err)
		}
		return callback(false)
	})
}

module.exports = {
	tweet:(params, callback)=>{
		params.txt = params.txt.replace(/reddit/i,'')
		.replace(/\/?r\/([^\s]+)/g,'')	// r/somesubreddit
		.replace(/\s?x\s?-?\s?post/i,'')	// x-post
		.replace(/\s?(\[|\()?\s?\d+\s?(x|×)\s?\d+\s?(\]|\))?/i,'')	//[368x647] or 123x532
		.replace(/\s?(\[|\()\s?oc\s?(\]|\))/i,'');	//[OC]
		if (params.media_URL)
			tweet_with_media(params.media_URL, params.txt, params.emoji, callback)
		else
			tweet_only_text(params.txt, callback);
	}
}
