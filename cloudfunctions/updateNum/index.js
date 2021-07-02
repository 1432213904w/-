// 云函数入口文件
const cloud = require('wx-server-sdk')


process.env.TZ ='Asia/Shanghai'
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  try {
    let _id = event._id;
    return await db.collection('record').doc(_id).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        num: 0
      }
    })
  

  } catch(e) {
    console.error(e)
  }
}