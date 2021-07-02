var app = getApp();
var menus = [{
  icon: "http://file.xiaomutong.com.cn/20200501/img04.png",
  title: "分享好友",
  msg: "",
  showRight: 1
},{
  icon: "http://file.xiaomutong.com.cn/20200501/img05.png",
  title: "关于我们",
  msg: "",
  showRight: 1
}];


Page({
  data: {
    menus: menus,
    userInfo: {},
  },
  onLoad: function (e) {
  },
  onShow: function () {
    this.onQuery();
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  go_view: function (e) {
    switch (1 * e.currentTarget.dataset.viewind) {
      case 0:
        break;
      case 1:
        wx.navigateTo({
          url: '../about/about',
        })
        break;
        
      case 4:
        wx.navigateTo({
          url: '../list/list',
        })
        break;
      case 5:
        wx.navigateTo({
          url: '../export/export',
        })
        break;
    }
  },
  about() {
    wx.showModal({
      title: '关于我们',
      content: '本程序仅供考试学习使用，请勿使用于商业用途，如有问题，请联系微信：15692121959。',
      showCancel: false
    })
  },
  onShareAppMessage: function () {
    return {
      title: "这份考题咋这么难，不信你看！",
      path: "pages/index/index",
      imageUrl: "https://7765-weixinquestion-4ltg8-1301202106.tcb.qcloud.la/img2020102008.jpg?sign=22d70677f3e57411a2c93e62c272369a&t=1603293653"
    };
  },
  onQuery: function() {
    let that = this;

    const db = wx.cloud.database()
    db.collection('admin').doc('e373396c5f9051a101c71d1a653ef5c4')
    .get().then(res => {
      // res.data 包含该记录的数据
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.data.items;
      let newMenus = menus.concat()
      console.log(items);
      console.log(app.globalData);
      console.log(items.indexOf(app.globalData.openid));
      return;
      if(items.indexOf(app.globalData.openid) != -1){
        newMenus.push({
          icon: "http://file.xiaomutong.com.cn/icons/import.png",
          title: "导入数据",
          msg: "",
          showRight: 1
        });
        newMenus.push({
          icon: "http://file.xiaomutong.com.cn/icons/export.png",
          title: "导出数据",
          msg: "",
          showRight: 1
        });
      }
      this.setData({
        menus: newMenus
      })

    })
  },
});