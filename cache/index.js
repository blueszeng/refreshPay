import wrapper from 'co-redis'
import redis from '../config/redis'
const config = require('../config/config')
const prefix = config.redis.prefix
const expire = config.redis.expire
const redisClient = wrapper(redis)
let redisAvailable = false
redisClient.on('error', (_error) => {
  console.log('connect error===>')
  redisAvailable = false
})

redisClient.on('end', () => {
  console.log('connect end===>')
  redisAvailable = false
})

redisClient.on('connect', () => {
  console.log('connect redis===>')
  redisAvailable = true
})
const setCache = async function (key, value) {
  if (!redisAvailable) {
    return
  }
  if (value === null) {
    return
  }
  key = prefix + key
  const tty = expire
  value = JSON.stringify(value)
  await redisClient.setex(key, tty, value)
}

const getCache = async function (key) {
  if (!redisAvailable) {
    return null
  }
  key = prefix + key
  let data = await redisClient.get(key)
  if (data) {
    data = JSON.parse(data.toString())
  }
  return data
}
const cleanCache = async function (key) {
  if (!redisAvailable) {
    return
  }
  key = prefix + key
  await redisClient.del(key)
}
export default {
  setCache,
  getCache,
  cleanCache
}
