// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  console.log(event);
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('history').where({
      _openid: wxContext.OPENID,
    })
    .update({
      data: {
        userInfo: event.userInfo
      },
    })
  } catch(e) {
    console.error(e)
  }
}