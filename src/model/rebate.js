import db from '../config/database'
let {entries} = Object
const getRebateInfoByOrderNo = async (orderNo) => {
  let rebateInfo = null
  let sql =
   `SELECT * FROM t_rebate
    WHERE order_no = ${orderNo}`
  try {
    console.log(sql)
    rebateInfo = await db.query(sql)
    console.log(rebateInfo)
  } catch (err) {
    console.log(`search t_rebate ${err}`)
  }
  return rebateInfo[0]
}

const createRebate = async (rebateInfo) => {
  var rebatetkeys = []
  var rebatetvalues = []
  for (let [key, value] of entries(rebateInfo)) {
    rebatetkeys.push(key)
    rebatetvalues.push(value)
  }
  let sql =
   `INSERT INTO t_rebate(${rebatetkeys})
    VALUES(${rebatetvalues})`
  try {
    console.log(sql)
    await db.query(sql)
    console.log('add t_rebate success')
  } catch (err) {
    console.log(`create t_rebate ${err}`)
  }
}

export default {
  getRebateInfoByOrderNo,
  createRebate
}