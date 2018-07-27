var mongo = require('mongodb').MongoClient;
const config = require(`${__dirname}/../config`)
log = require('winston')
var posts;

mongo.connect(config.MONGO_URL, function(err, client) {
	if (err) {
		log.error(err)
		throw err
	}
	client.db('reddit_miner').collection('posts').drop((err,reply)=>{
		posts = client.db('reddit_miner').collection('posts');
	})
})

module.exports = {
	save_post : (post,callback) => {
		posts.insertOne(post, function(err, res) {
			return (err) ? callback(err) : callback(false)
		})
	},

	get_post : (callback) => {
		posts.find({}).sort({_id:1}).limit(1).toArray(function(err, res) {
			if (err) {
				console.log(`erro en get post ${err}`)
				return callback(err)
			}
			callback(false,res)
		})
	},

	delete_post : (id, callback) => {
		posts.deleteOne({_id:id}, function(err, obj) {
			return (err) ? callback(err) : callback(false)
		})
	}
}