const redis = require('redis')
const config = require('./config')

let redisClient = redis.createClient(config.redis.url, {})
module.exports = redisClient
