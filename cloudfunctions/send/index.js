const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const { OPENID } = cloud.getWXContext()
    const result = await cloud.openapi.subscribeMessage.send({
        touser: OPENID,
        page: '/pages/start/start',
        data: {
          name7: {
            value: event.nickName
          },
          number4: {
            value: event.nums
          },
          date5: {
            value: event.time
          },
          thing6: {
            value: '请进入小程序查询成绩'
          }
        },
        templateId: 'LGbr_wFfPYaPzCs9yHwQOgGEUUEVygZXN_0NEpMcyPU'
      })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}