const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.get({
      path: 'pages/welcome/welcome?pid='+event.category,
    })
    console.log(result)

    return await cloud.uploadFile({
      cloudPath: event.category +'.png',
      fileContent: result.buffer
    })
    
  } catch (err) {
    console.log(err)
    return err
  }
}