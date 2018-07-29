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
	console.log(`File type ${type} size is ${size}`);
	if (type == '.gif') 
		return size < config.MAX_GIF_SIZE;
	return size < config.MAX_PIC_SIZE;
}

function tweet_with_media (media_URL, imgDesc, text, callback){
	request(media_URL).pipe(bl(function (err, data) {
			if (err) return callback(err)
			if (!is_size_ok(bl.length, path.extname(url).toLowerCase())) return callback(true);
			let base64 = data.toString('base64');
			T.post('media/upload', { media_data: base64 }, 	function (err, data, response) {
				if (err) {
					console.log(`Error uploading: ${media_URL} ${err}`);
					return callback(err);
				}
				var mediaIdStr = data.media_id_string
				var altText = imgDesc
				var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
		
				T.post('media/metadata/create', meta_params, function (err, data, response) {
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
		});

}

module.exports = {
	tweet:(media_URL, txt, emoji, callback)=>{
        txt = txt.replace(/reddit/i,'').replace(/\/?r\/([^\s]+)/g,'').replace(/x-?post/i,'')
        let msg = `${emoji}: "${txt}"`
        tweet_with_media(media_URL, txt, msg, callback)
    }
}
