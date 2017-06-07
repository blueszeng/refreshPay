import db from '../config/database'
const getRebateConfig = async (rebateId, topLimit = 0, buttonLimit = 4999) => {
  let recordInfo = null
  let sql =
    `SELECT * FROM t_rebate_quota
    WHERE id = ${rebateId} AND ${buttonLimit} >= botton_limit  AND ${topLimit} < top_limit`
  try {
    // console.log(sql)
    recordInfo = await db.query(sql)
  } catch (err) {
    console.log(`search yp_order_record ${err}`)
  }
  return recordInfo[0]
}

export default {
  getRebateConfig
}
