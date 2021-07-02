// pages/examhome/examhome.js
var app = getApp();
let util = require('../../utils/util.js');
Page({

  data: {
    skipnum: 0,
    passf: 0,
    time: 0,
    num: 0,
    total: 0,
    everyf: 1,
    use_title: "",
    training_qids: ""
  },

  onLoad: async function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let category = app.globalData.category;

    this.onQuery();

    const db = wx.cloud.database()
    const countResult = await db.collection('questions').where({
      category:category._id
    }).count()
    console.log('当前题库题目个数信息为',countResult);

    const quesNum = countResult.total;
    app.globalData.quesTotalNum = quesNum;

    this.setData({
      id: category._id,
      quesNum
    },()=>{
      this.addRecord();
    })

  },
  addRecord: async function(){
    let quesNum = this.data.quesNum;
    let pid = this.data.id;
    let time = util.getTime(new Date());
    const db = wx.cloud.database();
    const res = await db.collection('record').where({
      _id: app.globalData.openid+pid
    }).count();

    console.log(res);
    if(res.total > 0){
      db.collection('record')
      .doc(app.globalData.openid+pid)
      .get()
      .then((res)=>{
        console.log('[数据库] [查询记录] 成功: ', res);
        let num = res.data.num;
        app.globalData.skipnum = num;
        console.log('num',num);
        this.setData({
          skipnum: num
        },()=>{
          wx.hideLoading()
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
    if(res.total == 0){
      app.globalData.skipnum = 0;
      db.collection('record').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          _id: app.globalData.openid+pid,
          pid: pid,
          createTime: time,
          num: 0
        }
      })
      .then(res => {
        console.log(res)
        console.log('[数据库] [查询记录] 成功: ', res);
        wx.hideLoading()
       
      })
      .catch((err)=>{
        console.log(err)
        
      })
    }
  },
  onQuery: function(storageCate) {
    let that = this;
    var category = app.globalData.category;

    const db = wx.cloud.database()
    db.collection('category').doc(category._id).get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      
      that.setData({
        _id: res.data._id,
        time: res.data.time,
        num: res.data.number,
        total: res.data.total,
        use_title: res.data.name,
        passf: res.data.passf,
        time1: res.data.time1,
        time2: res.data.time2,
        category:category
      });
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },
  examGo:function (e) {
    wx.redirectTo({
      url: "../sort/sort"
    });


  },
  update: function() {
    // 调用云函数
    let that = this;
    let _id = app.globalData.openid + app.globalData.category._id
    wx.cloud.callFunction({
      name: 'updateNum',
      data: {
        _id: _id
      }
    })
    .then(res => {
      console.log('[云函数] [updateNum]: ', res)
      app.globalData.skipnum = 0;
      this.examGo();
      
    }).catch(err => {
      console.error('[云函数] [updateNum] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  repeatGo: function(){
    this.update();
  },
  defaultGo: function(){
    this.examGo();
  }
})