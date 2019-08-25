const Twit = require('twit')
const path = require('path')
var log = require('winston')
var fs = require('fs')
var tmp = require('tmp')
const request = require('request')
const config = require(`${__dirname}/../config`)
const bl = require('bl');

var T = new Twit({
  consumer_key:         config.CONSUMER_KEY,
  consumer_secret:      config.CONSUMER_SECRET,
  access_token:         config.ACCES_TOKEN,
  access_token_secret:  config.ACCES_TOKEN_SECRET
})

function is_size_ok(size, file_extension){
	if (file_extension == '.gif') 
		return size < config.MAX_GIF_SIZE;
	if (file_extension == '.jpg' || file_extension == '.jpeg' || file_extension == '.png'){
		return size < config.MAX_PIC_SIZE;
	}
	return size < config.MAX_MEDIA_SIZE;
}

function tweet_with_media (media_URL, txt, prefix, callback){
	let text = `${prefix}${txt}`;
	request(media_URL).pipe(bl(function (err, data) {
			if (err) return callback(err)
			file_extension = path.extname(media_URL).toLowerCase();
			if (!is_size_ok(data.toString().length, file_extension)) return callback(true);
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

function tweet_with_media_chunked(media_URL, txt, prefix, callback) {
	let text = `${prefix}${txt}`;
	request(media_URL).pipe(bl(function (err, data) {
		if (err) {
			console.log(err);
			return callback(err);
		}
		file_extension = path.extname(media_URL).toLowerCase();

		if (!is_size_ok(data.toString().length, file_extension)) {
			console.log(`Size too big for tweet: ${file_extension} - ${data.toString().length}`);
			return callback(true);
		}
		if(!file_extension.includes('.')){
			file_extension = '.mp4';
		}
		tmp.file({ postfix: file_extension }, function _tempFileCreated(err, filePath, fd, cleanupCallback) {
			if (err) throw err;
			fs.appendFile(filePath, data, (err) => {
				if (err) {
					cleanupCallback();
					throw err;
				}
				if (config.IS_DEVELOPER_MODE){
					console.log(`${filePath} -> ${media_URL}`);
					console.log('Post tweet');
					cleanupCallback();
					return;
				}
				T.postMediaChunked({ file_path: filePath }, function (err, data, response) {
					delete data;
					if (err) {
						console.log(`Error uploading: ${media_URL} ${err}`);
						cleanupCallback();
						return callback(err);
					}
					var mediaIdStr = data.media_id_string;
					var altText = txt;
					var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
			
					T.post('media/metadata/create', meta_params, function (err, data, response) {
						delete data;
						if (err) {
							console.log(`Error updating metadata: ${media_URL} for ${mediaIdStr}`); 
							// log.error(`Error updating metadata: ${media_path} for ${mediaIdStr}`)
							cleanupCallback();
							return callback(err)
						}
						var params = { status: text, media_ids: [mediaIdStr] }
			
						T.post('statuses/update', params, function (err, data, response) {
							if (err) {
								console.log(`Error tweeting: ${err} ${text}`);
								// log.error(`Error tweeting: ${err} ${text}`)
								cleanupCallback();
								return callback(err)
							}
							//tweeted!
							cleanupCallback();
							return callback(false)
						})
			
					})
				});
			});
			//cleanupCallback();
		});
	}))
	.on('error', (err)=>{
		console.log(`Error downloading media ${err}`)
		return callback(err)
	});

}

function tweet_only_text (txt, callback){
	var params = { status: txt}
	if (config.IS_DEVELOPER_MODE){
		console.log('Post tweet');
		return;
	}
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
		.replace(/\s?(\[|\()?\s?\d+\s?(x|×|\*)\s?\d+\s?(\]|\))?/i,'')	//[368x647] or 123x532
		.replace(/&amp;/i,'&')	//&amp; -> &
		.replace(/\s?(\[|\()\s?oc\s?(\]|\))/i,'');	//[OC]
		if (config.IS_DEVELOPER_MODE){
			console.log(params.txt);
		}
		if (params.media_URL)
			// TODO: usar tweet_with_media()?
			tweet_with_media_chunked(params.media_URL, params.txt, params.prefix, callback)
		else
			tweet_only_text(params.txt, callback);
	}
}
