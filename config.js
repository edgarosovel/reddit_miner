CONFIG_DEV = {};

try {
	CONFIG_DEV = require('./config_dev');
}catch(e){
	console.log("No DEV keys found. Deploy mode on.");
}

module.exports = {
	CONSUMER_KEY: process.env.CONSUMER_KEY || CONFIG_DEV.CONSUMER_KEY,
	CONSUMER_SECRET: process.env.CONSUMER_SECRET || CONFIG_DEV.CONSUMER_SECRET,
	ACCES_TOKEN: process.env.ACCES_TOKEN || CONFIG_DEV.ACCES_TOKEN,
	ACCES_TOKEN_SECRET: process.env.ACCES_TOKEN_SECRET || CONFIG_DEV.ACCES_TOKEN_SECRET,
	STARTUP_TIME: 10 * 1000, //En milisegundos
	MAX_GIF_SIZE: 15728640,
	MAX_PIC_SIZE: 5242880,
	MAX_MEDIA_SIZE: 15728640,
	subreddits: JSON.parse(process.env.SUBREDDITS || CONFIG_DEV.SUBREDDITS)
}