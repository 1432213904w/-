var app = getApp();
Page({

  data: {
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
    const _ = db.command
    const $ = _.aggregate
    db.collection('profiles')
      .aggregate()
      .group({
          _id: '$userInfo.province',
          count: $.sum(1)
      })
      .sort({
        count: -1,
      })
      .end()
      .then(res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        wx.hideLoading();
        let list = res.list;
        console.log(list.shift());
        that.setData({
          rankList:list,
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
      title: "这次考试咋这么难呢？不信你看",
      path: "pages/start/start",
      imageUrl: "http://file.xiaomutong.com.cn/9353ef0240fb00bc800956b373ee92e5.png"
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