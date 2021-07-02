// miniprogram/pages/qrcode/qrcode.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgArr:[

    ]
  },
  previewImg:function(){

    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[0],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {
        console.log(res)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessagewx', 'shareTimeline']
    });
    wx.showLoading({
      title: '生成中',
    })
    this.onGetQrcode();
    this.onQueryCategory();
  },
  onQueryCategory: function() {
    let that = this;
  

    const db = wx.cloud.database()
    db.collection('category').doc(app.globalData.category._id).get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      that.setData({
        category:res.data
      });
    })
  },
  onGetQrcode: function() {
    let that = this;
    // 调用云函数
    let imgArr = this.data.imgArr;
    wx.cloud.callFunction({
      name: 'qrcode',
      data: {
        category: app.globalData.category._id
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [qrcode]: ', res)
        imgArr.push(res.result.fileID);
        that.setData({
          imgArr
        })
    
      },
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '邀请您参与' + this.data.category.name + '答题了',
      imageUrl:'https://6f6e-onlineexam-bmt8e-1302791251.tcb.qcloud.la/img2020110201.jpg?sign=d1e6df232ae29eeb1b9157d3993a824f&t=1604417316',
      path: 'pages/welcome/welcome?pid=' + this.data.category._id
    }
  },
  onShareTimeline: function(res){
    if(res.from === 'menu'){
      console.log(res.target);
    }
    return {
      title: '自定义分享标题',
      path: 'pages/qrcode/qrcode'
    }
  }
})