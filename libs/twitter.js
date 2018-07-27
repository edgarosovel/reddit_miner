var fs = require('fs')
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
	//upload
    // log.info(`uploading ${media_path}`)
    // // post media via the chunked media upload API.
	T.postMediaChunked({ file_path: media_path }, function (err, data, response) {
	// var b64content = fs.readFileSync(media_path, { encoding: 'base64' })
	// T.post('media/upload', { media_data: b64content }, function (err, data, response) {
	  if (err) {
	  	delete_media(media_path)
	  	log.error(`Error uploading: ${media_path} ${err}`)
	  	return callback(true)
	  }
	  var mediaIdStr = data.media_id_string
	  var altText = imgDesc
	  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
      // log.info(`diting metadata ${media_path}`)
	  //update metadata
	  T.post('media/metadata/create', meta_params, function (err, data, response) {
	    if (err) {
	    	delete_media(media_path)
	    	log.error(`Error updating metadata: ${media_path} for ${mediaIdStr}`)
	    	return callback(true)
	    }
	    var params = { status: text, media_ids: [mediaIdStr] }
		//tweet it
        // log.info('tweeting')
	    T.post('statuses/update', params, function (err, data, response) {
	      if (err) {
	    	log.error(`Error tweeting: ${err} ${text}`)
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
