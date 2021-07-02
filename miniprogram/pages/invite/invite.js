import { md5 } from "../../utils/md5";

// miniprogram/pages/new/new.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    somecode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      somecode: options.somecode
    },()=>{
      this.onQueryCode();
    })
  },
  onQueryCode: function() {
    let that = this;

    const db = wx.cloud.database()
    db.collection('somecode').doc(this.data.somecode)
    .get().then(res => {
      // res.data 包含该记录的数据
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.data.items;

      this.setData({
        items
      },()=>{
        
      })

    })
  },
  complete: async function(){
    const db = wx.cloud.database();
    const res = await db.collection('somecode')
    .where({_id:this.data.somecode})
    .count();

    console.log('[数据库] [查询记录] 成功: ', res);
    if(res.total == 0){
      wx.showModal({
        showCancel: false,
        title: '提示',
        confirmText: '我知道了',
        content: '请核对您的邀请码是否正确',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      }) 
      
      return;
    }
    
    this.add();
  },
  
  add: function(){

    const db = wx.cloud.database();
    db.collection('invite').add({
      data: {
        somecode: this.data.somecode,
        items: this.data.items
      }
    })
    .then(res=>{
      console.log(res);
      db.collection('somecode').doc(this.data.somecode).remove()
      .then(res=>{
        console.log(res);
      })
      .catch(err=>{
        console.log(err);
      })

      wx.showModal({
        showCancel: false,
        title: '提示',
        confirmText: '我知道了',
        content: '激活成功',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            let url = '../start/start';
            wx.redirectTo({
              url: url
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
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