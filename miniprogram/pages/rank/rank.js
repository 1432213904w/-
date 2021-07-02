var app = getApp();
Page({

  data: {
    moreData:true,
    markShow: !1,
    page:1,
    limit:50,
    rankList:[],
  },

  onLoad: function (options) {
    wx.showLoading({
      'title': '加载中'
    });
    this.onQuery();
  },
  onQuery: function(storageCate) {
    let that = this;

    const db = wx.cloud.database()
    db.collection('ranks')
    .aggregate()
    .sort({
        score: -1
    })
    .end()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      wx.hideLoading();
      that.setData({
        rankList:res.list,
      })
    })
  },
  onReady: function () {

  },

  onShow: function () {
    
  },

  goBack: function () {
    wx.navigateBack({

    })
  },
  
  onShareAppMessage: function () {
    return {
      title: "快来看看我的答题成绩吧！",
      path: "pages/index/index",
      imageUrl:'https://6f6e-onlineexam-bmt8e-1302791251.tcb.qcloud.la/img2020110201.jpg?sign=d1e6df232ae29eeb1b9157d3993a824f&t=1604417316'
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