import cache from '../cache'
const orderKey = 'order_data'
import db from '../config/database'
import moment from 'moment'
const getTowDayUnixTime = () => {
  let numberDay = 2
  let beginTime = moment(moment().dates(), 'DD').subtract(numberDay, 'days').unix()
  let endTime = moment(moment().dates(), 'DD').add(numberDay, 'days').unix()
  return {
    beginTime,
    endTime
  }
}
const getAllOrderInfo = async () => {
  let orderData = null
  await cache.getCache(orderKey)
  if (orderData === null) {
    let times = getTowDayUnixTime()
    let sql =
     `SELECT * FROM yp_apply_order
      WHERE UNIX_TIMESTAMP(times) > ${times.beginTime} and UNIX_TIMESTAMP(times) < ${times.endTime}`
    console.log(sql)

    try {
      orderData = await db.query(sql)
    } catch (err) {
      console.log(`search yp_apply_order ${err}`)
    }
    await cache.setCache(orderKey, orderData)
  }
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
    await cache.cleanCache(orderKey)
    console.log('update yp_apply_order success')
  } catch (err) {
    console.log(`search yp_apply_order ${err}`)
  }
}
export default {
  getAllOrderInfo,
  updateOrderStatus
}