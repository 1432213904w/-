var app = getApp();  
Page({

  data: {
    nums: 0,
    question_ids: [],
    errorAll: [{
      question_ids: []
    }],
    errorEach: []
  },

  onLoad: function (options) {
    var category = app.globalData.category;
    this.setData({
      category: category
    });
    this.onGetOpenid();
  },
  onQuery: function(openid){
    let that = this;
    let question_ids = this.data.question_ids;

    const db = wx.cloud.database()
    db.collection('favor').where({
      _openid: openid
    }).get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.data;
      items.map((it)=>{
        question_ids.push(it._id);
      })
      that.setData({
        nums:res.data.length,
        question_ids
      });
    })
  },
  onReady: function () {

  },

  onShow: function () {

  },

  goOrderPlay: function () {
    wx.redirectTo({
      url: "../moni/moni"
    });
  },

  goquestion: function (t) {
    if(this.data.nums == 0){
      wx.showModal({
        showCancel: false,
        title: '提示',
        confirmText: '我知道了',
        content: '当前没有收藏记录',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })  
    }else{
      wx.navigateTo({
        url: "../errorstar/errorstar?mode=2&ids=" + t.currentTarget.dataset.ids.join(",") + "&title=" + t.currentTarget.dataset.title + "&navtitle=我的收藏&cateName=" + this.data.category.name
      })
    }

  },
  onGetOpenid: function() {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        that.setData({
          openid: res.result.openid
        })
        that.onQuery(res.result.openid)
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
})