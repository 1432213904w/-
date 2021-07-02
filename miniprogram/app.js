var t = require('./utils/question.js');

//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'wbj17606979328-9g6phxh1b1860d19',
        traceUser: true,
      })
    }
  },
  globalData: {
    quesTotal: 10,
    num: 0,
    maxNum: 0,
    auth: 0,
    userInfo: {
      avatarUrl: '/images/header.png',
      nickName: '游客',
    },
    category:{
      "name":"微信期末考",
      "number":10.0,
      "passf":"1",
      "pic_url":"http://file.xiaomutong.com.cn/20200203/red.png",
      "time":10.0,
      "_id":"001",
      "add_time":""
    },
    openid: 'o2ZC05C'
  }
})
