var logger = require('winston')
// var Loggly = require('winston-loggly').Loggly
// var loggly_options={ subdomain:'mysubdomain', inputToken: 'efake000-000d-000e-a000-xfakee000a00' }
// logger.add(Loggly, loggly_options)
logger.remove(logger.transports.Console);
logger.add(logger.transports.File, { filename: `${__dirname}/../debug.log`, level:'error' })
module.exports=logger