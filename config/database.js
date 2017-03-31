import wrapper from 'co-mysql'
import mysql from 'mysql'
const config = require('./config')

let pool = mysql.createPool(config.mysql)
let p = wrapper(pool)
module.exports = p
