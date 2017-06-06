// import cache from '../cache'
// const orderKey = 'order_data'
import db from '../config/database'
import moment from 'moment'
const getTowDayUnixTime = () => {
  let numberDay = 2
  let beginTime = moment(moment().date(), 'DD').subtract(numberDay, 'days').unix()
  let endTime = moment(moment().date(), 'DD').add(numberDay, 'days').unix()
  return {
    beginTime,
    endTime
  }
}
const getAllOrderInfo = async () => {
  let orderData = null
  // await cache.getCache(orderKey)
  // if (orderData === null) {
    let times = getTowDayUnixTime()
    let sql =
     `SELECT * FROM yp_apply_order
       WHERE UNIX_TIMESTAMP(times) > ${times.beginTime} AND UNIX_TIMESTAMP(times) < ${times.endTime} 
             AND order_status = 0`
    console.log(sql)

    try {
      orderData = await db.query(sql)
      console.log('serach date len is=>', orderData.length)
    } catch (err) {
      console.log(`search yp_apply_order ${err}`)
    }
    // await cache.setCache(orderKey, orderData)
  // }
  return orderData
}
const updateOrderStatus = async (status, sdcustomno) => {
  let sql = `
    UPDATE yp_apply_order
    SET order_status = ${status}
    WHERE  order_no = ${sdcustomno}
  `
  try {
    await db.query(sql)
    // await cache.cleanCache(orderKey)
    console.log('update yp_apply_order success')
  } catch (err) {
    console.log(`search yp_apply_order ${err}`)
  }
}
export default {
  getAllOrderInfo,
  updateOrderStatus
}
