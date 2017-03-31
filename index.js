import order from './model/order'
import agent from './model/agent'
import cards from './model/addCards'
// import rebates from './model/rebate'
import rebates from './model/rebate'
// console.log(rebate, order)
import crypto from './utils/crypto'
import http from './utils/http'
import tools from './utils/tools'
const url = 'http://www.zhifuka.net/gateway/zx_orderquery.asp'
const mark = 'diamondforplayers'
const key = '244ca72c106b8eef6c27f2e97bfd93ee'
const createSign = (order) => {
  let signStr = `customerid=${order.customer_id}&sdcustomno=${order.order_no}&mark=${mark}&key=${key}`
  console.log(signStr)
  return crypto.md5Upper(signStr)
}
const run = async () => {
  let orderData = await order.getAllOrderInfo()
  if (orderData !== null && orderData.length > 0) {
    for (let _order of orderData) {
      // _order.order_no = '329684171300031'
      _order.order_status = 0
      if (_order.order_status === 0) { // 只处理订单状态为0的。
        let postData = `customerid=${_order.customer_id}&sdcustomno=${_order.order_no}&sign=${createSign(_order)}&mark=${mark}`
        // console.log(postData)
        let ret = await http.post(url, postData)
        // ret.ok = 200
        if (ret.ok) {
          let items = await ret.text()
          let state = await tools.xmlToJson(items)
          // console.log('state', state)
          state = parseInt(state)
          // state = 1
          if (state === 1) {
            await order.updateOrderStatus(state, _order.order_no) // 更新订单状态
            let account = await agent.getAgentAccountsInfoById(_order.oper_account)
            let rebate = await rebates.getRebateInfoByOrderNo(_order.order_no)
            if (account && account.agencylv === 0) {
              // 没有子代理更新本身数据
              if (!rebate) {
                let date = {
                  manner: 3,
                  benefactor: 0,
                  recipient: account.accounts,
                  gems: _order.order_gems,
                  properties: 0,
                  sort: 3,
                  accept_frone: _order.order_gems,
                  accept_queen: account.gems + _order.order_gems
                }
                // console.log('order_gems', account.gems, _order.order_gems)
                await cards.createCard(date)
              }
              // 更新钻石
              let orderGems = account.gems + _order.order_gems
              await agent.updateAgentGems(orderGems, _order.oper_account)
            } else {
              // console.log('gogogogoogo===>')
              let superior = await agent.getAgentAccountsInfoById(account.referrer)
              let upSuperior = await agent.getAgentAccountsInfoById(superior.referrer)

              // 更新自己本身
              if (!rebate) {
                let data = {
                  manner: 3,
                  benefactor: 0,
                  recipient: account.accounts,
                  superior: superior.accounts,
                  up_id: upSuperior.accounts,
                  gems: _order.order_gems,
                  properties: 0,
                  sort: 3,
                  accept_frone: account.gems,
                  accept_queen: account.gems + _order.order_gems
                }
                // console.log(data)
                await cards.createCard(data)
                // 存在一级代理
                if (upSuperior && upSuperior.agencylv === 1) {
                  let data2 = {
                    benefactor: 3,
                    recipient: account.accountsm,
                    gems: _order.order_gems,
                    superior_id: superior.accounts,
                    order_no: _order.order_no,
                    accumulative: (() => {
                      let a = _order.order_gems + superior.surplus
                      let b = superior.limits
                      return Math.floor(a / b) * superior.rebate
                    })()
                  }
                  await rebates.createCard(data2)
                  // 存在多级代理
                } else if (upSuperior && upSuperior.agencylv >= 2) {
                  let data3 = {
                    benefactor: 3,
                    recipient: account.accounts,
                    gems: _order.order_gems,
                    accumulative: (() => {
                      let a = _order.order_gems + superior.surplus
                      let b = superior.limits
                      return Math.floor(a / b) * superior.rebate
                    })(),
                    superior: (() => {
                      let a = _order.order_gems + upSuperior.surplus
                      let b = upSuperior.limits
                      return Math.floor(a / b) * upSuperior.up_rebate
                    })(),
                    superior_id: superior.accounts,
                    up_id: upSuperior.accounts,
                    order_no: _order.order_no
                  }
                  // console.log(data3)
                  await rebates.createRebate(data3)
                }
              }
              // 更新钻石
              let orderGems = account.gems + _order.order_gems
              await agent.updateAgentGems(orderGems, _order.oper_account)
            }
          }
        }
      }
      break
    }
  }
}
run()
// setInterval(run, 20000)
