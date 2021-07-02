// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('notes')
    .where({
        _openid: wxContext.OPENID
     })
    .remove()
  } catch(e) {
    console.error(e)
  }
}