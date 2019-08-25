var reddit = require('./libs/reddit')
var log = require('./libs/log')
const config = require('./config')
var subreddits = config.subreddits

posts = [
//     { kind: 't3',
//   data: 
//    {
//      title: 'Warm weather and warm water in Alaska killed the salmon before they reached their destination.',
//      domain: 'media.giphy.com',
//      stickied: false,
//      url: 'https://media.giphy.com/media/RMvlYZbpDsdacnS9MH/giphy.gif'},
//   prefix: '',
//   type: 'media' },

  { kind: 't3',
  data: 
   {
     title: 'bot test b4.0.1',
     domain: 'i.imgur.com',
     stickied: false,
     url: 'https://i.imgur.com/auC8iZG.gifv'}, // https://i.imgur.com/FcPOBjo.gifv // https://i.imgur.com/Onj8g78.gifv
  prefix: '',
  type: 'media' },


//   { kind: 't3',
//   data: 
//    {
//      title: '',
//      domain: 'gfycat.com',
//      stickied: false,
//      url: 'https://gfycat.com/zigzaggaseousduiker'},
//   prefix: '',
//   type: 'media' },

//   { kind: 't3',
//   data: 
//    {
//      title: '',
//      domain: 'thumbs.gfycat.com',
//      stickied: false,
//      url: 'https://thumbs.gfycat.com/PersonalShabbyHake-size_restricted.gif'},
//   prefix: '',
//   type: 'media' },

//   { kind: 't3',
//   data: 
//    {
//      title: '',
//      domain: 'i.redd.it',
//      stickied: false,
//      url: 'https://i.redd.it/vf87tlhafxf31.gif'},
//   prefix: '',
//   type: 'media' },

]

for (post of posts){
    reddit.handle_post(post);
}

