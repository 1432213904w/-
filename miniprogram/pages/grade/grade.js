var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:{},
    addupexam:0,
    pass:0,
    rankfs: "0",
    markShow: !1,
    userInfo: {
      nickName: "未授权",
      avatarUrl: "https://picture.eclicks.cn/kaojiazhao/public/wx_xcx/default/gungun.png"
    }
  },

  onLoad: function (options) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    let userInfo = app.globalData.userInfo;
    this.setData({
      userInfo: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      }
    })
  },
  onReady: function () {

  },

  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    var category = app.globalData.category;
    this.onQuery(category._id);
  },
  onQuery: function(_id) {
    let that = this;

    const db = wx.cloud.database()
    db.collection('history').where({
      _openid: app.globalData.openid
    })
    .orderBy('createTime', 'desc')
    .get().then(res => {
      // res.data 包含该记录的数据
      console.log('[数据库] [查询记录] 成功: ', res)
      for(var e = 0,r = [],s = 0;s < res.data.length; s++) e += 1 * res.data[s].score
        
      that.setData({
        addupexam:res.data.length,
        pass:res.data.length,
        list : res.data,
        rankfs: 0,
      });
      wx.hideLoading();
    })
  },
  onShareAppMessage:function (){
    return {
      title: "快来看看我的答题成绩吧！",
      path: "pages/index/index",
      imageUrl:"http://file.xiaomutong.com.cn/9353ef0240fb00bc800956b373ee92e5.png"
    }
  },

  go_show_mark: function () {
    this.setData({
      markShow: !this.data.markShow
    });

  },

  onMyEvent: function (t) {
    console.log(this.data.saveImgUrl)
    1 == t.detail.code && this.go_show_mark(), 2 == t.detail.code && (wx.showLoading({
      title: "图片生成中"
    }), this.go_show_mark(), a.handelShowShareImg(this, this.data.saveImgUrl));
  },
})