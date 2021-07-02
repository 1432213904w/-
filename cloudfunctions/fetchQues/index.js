// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  let num = Number(event.num);
  try {
    return await db.collection('questions')
    .aggregate()
    .match({
      category: event.category
    })
    .sample({
      size: num
    })
    .limit(1000)
    .sort({
      typecode: 1
    })
    .end()

  } catch(e) {
    console.error(e)
  }
}