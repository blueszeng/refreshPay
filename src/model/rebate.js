import db from '../config/database'
const getRebateStatusByOrderNo = async (orderNo) => {
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
  return rebateInfo.length > 0 ? true : false
}

const createRebate = async (rebateInfo) => {
  let rebatetkeys = Object.keys(rebateInfo)
  let rebatetvalues = []
  for (let key in rebatetkeys) {
    rebatetvalues.push(rebateInfo[rebatetkeys[key]])
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


const updateRebateBySdcustomno = async (sdcustomno, distributor, todisbate) => {
   let sql =
   `UPDATE t_rebate
    SET distributor=${distributor}, todisbate = ${todisbate} 
    WHERE order_no = ${sdcustomno}`
  try {
    console.log(sql)
    await db.query(sql)
    console.log('update t_rebate success')
  } catch (err) {
    console.log(`update t_rebate ${err}`)
  }
}

export default {
  getRebateStatusByOrderNo,
  createRebate,
  updateRebateBySdcustomno
}
