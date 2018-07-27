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
	MONGO_URL: process.env.MONGO_URL || CONFIG_DEV.MONGO_URL,
	MINS_BETWEEN_TWEETS: process.env.MINS_BETWEEN_TWEETS || CONFIG_DEV.MINS_BETWEEN_TWEETS,
	RETRY_MINS: process.env.RETRY_MINS || CONFIG_DEV.RETRY_MINS,
	GIF_SIZE: 15728640,
	PIC_SIZE:5000000,
	subreddits:{
		chemicalreactiongifs:[5,'hot','🔬⚗🔥'],
		unexpected:[6,'hot','😳💥😂'],
	    oddlysatisfying:[8,'hot','😮🤗👌'],
	    aww:[7,'hot','😍🐶🐱'],
	    pics:[6,'hot','🗻📷'],
	    funny:[10,'hot','😂😂😂'],
	    mildlyinteresting:[6,'hot','🤔😯']
	}
}