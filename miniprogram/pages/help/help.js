// miniprogram/pages/help/help.js
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
    this.onQuery();
  },
  onQuery: function(){
    let that = this;
    const db = wx.cloud.database()
    db.collection('question').doc('202020501')
    .get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let options = JSON.parse(res.data.options);
        db.collection('question').doc('202020501').update({
        data: {
          options: options
        }
      })
      .then(res=>{
        console.log(res);
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

  }
})