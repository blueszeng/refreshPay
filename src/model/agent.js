import db from '../config/database'
const updateAgentGems = async (gem, accounts) => {
  let sql = `
    UPDATE t_agent
    SET gems = ${gem}
    WHERE  accounts = ${accounts}
  `
  try {
    await db.query(sql)
    console.log('update t_agent success')
  } catch (err) {
    console.log(`update t_agent ${err}`)
  }
}
const getAgentAccountsInfoById = async (accounts) => {
  let accountsInfo = null
  let sql =
   `SELECT * FROM t_agent
    WHERE accounts = ${accounts}`
  try {
    accountsInfo = await db.query(sql)
    // console.log("hahahah", accountsInfo)
  } catch (err) {
    console.log(`search yp_apply_order ${err}`)
  }
  return accountsInfo[0]
}

export default {
  updateAgentGems,
  getAgentAccountsInfoById
}
