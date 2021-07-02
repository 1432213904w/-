const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 5
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let favorData = await db.collection('favor')
  .aggregate()
  .match({
    _openid: wxContext.OPENID,
  })
  .limit(1000)
  .end()

  let skipNum = Number(event.skipNum);

  let quesData = await db.collection('questions')
  .aggregate()
  .match({
    category: event.category
  })
  .skip(skipNum)
  .sample({
    size: 50
  })
  .limit(1000)
  .end()

  return {
    favorItems: favorData.list,
    quesItems: quesData.list,
  }
}