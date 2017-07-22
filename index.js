var download = require('./libs/download')
var clean_url = require('./libs/clean_url')
var Snooper = require('reddit-snooper')
var winston = require('winston')
var log = require('./libs/log')
var twitter = require('./libs/twitter')

// snooper = new Snooper({})
// snooper.watcher.getPostWatcher('all')
//     .on('post', (post) => {
//         let author
//         let title
//         let link
//         if (!post.data.stickied && post.kind === 't3') {
//             let url = clean_url(post.data.domain,post.data.url)
//             if (url===undefined) 
//                 return //log.error(`\nCouldn't clean url of media: ${post.data.url}
//                 //Post: ${post.data.permalink}`)

//             download(url[0], url[1], post.data.id, format_tweet)
//             author = post.data.author
//             title = post.data.title
//             // texto: ${post.data.selftext}
//             // link: ${post.data.permalink}
//         }

//         function format_tweet(file_path){
//             let txt = `"${title}"`
//             twitter.tweet_with_media(file_path, title, txt)
//         }
//     })
//     .on('error', console.error)
twitter.tweet_with_media(`${__dirname}/img/6oszld/voyJQJW.jpg`, `Una bicicleta genérica`, `"Mi bicicleta genérica"`)

