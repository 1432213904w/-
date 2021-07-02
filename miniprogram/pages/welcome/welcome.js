// miniprogram/pages/welcome/welcome.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pid: options.pid
    },()=>{
      this.onGetOpenid();
    })
    
  },
  onGetOpenid: function() {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {

      }
    })
    .then(async (res) => {
      console.log('[云函数] [login]: ', res)
      let openid = res.result.openid;
      app.globalData.openid = openid;
      const db = wx.cloud.database();
      const userInfo = await db.collection('profiles').where({
        _openid: openid
      }).count();
      if(userInfo.total == 0){
        wx.redirectTo({
          url: '/pages/userInfo/userInfo?pid=' + this.data.pid
        })
      }

      if(userInfo.total > 0){
        wx.redirectTo({
          url: '/pages/examhome/examhome?pid=' + this.data.pid
        })
      }
      
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.hideLoading()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})