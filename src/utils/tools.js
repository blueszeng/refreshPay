import { to_json } from 'xmljson'
const xmlToJson = (items) => {
  return new Promise((resolve, reject) => {
    let values = {}
    to_json(items, (err, data) => {
      if (err) {
        return reject(values)
      }
      try {
        let status = data.fill.items.item[0]['$']
        if (status.name === 'state') {
          values['state'] = status.value
        }
        let sd51no = data.fill.items.item[1]['$']
        if (sd51no.name === 'sd51no') {
          values['sd51no'] = sd51no.value
        }
        let ordermoney = data.fill.items.item[3]['$']
        if (ordermoney.name === 'ordermoney') {
          values['ordermoney'] = ordermoney.value
        }
      } catch (err) {
        console.log(err)
        values = {}
      }
      // console.log(values)
      resolve(values)
    })
  })
}

export default {
  xmlToJson
}
