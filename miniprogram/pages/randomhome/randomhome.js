// pages/examhome/examhome.js
var app = getApp();
Page({

  data: {
    passf: 0,
    time: 0,
    num: 0,
    total: 0,
    everyf: 1,
    use_title: "",
    training_qids: ""
  },

  onLoad: function (options) {
    console.log('app.globalData',app.globalData);
    wx.showLoading({
      title: '加载中',
    })
    let category = app.globalData.category;
    this.setData({
      id: category._id
    })
    this.onQuery();
  },
  onQuery: function() {
    let that = this;
    var category = app.globalData.category;

    const db = wx.cloud.database()
    db.collection('category').doc(category._id).get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      wx.hideLoading()
      that.setData({
        _id: res.data._id,
        time: res.data.time,
        num: res.data.number,
        total: res.data.total,
        use_title: res.data.name,
        passf: res.data.passf,
        time1: res.data.time1,
        time2: res.data.time2,
        category:category
      });
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },
  examGo:function (e) {
    wx.redirectTo({
      url: "../random/random"
    });


  },

  defaultGo: function(){
    this.examGo();
  }
})