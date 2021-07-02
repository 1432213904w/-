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
    let pid = options.pid;
    let time = this.generate();
    this.setData({
      time,
      pid
    },()=>{
      this.onQuery();
    })
  },
  onQuery: function(storageCate) {

    const db = wx.cloud.database()
    db.collection('category').doc(this.data.pid).get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res);
      this.setData({
        category: res.data
      })
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

  onGotUserInfo: function(e) {
    let that = this;
    console.log(e);

    if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        //拒绝
        wx.showModal({
          showCancel: false,
          title: '提示',
          confirmText: '我知道了',
          content: '确定使用游客身份体验吗',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.examhomeGo();
         
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })       

    } else if (e.detail.errMsg === 'getUserInfo:ok') {
        //允许
      
        let userInfo = e.detail.userInfo;

        app.globalData.userInfo = userInfo;


        const db = wx.cloud.database();
        db.collection('profiles').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            _id: app.globalData.openid,
            category: this.data.category,
            userInfo,
            createTime: this.data.time
          }
        })
        .then(res => {
          console.log(res)
          console.log('[数据库] [查询记录] 成功: ', res);
          this.examhomeGo();
        })
        .catch((err)=>{
          console.log(err)
          this.examhomeGo();
        })

    }

  },
  examhomeGo: function(){
    wx.redirectTo({
      url: '/pages/examhome/examhome?pid=' + this.data.pid
    })
  },
  goHome: function(){
    wx.switchTab({
      url: '../index/index'
    });
  }
})