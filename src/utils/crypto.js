import crypto from 'crypto'
const md5Upper = (content) => {
  let md5 = crypto.createHash('md5')
  md5.update(content)
  return md5.digest('hex').toLocaleUpperCase()
}

export default {
  md5Upper
}
