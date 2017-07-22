var path = require('path')
var url_ = require('url')

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
	url = 'https://i.imgur.com/'+path.basename(url)+'.jpg'
	return default_(url)
}

function i_imgur(url) {
	if (path.extname(url)==='.gifv') url = url.substring(0, url.length - 1);
	return default_(url)
}

function gfycat(url){
	url = 'https://giant.gfycat.com/'+path.basename(url)+'.gif'
	return default_(url)
}

function default_(url){
	return (path.extname(url)!=='' && path.extname(url).toLowerCase() in wanted_extensions) ? [url, path.basename(url)] : undefined
}

module.exports = (domain, url) => {
	return (domain in domains) ? domains[domain](url) : default_(url)
}