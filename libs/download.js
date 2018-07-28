var fs = require('fs')
var path_ = require('path')
var rmdir = require('rmdir')
var request = require('request')
var log = require('winston')
const config = require(`${__dirname}/../config`)

fs.readdirSync(`${__dirname}/../img/`)
    .map(dir => delete_download(`${__dirname}/../img/${dir}`))

module.exports =
	(uri, filename, post_id, callback) => {
		let path = `${__dirname}/../img/${post_id}/`
		fs.mkdir(path, (err) =>{
			if (err) {
				log.error(`Mkdir failed: ${post_id} ${filename}`)
				return callback(err)
			}
		})
		request(uri).pipe(fs.createWriteStream(path+filename).on('error', function (err) {
			// log.error(`${err}`)
			console.log(`${err}`)
		   	error_downloading('Error media write stream', uri, path)
		   	callback(err)
		})).on('close', ()=>{ 
			//close write stream
		}).on('error', (err)=>{
			console.log(`${err}`)
			// log.error(`${err}`)
			error_downloading('Error on url request',uri, path)
			callback(err)
		}).on('close', ()=>{ 
			//close uri request
			if (is_size_ok(path+filename)){ //downlaod correct
				callback(false,path+filename)
			}else{
				log.error(`File too large ${uri} ${post_id} ${filename}`)
				delete_download(path)
				callback(true)
			}
			
		})
	}

function is_size_ok(file){
	try{
		const size = fs.statSync(file).size
		if (path_.extname(file).toLowerCase()==='.gif') {
			return size > config.GIF_SIZE ? false : true
		}else{
			return size > config.PIC_SIZE ? false : true
		}
	}catch(e){
		console.log('file already deleated');
	}
}

function error_downloading(err, uri, path){
	delete_download(path)
	// log.error(`Download failed: ${err}\nUri: ${uri}`)
	console.log(`Download failed: ${err}\nUri: ${uri}`)
}

function delete_download(path){
	rmdir(path, function (err, dirs, files) {
	  if (err) {
		//   log.error(`Rmdir failed on: ${path}`)
		  console.log(`Rmdir failed on: ${path}`);
	  }
	})
}