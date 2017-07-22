var fs = require('fs')
var rmdir = require('rmdir')
var request = require('request')
var path_ = require('path')
var log = require('winston')

module.exports =
	(uri, filename, post_id, callback) => {
		// console.log(`dirname ${__dirname}`)
		// console.log(`cwd ${process.cwd()}`)
		let path = `${__dirname}/../img/${post_id}/`
		fs.mkdir(path, (err) =>{
			if (err) return log.error(`Mkdir failed: ${path}`)
		})
		request(uri).pipe(fs.createWriteStream(path+filename).on('error', function (err) {
		   	error_downloading('Error on saving to server', uri, path)
		})).on('close', ()=>{
			callback(path+filename)
		}).on('error', (err)=>{
			error_downloading('Error on url request',uri, path)
		})
	}

function error_downloading(err, uri, path){
	rmdir(path, function (err, dirs, files) {
	  if (err) {
	  	log.error(`Rmdir failed on: ${path}`)
	  }
	})

	log.error(`Download failed: ${err}\nUri: ${uri}`)
}