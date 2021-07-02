// pages/start/start.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    userInfo: {},
    angle: 0,
    status: false, //是否通过审核
    remind: '加载中',
    checkUser: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onGetOpenid();
    setTimeout(()=>{
      this.setData({
        remind: false
      })
    },1000)
    wx.getSetting({
      success (res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
  },

  goTo:function(){
    let that = this;
    let total = this.data.total
    if(total == 0){
      wx.showActionSheet({
        itemList: ['游客模式', '前去授权'],
        success (res) {
          console.log(res.tapIndex)
          let index = parseInt(res.tapIndex);
          switch(index){
            case 0:
              wx.switchTab({
                url: "../index/index"
              })
              break;
            case 1:
              // 全局只有这一个地方定义openid
              app.globalData.openid = that.data.openid;
              let url = '../wechat/wechat';
              wx.navigateTo({
                url: url
              })
              break;
          }
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })

    }else{
      app.globalData.openid = that.data.openid;
      wx.switchTab({
        url: "../index/index"
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {

      }
    })
    .then(res => {
      console.log('[云函数] [login]: ', res)
      let openid = res.result.openid;
      that.setData({
        openid:openid
      },async ()=>{
        const db = wx.cloud.database();
        const res = await db.collection('profiles').where({
          _openid: openid
        }).count();

        const res2 = await db.collection('invite').where({
          _openid: openid
        }).count();

        console.log(res2);
        if(res2.total==0){
          // let url = '../new/new';
          // wx.redirectTo({
          //   url: url
          // })
        }

        that.setData({
          total: res.total
        })
        console.log(res);
        if(res.total > 0){
          that.queryProfile(openid);
        }
      });
      
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  queryProfile: function(openid){
    let that = this;
    const db = wx.cloud.database()
    db.collection('profiles')
    .doc(openid)
    .get()
    .then((res)=>{
      console.log('[数据库] [查询记录] 成功: ', res);
      app.globalData.category = res.data.category;
      this.setData({
        userInfo: res.data.userInfo
      })
      app.globalData.openid = res.data._openid;
      app.globalData.userInfo = res.data.userInfo
    })
    .catch((err)=>{
      console.log(err)
      console.error('[数据库] [查询记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: "这份考题咋这么难，不信你看！",
      path: "pages/start/start",
      imageUrl: "https://7765-weixinquestion-4ltg8-1301202106.tcb.qcloud.la/img2020102008.jpg?sign=22d70677f3e57411a2c93e62c272369a&t=1603293653"
    };
  }

})