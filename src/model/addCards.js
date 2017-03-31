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
   `INSERT INTO t_agent_add_cards_to_agent(${accountkeys})
    VALUES(${accountvalues})`
  try {
    console.log(sql)
    cardInfo = await db.query(sql)
    console.log('add t_agent_add_cards_to_agent success')
  } catch (err) {
    console.log(`create t_agent_add_cards_to_agent ${err}`)
  }
  return cardInfo
}

export default {
  createCard
}
