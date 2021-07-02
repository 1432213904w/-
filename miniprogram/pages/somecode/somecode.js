// miniprogram/pages/somecode/somecode.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    today: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData);
    wx.showLoading({
      title: '生成中',
    })
    this.onGetNow();
  },
  getSomeCode: function(){
    let random = Math.round(Math.random()*99);
    console.log(random);
    while((''+random).length<4){
      random = '0' + random;
      console.log(random);
    }
    let somecode = this.data.today + random;
    this.setData({
      somecode
    },()=>{
      this.addSomeCode();
    })
  },
  addSomeCode: function(){
    const db = wx.cloud.database();
    db.collection('somecode').add({
      data: {
        _id: this.data.somecode,
        items: app.globalData.selected,
        time: this.data.time
      }
    })
    .then((res) => {
      wx.hideLoading()
      console.log(res)
      console.log('[数据库] [查询记录] 成功: ', res);
    })
    .catch((err)=>{
      console.log(err)
    })
  },
  onGetNow: function() {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'getNow',
      data: {

      }
    })
    .then(res => {
      console.log('[云函数] [getNow]: ', res)
      this.setData({
        today: res.result.today,
        time: res.result.now
      },()=>{
        this.getSomeCode();
      })
      
      
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
    return {
      title:"有好友@你，邀请你来答题了~",
      path: "pages/invite/invite?somecode="+this.data.somecode,
      imageUrl: "http://file.xiaomutong.com.cn/9353ef0240fb00bc800956b373ee92e5.png"
    };
  }
})