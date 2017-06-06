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
          if (state === 1) {
            await order.updateOrderStatus(state, _order.order_no) // 更新订单状态
            let account = await agent.getAgentAccountsInfoById(_order.oper_account)
            let cate = []
            let count = 0;
            let dis;
            let superior;
            let quota;
            let up_superior;
            let up_quota;
            util.getBate()(cate, account['referrer'], count)
            if (count >= 3) {
              let highest = await agent.getAgentAccountsInfoById(cate[0]['accounts'])
              let rtConfig = await rebateConfig.getRebateConfig(cate[0]['accounts'])
              dis = Math.floor(_order.order_gems * highest[0]['disbate'])
            }
            if (count >= 1) {
              superior = await agent.getAgentAccountsInfoById(account['referrer'])[0]
              quota = await rebateConfig.getRebateConfig(superior['accounts'],$superior['rechargetotal'],
                $superior['rechargetotal'])[0]
            }
            if (count >= 2) {
              up_superior = await agent.getAgentAccountsInfoById(superior['referrer'])[0]
              quota = await rebateConfig.getRebateConfig(up_superior['accounts'],$up_superior['rechargetotal'],
                $up_superior['rechargetotal'])[0]
            }
            let rebate = await rereferrerbates.getRebateInfoByOrderNo(_order.order_no)

            if (!rebate) {
          
                   let date = {}
                   date['gems'] = _order.order_gems;

                   date['sort'] = 3;

                   date['benefactor'] = 0;

                   date['manner'] = 3;

                   date['accept_frone'] = _order.order_gems;

                   date['accept_queen'] = account.gems + _order.order_gems;

                   if ($count>=1) {

                       date['recipient'] = superior['accounts'];
                   }
                   if ($count>=2) {

                       date['up_id'] = up_superior['accounts'];
                   }
                   await cards.createCard(date)

                if (count==1) {

                  let date2 = {}
                  date2['benefactor']=3;  

                  date2['recipient']=account['accounts']; 

                  date2['gems']=_order.order_gems;

                  date2['superior_id']=superior['accounts'];

                  date2['order_no']=_order.order_no; 
                  
                  date2['accumulative']=floor(_order.order_gems*quota['first_upper_rebate']);

                   await rebates.createRebate(data2)
                   
                }

                if (count>=2) {

                  let date3 = {}

                  date3['benefactor']=3

                  date3['recipient']=account['accounts']

                  date3['gems']=_order.order_gems

                  date3['accumulative']=floor(_order.order_gems*quota['first_upper_rebate'])

                  date3['superior']=floor(_order.order_gems*up_quota['second_upper_rebate'])

                  date3['superior_id']=superior['accounts']

                  date3['up_id']=up_superior['accounts']

                  date3['order_no']=_order.order_no

                  await rebates.createRebate(data3)
           
                }
                if (count >= 3 && highest['agencylv'] == 0) {
                  await rebates.updateRebateBySdcustomno(_order.order_no,cate[0]['accounts'],dis)
                }
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
console.log("run===>")
run();
// setInterval(run, 5000)
