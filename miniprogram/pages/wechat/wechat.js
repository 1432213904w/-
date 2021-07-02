// miniprogram/pages/wechat/wechat.js
var app = getApp();
var util = require('../../utils/util.js');
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
    let time = this.generate();
    this.setData({
      time
    })
  },
  generate: function(){
    return util.formatTime(new Date());
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

  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    let that = this;
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        },()=>{
            this.onGotUserInfo();
        })
      }
    })
  },
  onGotUserInfo: function() {
    let that = this;
        //允许
      
        let userInfo = this.data.userInfo;

        app.globalData.userInfo = userInfo;


        const db = wx.cloud.database();
        db.collection('profiles').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            _id: app.globalData.openid,
            category: app.globalData.category,
            userInfo,
            createTime: this.data.time
          }
        })
        .then(res => {
          console.log(res)
          console.log('[数据库] [查询记录] 成功: ', res);
          that.goHome();
        })
        .catch((err)=>{
          console.log(err)
          that.goHome();
        })

  

  },
  goInfo: function(){
    wx.navigateTo({
      url: '../info/info'
    });
  },
  goHome: function(){
    wx.switchTab({
      url: '../index/index'
    });
  }
})