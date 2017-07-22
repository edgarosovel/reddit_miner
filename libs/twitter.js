var fs = require('fs')
var Twit = require('twit')
var log = require('winston')
var path = require('path')
var rmdir = require('rmdir')
require('dotenv').config({path: `${__dirname}/../config.env`})

var T = new Twit({
  consumer_key:         process.env.CONSUMER_KEY,
  consumer_secret:      process.env.CONSUMER_SECRET,
  access_token:         process.env.ACCES_TOKEN,
  access_token_secret:  process.env.ACCES_TOKEN_SECRET
})

module.exports = {

	tweet_with_media:(media_path, imgDesc, text)=>{
		var b64content = fs.readFileSync(media_path, { encoding: 'base64' })
		//upload
		T.post('media/upload', { media_data: b64content }, function (err, data, response) {
		  if (err) return log.error(`Error uploading: ${media_path}`)
		  var mediaIdStr = data.media_id_string
		  var altText = imgDesc
		  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
		  //update metadata
		  T.post('media/metadata/create', meta_params, function (err, data, response) {
		    if (err) return log.error(`Error updating metadata: ${media_path} for ${mediaIdStr}`)
		    var params = { status: text, media_ids: [mediaIdStr] }
			//tweet it
		    T.post('statuses/update', params, function (err, data, response) {
		      //tweet successful
		      rmdir(path.dirname(media_path),(err)=>{
		      	if (err) return log.error(`${path.dirname(media_path)} not deleted. ${err}`)
		      	//folder deleted
		      })
		    })

		  })
		})
	}

}

// // post media via the chunked media upload API.
// var filePath = '/absolute/path/to/file.mp4'
// T.postMediaChunked({ file_path: filePath }, function (err, data, response) {
//   console.log(data)
// })
