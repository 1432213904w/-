let app = getApp();
// 在页面中定义激励视频广告
let videoAd = null
Page({

  data: {

  },

  onLoad: function (options) {
    console.log('app.globalData',app.globalData);
    var ytimesf = options.ytimes.split(":")[0]
    var ytimesm = options.ytimes.split(":")[1]
    this.setData({
      ytimes: options.ytimes,
      score: options.score,
      ordernum: options.ordernum,
      rightNum: options.greenNum,
      errNum: options.redNum,
      unAnswerNum: options.allQuestionCount - options.greenNum - options.redNum,
      ytimesf: ytimesf,
      ytimesm: ytimesm,
    },async ()=>{

      const db = wx.cloud.database();
      const res = await db.collection('ranks').where({
        _openid: app.globalData.openid
      }).count();

      if(res.total == 0){
        this.addRank();
      }
      if(res.total == 1 && app.globalData.maxNum < this.data.score){
        this.updateRank();
      }
    })



    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-fea2a95753569309'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {
        this.viewGo();
      })
      videoAd.onClose(res => {
          // 用户点击了【关闭广告】按钮
          if (res && res.isEnded) {
            // 正常播放结束，可以下发游戏奖励
            this.viewGo();
          } else {
            // 播放中途退出，不下发游戏奖励
          }
      })
  
    }

    // // 用户触发广告后，显示激励视频广告
    // if (videoAd) {
    //   videoAd.show().catch(() => {
    //     // 失败重试
    //     videoAd.load()
    //       .then(() => videoAd.show())
    //       .catch(err => {
    //         console.log('激励视频 广告显示失败')
    //       })
    //   })
    // }
  },

  onReady: function () {

  },
  updateRank: function(){
    const db = wx.cloud.database()
    db.collection('ranks').doc(app.globalData.openid,).update({
      data: {
        score: Number(this.data.score),
        time: new Date()
      }
      })
      .then(res=>{
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 在返回结果中会包含新创建的记录的 _id  

      })
      .catch(err=>{

      })
  },
  addRank: function(){
    const db = wx.cloud.database()
    db.collection('ranks').add({
      data: {
        _id: app.globalData.openid,
        userInfo: app.globalData.userInfo,
        score: Number(this.data.score),
        ytimes: this.data.ytimes,
        time: new Date()
      }
      })
      .then(res=>{
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 在返回结果中会包含新创建的记录的 _id  

      })
      .catch(err=>{

      })
  },

  onShow: function () {
    // this.send();     
  },
  send: function(){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'send',
      // 传给云函数的参数
      data: {
        a: 1,
        b: 2,
      },
    })
    .then(res => {
      console.log(res.result) // 3
    })
    .catch(console.error)
  },
  goRank: function () {
    let url = '/pages/rank/rank';
    wx.navigateTo({
      url: url
    })
  },
  viewGo: function(){
    let ordernum = this.data.ordernum;
    wx.redirectTo({
      url: "../view/view?ordernum="+ordernum+"&timeback=1&passf=" + this.data._repeat_passf + "&time=19&training_qids=0&nums=" + this.data._repeat_num
    });
  },
  examBack: function () {
    // 如果没有错题，就不需要进去了
    if(this.data.errNum == 0){
      wx.showModal({
        title: '提示',
        content: '恭喜您都答对了',
        showCancel: false,
        confirmText: '我知道了',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }

    

    videoAd.show()
    .catch(() => {
      videoAd.load()
        .then(() => videoAd.show())
        .catch(err => {
          console.log('激励视频 广告显示失败')
          this.viewGo();
        })
    })


  },

  exam_repeat: function () {
    this._repeat_examGo(this);
  },

  _repeat_examGo: function (e) {
    wx.redirectTo({
      url: "../exam/exam?pid="+app.globalData.pid+"&passf=" + app.globalData.category.passf + "&time=" + (app.globalData.category.time - 1) + "&training_qids=0&nums=" + app.globalData.category.number
    });
  }
})