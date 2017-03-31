import db from '../config/database'
let {entries} = Object
const createCard = async (accountInfo) => {
  let cardInfo = null
  var accountkeys = []
  var accountvalues = []
  for (let [key, value] of entries(accountInfo)) {
    accountkeys.push(key)
    accountvalues.push(value)
  }
  let sql =
   `INSERT INTO t_agent_add_cards_to_user(${accountkeys})
    VALUES(${accountvalues})`
  try {
    cardInfo = await db.query(sql)
  } catch (err) {
    console.log(`create t_agent_add_cards_to_user ${err}`)
  }
  return cardInfo
}

export default {
  createCard
}
