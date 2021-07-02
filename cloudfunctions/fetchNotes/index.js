// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  console.log(event);
  try {
    let res1 = await db.collection('notes')
    .aggregate()
    .match({
      category: event.id,
      _openid: wxContext.OPENID
    })
    .sample({
      size: 10
    })
    .end()


    let arr1 = res1.list;

    return {
      list: arr1
    }

  } catch(e) {
    console.error(e)
  }
}