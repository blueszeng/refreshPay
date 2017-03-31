import fetch from 'isomorphic-fetch'
const post = async (url, postData) => {
  let res = null
  try {
    let data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: postData }
    res = await fetch(url, data)
  } catch (err) {
    console.log(err)
  }
  return res
}

export default {
  post
}
