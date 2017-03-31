import db from '../config/database'

const getRebateInfoByOrderNo = async (orderNo) => {
  let rebateInfo = null
  let sql =
   `SELECT * FROM t_rebate
    WHERE order_no = ${orderNo}`
  try {
    rebateInfo = await db.query(sql)
  } catch (err) {
    console.log(`search t_rebate ${err}`)
  }
  return rebateInfo[0] ? rebateInfo[0] : null
}

export default {
  getRebateInfoByOrderNo
}
