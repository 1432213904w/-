// pages/examhome/examhome.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  data: {
    passf: 0,
    time: 0,
    num: 0,
    everyf: 1,
    use_title: "",
    training_qids: ""
  },

  onLoad: async function (options) {
    console.log(app.globalData)


    app.globalData.id = options.id;
    wx.showLoading({
      title: '加载中',
    })
    this.onGetOpenid();
    this.setData({
      id: options.id
    },()=>{
      this.onQuery();
      this.onQueryQuesType();
    
    })

    const db = wx.cloud.database()
    const res = await db.collection('favorite').where({
      _openid: app.globalData.openid,
      category: options.id
    }).count();

    this.setData({
      total: res.total
    })
    

  },
  onQueryQuesType: function(){
    let that = this;

    const db = wx.cloud.database()
    db.collection('questype')
    .get()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.data;
      let unitMap = {

      };
      items.forEach(item => {
        unitMap[item._id] = parseInt(item.unit);
      });
      console.log(unitMap);
      app.globalData.unitMap = unitMap;
    })
    .catch(err=>{
      console.error('[数据库] [查询记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      
    })
  },
  onQuery: function(storageCate) {
    let that = this;

    const db = wx.cloud.database()
    db.collection('category').doc(this.data.id).get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      wx.hideLoading()
      that.setData({
        _id: res.data._id,
        name: res.data.name,
      });
    })
  },

  onReady: function () {

  },

  onShow: async function () {
   
  },
  examGo:function (e) {


    // wx.redirectTo({
    //   url: "../someinfo/someinfo?pid="+this.data.pid+"&continued=1&passf=" + passf + "&time=" + time + "&training_qids=0&num=" + num
    // });

    wx.redirectTo({
      url: "../collection/collection?id="+this.data.id
    });
  },

  defaultGo: function(){

    if(this.data.total == 0){
      wx.showModal({
        showCancel: false,
        title: '提示',
        confirmText: '我知道了',
        content: '当前没有任何错题记录',
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
    this.examGo();
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
      this.setData({
        userInfo: res.data.userInfo
      })
    })
    .catch((err)=>{
      console.log(err)
      console.error('[数据库] [查询记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
    })
  }
})