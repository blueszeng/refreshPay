import db from '../config/database'
const getRebateConfig = async (rebateId, topLimit = 0, buttonLimit = 4999) => {
  let recordInfo = null
  let sql =
   `SELECT * FROM yp_order_record
    WHERE id = ${rebateId} AND ${buttonLimit} >= botton_limit  AND ${topLimit} < top_limit`
  try {
    recordInfo = await db.query(sql)
  } catch (err) {
    console.log(`search yp_order_record ${err}`)
  }
  return recordInfo
}