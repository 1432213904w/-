// miniprogram/pages/auth/auth.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    random: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.onGetTime();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      openid: app.globalData.openid
    })
  },
  youkeGo: function(){
    wx.navigateBack({
      delta: 1
    })
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
      
        let userInfo = this.data.userInfo;

        app.globalData.userInfo = userInfo;
        this.data.userInfo = userInfo;


        const db = wx.cloud.database();
        const _ = db.command;
        db.collection('profiles').doc(this.data.openid).update({
          // data 字段表示需新增的 JSON 数据
          data: {
            userInfo,
            auth: 1,
            time3: this.data.time
          }
        })
        .then(res => {
          app.globalData.auth = true;
          console.log(res)
          console.log('[数据库] [查询记录] 成功: ', res);
          that.update();
          that.goHome();
        })
        .catch((err)=>{
          console.log(err)
          that.goHome();
        })

    

  },
  update: function(){
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'update',
      data: {
        userInfo: this.data.userInfo
      }
    })
    .then(res=>{
      console.log('[云函数] [update]: ', res)

    })
    .catch(err=>{
      console.error('[云函数] [update] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })

  },
  goHome: function(){
    wx.reLaunch({
      url: '../index/index',
    })
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
  onGetRandom: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'random',
      data: {}
    })
    .then(res=>{
      console.log('[云函数] [getTime]: ', res)
      that.setData({
        random: res.result.random
      })
    })
    .catch(err=>{
      console.error('[云函数] [random] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  onGetTime: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getTime',
      data: {}
    })
    .then(res=>{
      console.log('[云函数] [getTime]: ', res)
      that.setData({
        time: res.result.time,
        today: res.result.today
      })
    })
    .catch(err=>{
      console.error('[云函数] [getTime] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  }
})