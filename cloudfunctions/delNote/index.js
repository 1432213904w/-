// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('notes')
    .where({
      _openid: wxContext.OPENID,
      qid: event.qid
    }).remove()
  } catch(e) {
    console.error(e)
  }
}