var path = require('path')

let domains = {
	'i.imgur.com' : i_imgur,
	'imgur.com' : imgur,
	'gfycat.com' : gfycat,
	'media.giphy.com' : default_
}

let wanted_extensions = {
	'.jpg':'',
	'.jpeg':'',
	'.gif':'',
	'.gifv':'',
	'.png':'',
	'.webp':''
}

function imgur(url) {
	if (path.extname(url)==='.gifv'){
		url = `https://imgur.com/download/${path.basename(url)}`;
	}else{
		url = 'https://i.imgur.com/'+path.basename(url)+'.jpg'
	}
	return default_(url)
}

function i_imgur(url) {
	if (path.extname(url)==='.gifv') {
		url = `https://imgur.com/download/${path.basename(url)}`;
	}
	return default_(url)
}

function gfycat(url){
	// url = 'https://giant.gfycat.com/'+path.basename(url)+'.gif'
	url = 'https://thumbs.gfycat.com/'+path.basename(url)+'-size_restricted'+'.gif'
	return default_(url)
}

function default_(url){
	return (path.extname(url)!=='' && path.extname(url).toLowerCase() in wanted_extensions) ? url : undefined
}

module.exports = (domain, url) => {
	return (domain in domains) ? domains[domain](url) : default_(url);
}