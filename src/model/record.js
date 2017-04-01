import db from '../config/database'
let {entries} = Object
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
  var recordtkeys = []
  var recordtvalues = []
  for (let [key, value] of entries(recordInfo)) {
    recordtkeys.push(key)
    recordtvalues.push(value)
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
