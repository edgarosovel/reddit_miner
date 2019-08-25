var path = require('path')

let domains = {
	'i.imgur.com' : i_imgur,
	'imgur.com' : imgur,
	'gfycat.com' : gfycat,
	'media.giphy.com' : giphy,
	'v.redd.it' : v_redd_it
}

let wanted_extensions = {
	'.jpg':'',
	'.jpeg':'',
	'.gif':'',
	'.png':'',
	'.webp':'',
	'.mp4':''
}

function imgur(params) {
	if (path.extname(params.url)=='.gifv'){
		url = `https://i.imgur.com/${path.basename(params.url,'.gifv')}.mp4`;
		//url = `https://imgur.com/download/${path.basename(url,'.gifv')}`;
	}else{
		url = `https://i.imgur.com/${path.basename(params.url)}.jpg`;
	}
	return url;
}

function giphy(params) {
	if (path.extname(params.url)=='.gif'){
		startIndex = params.url.search(/media\//i) + 6; // +6 para contemplar la misma palabra /media
		finishIndex = params.url.search(/\/giphy/i);
		url = `https://i.giphy.com/media/${params.url.substring(startIndex, finishIndex)}/giphy.mp4`;
	}
	return url;
}

function v_redd_it(params) {
	return params.fallback_url;
	url = `${params.url}/DASH_480`;
	//url = `${url}/HLSPlaylist.m3u8`;
	return url;
}

function i_imgur(params) {
	if (path.extname(params.url)=='.gifv') {
		url = `https://i.imgur.com/${path.basename(params.url,'.gifv')}.mp4`;
		//url = `https://imgur.com/download/${path.basename(url,'.gifv')}`;
	}
	return url;
}

function gfycat(params){
	// url = 'https://giant.gfycat.com/'+path.basename(url)+'.gif'
	// url = `https://thumbs.gfycat.com/${path.basename(url)}-size_restricted.gif`;

	if (!params.media_embed) return undefined;
	finishIndex = params.media_embed.search(/-size/i);
	startIndex = undefined;
	for (let index = finishIndex; index > 0; index--) {
		if (params.media_embed[index] == '2'){ //buscamos el %2F (/) mas cercano, donde empieza el hash identificador
			startIndex = index += 2; // para contemplar el %2F
			break;
		}	
	}
	if (!startIndex) return undefined;
	url = `https://giant.gfycat.com/${params.media_embed.substring(startIndex, finishIndex)}.mp4`;
	return url;
}

function default_(url){
	return (path.extname(url)!=='' && path.extname(url).toLowerCase() in wanted_extensions) ? url : undefined;
}

module.exports = (link) => {
	return (link.domain in domains) ? domains[link.domain](link) : default_(link.url);
}