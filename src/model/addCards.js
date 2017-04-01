import db from '../config/database'
const createCard = async (accountInfo) => {
  let cardInfo = null
  var accountkeys = Object.keys(accountInfo)
  var accountvalues = []
  for (let key in accountkeys) {
    accountvalues.push(accountInfo[accountkeys[key]])
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
