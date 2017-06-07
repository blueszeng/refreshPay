import order from './model/order'
import agent from './model/agent'
import cards from './model/addCards'
import rebates from './model/rebate'
import record from './model/record'
import rebateConfig from './model/rebateConfig'
import crypto from './utils/crypto'
import http from './utils/http'
import tools from './utils/tools'
import util from './utils/util'
const url = 'http://www.zhifuka.net/gateway/zx_orderquery.asp'
const mark = 'diamondforplayers'
const key = '244ca72c106b8eef6c27f2e97bfd93ee'

const createSign = (order) => {
  let signStr = `customerid=${order.customer_id}&sdcustomno=${order.order_no}&mark=${mark}&key=${key}`
  return crypto.md5Upper(signStr)
}
const run = async () => {
  let orderData = await order.getAllOrderInfo()
  if (orderData !== null && orderData.length > 0) {
    for (let _order of orderData) {
      if (_order.order_status === 0) { // 只处理订单状态为0的。
        let postData = `customerid=${_order.customer_id}&sdcustomno=${_order.order_no}&sign=${createSign(_order)}&mark=${mark}`
        let ret = await http.post(url, postData)

        if (ret.ok) {
          let items = await ret.text()
          let parseState = await tools.xmlToJson(items)
          let state = parseInt(parseState.state)
          if (parseState.sd51no) {
            _order.sd51no = parseState.sd51no
          }
          if (parseState.ordermoney) {
            _order.ordermoney = parseState.ordermoney * 100
          }
          // console.log('isok==>', parseState)
          if (state === 1) {
            // await order.updateOrderStatus(state, _order.order_no) // 更新订单状态
            let account = await agent.getAgentAccountsInfoById(_order.oper_account)
            let dis;
            let superior;
            let quota;
            let up_superior;
            let up_quota;
            let highest;
            let findBaseBate = util.getBate()
            let { cate, count } = await findBaseBate(account['referrer'])
            // console.log("value===>", cate, count)
            if (count >= 3) {
              highest = await agent.getAgentAccountsInfoById(cate[0]['accounts'])
              let rtConfig = await rebateConfig.getRebateConfig(cate[0]['accounts'])
              dis = Math.floor(_order.order_gems * rtConfig['disbate'])
              console.log("dis=============================>", dis)
            }
            if (count >= 1) {
              superior = await agent.getAgentAccountsInfoById(account['referrer'])
              // console.log("gggggggggggggggggggggggggg", superior)
              quota = await rebateConfig.getRebateConfig(superior['accounts'], superior['rechargetotal'],
                superior['rechargetotal'])
            }
            if (count >= 2) {
              up_superior = await agent.getAgentAccountsInfoById(superior['referrer'])
              // console.log("gggggggggggggggggggggggggg", up_superior)
              up_quota = await rebateConfig.getRebateConfig(up_superior['accounts'], up_superior['rechargetotal'],
                up_superior['rechargetotal'])
            }
            let rebate = await rebates.getRebateStatusByOrderNo(_order.order_no)
            console.log("rebate====================================================>", rebate, _order.order_no)
            if (!rebate) {
              let data = {}
              data['gems'] = _order.order_gems;

              data['sort'] = 3;

              data['benefactor'] = 0;

              data['manner'] = 3;

              data['accept_frone'] = account.gems;

              data['accept_queen'] = account.gems + _order.order_gems;

              if (count >= 1) {

                data['recipient'] = superior['accounts'];
              }
              if (count >= 2) {

                data['up_id'] = up_superior['accounts'];
              }
              await cards.createCard(data)

              if (count === 1) {

                let data2 = {}
                data2['benefactor'] = 3;

                data2['recipient'] = account['accounts'];

                data2['gems'] = _order.order_gems;

                data2['superior_id'] = superior['accounts'];

                data2['order_no'] = _order.order_no;

                data2['accumulative'] = Math.floor(_order.order_gems * quota['first_upper_rebate']);

                await rebates.createRebate(data2)

              }

              if (count >= 2) {
                let data3 = {}

                data3['benefactor'] = 3

                data3['recipient'] = account['accounts']

                data3['gems'] = _order.order_gems

                data3['accumulative'] = Math.floor(_order.order_gems * quota['first_upper_rebate'])

                data3['superior'] = Math.floor(_order.order_gems * up_quota['second_upper_rebate'])

                data3['superior_id'] = superior['accounts']

                data3['up_id'] = up_superior['accounts']

                data3['order_no'] = _order.order_no
                await rebates.createRebate(data3)

              }
              console.log("zzzzzzzzzzzzzzzzzzzz==============================>",  highest['agencylv'])
              if (count >= 3 && highest['agencylv'] == 0) {
              
                await rebates.updateRebateBySdcustomno(_order.order_no, cate[0]['accounts'], dis)
              }
              // 更新钻石
              let orderGems = account.gems + _order.order_gems
              await agent.updateAgentGems(orderGems, _order.oper_account)
            }

          }
        }
      }
    }
  }
}
console.log("run===>")
run();
// setInterval(run, 5000)
