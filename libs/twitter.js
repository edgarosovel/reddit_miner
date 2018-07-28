var Twit = require('twit')
var log = require('winston')
var path = require('path')
var rmdir = require('rmdir')
const config = require(`${__dirname}/../config`)

var T = new Twit({
  consumer_key:         config.CONSUMER_KEY,
  consumer_secret:      config.CONSUMER_SECRET,
  access_token:         config.ACCES_TOKEN,
  access_token_secret:  config.ACCES_TOKEN_SECRET
})

function tweet_with_media (media_path, imgDesc, text, callback){
	return;
	T.postMediaChunked({ file_path: media_path }, function (err, data, response) {
	  if (err) {
	  	delete_media(media_path)
			// log.error(`Error uploading: ${media_path} ${err}`)
			console.log(`Error uploading: ${media_path} ${err}`)
	  	return callback(true)
	  }
	  var mediaIdStr = data.media_id_string
	  var altText = imgDesc
	  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

	  T.post('media/metadata/create', meta_params, function (err, data, response) {
	    if (err) {
				delete_media(media_path)
				console.log(`Error updating metadata: ${media_path} for ${mediaIdStr}`);
	    	// log.error(`Error updating metadata: ${media_path} for ${mediaIdStr}`)
	    	return callback(true)
	    }
	    var params = { status: text, media_ids: [mediaIdStr] }

	    T.post('statuses/update', params, function (err, data, response) {
	      if (err) {
				console.log(`Error tweeting: ${err} ${text}`);
	    	// log.error(`Error tweeting: ${err} ${text}`)
	    	delete_media(media_path)
	    	return callback(true)
	      }
	      //tweeted!
	      delete_media(media_path)
	      return callback(false)
	    })

	  })
	})
}

function delete_media(media_path){
	rmdir(path.dirname(media_path),(err)=>{
      	if (err) return log.error(`${media_path} not deleted. ${err}`)
      	//folder deleted
	})
}

module.exports = {
	tweet:(file_path, txt, emoji, callback)=>{
        txt = txt.replace(/reddit/i,'').replace(/\/?r\/([^\s]+)/g,'').replace(/x-?post/i,'')
        let msg = `${emoji}: "${txt}"`
        tweet_with_media(file_path, txt, msg, callback)
    }
}
