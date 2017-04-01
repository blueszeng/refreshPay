import db from '../config/database'
const getRecordInfoByOrderNo = async (orderNo) => {
  let recordInfo = null
  let sql =
   `SELECT * FROM yp_order_record
    WHERE order_no = ${orderNo}`
  try {
    console.log(sql)
    recordInfo = await db.query(sql)
    console.log(recordInfo)
  } catch (err) {
    console.log(`search yp_order_record ${err}`)
  }
  return recordInfo[0]
}

const createRecord = async (recordInfo) => {
  let recordtkeys = Object.keys(recordInfo)
  let recordtvalues = []
  for (let key in recordtkeys) {
    recordtvalues.push(recordInfo[recordtkeys[key]])
  }
  let stringValue = ''
  for (let k in recordtkeys) {
    stringValue += '?'
    if (parseInt(k) !== recordtkeys.length - 1) {
      stringValue += ','
    }
  }
  let sql =
   `INSERT INTO yp_order_record(${recordtkeys})
    VALUES(${stringValue})`
  try {
    console.log(sql)
    await db.query(sql, recordtvalues)
    console.log('add yp_order_record success')
  } catch (err) {
    console.log(`create yp_order_record ${err}`)
  }
}

export default {
  getRecordInfoByOrderNo,
  createRecord
}
