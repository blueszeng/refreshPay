import {to_json} from 'xmljson'
const xmlToJson = (items) => {
  return new Promise((resolve, reject) => {
    let state = 0
    to_json(items, (err, data) => {
      if (err) {
        return reject(state)
      }
      try {
        let status = data.fill.items.item[0]['$']
        if (status.name === 'state') {
          state = status.value
        }
      } catch (err) {
        console.log(err)
        state = 0
      }
      resolve(state)
    })
  })
}

export default {
  xmlToJson
}
