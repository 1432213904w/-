const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 10
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const wxContext = cloud.getWXContext()
  let favorData = await db.collection('favor')
  .aggregate()
  .match({
    _openid: wxContext.OPENID,
  })
  .limit(1000)
  .end()

  const countResult = await db.collection('questions').where({category:event.category}).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 10)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('questions').where({category:event.category}).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      favorItems: favorData.list,
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}