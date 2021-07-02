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
    app.globalData.pid = options.pid;
    wx.showLoading({
      title: '加载中',
    })
    this.onGetOpenid();
    this.setData({
      pid: options.pid
    },async ()=>{
      this.onQuery();
      this.onQueryQuesType();
      
      const db = wx.cloud.database()
      const res = await db.collection('memory').where({
        _id: app.globalData.openid+this.data.pid
      }).count();
      console.log(res);
      if(res.total == 0){
        this.addMemory();
      }
      if(res.total == 1){
        this.getMemory();
      }
    })

    

  },
  getMemory: function(){
    const db = wx.cloud.database()
    db.collection('memory')
    .doc(app.globalData.openid+this.data.pid)
    .get()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      app.globalData.exam = res.data.status;
      app.globalData.items = res.data.items;
      app.globalData.num = res.data.num;

    })
  },
  addMemory: function(){
    let time = util.getTime(new Date());
    const db = wx.cloud.database()
    db.collection('memory').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _id: app.globalData.openid+this.data.pid,
        category: this.data.pid,
        createTime: time,
        items: [],
        num: 0,
        status: 0
      }
    })
    .then(res => {
      console.log(res)
      console.log('[数据库] [查询记录] 成功: ', res);
      app.globalData.exam = 0;
    })
    .catch((err)=>{
      console.log(err)
      
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
    var category = app.globalData.category;

    const db = wx.cloud.database()
    db.collection('category').doc(category._id).get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      app.globalData.quesTotal = res.data.number;
      
      wx.hideLoading()
      that.setData({
        _id: res.data._id,
        time: res.data.time,
        num: res.data.number,
        examtotal: res.data.total,
        use_title: res.data.name,
        passf: res.data.passf,
        category:category
      });
    })
  },

  onReady: function () {

  },

  onShow: function () {
    this.queryHistory();
  },
  queryHistory: function(openid){
    let that = this;
    const db = wx.cloud.database()
    db.collection('historys')
    .where({
      _openid: app.globalData.openid
    })
    .orderBy('score', 'asc')
    .get()
    .then((res)=>{
      console.log('[数据库] [查询记录] 成功: ', res);

      let items = res.data;
      let max = 0;
      items.forEach(item=>{
        if(item.score >= max){
          max = item.score;
        }
      })
      app.globalData.maxNum = max;
      
    })
    .catch((err)=>{
      console.log(err)
      console.error('[数据库] [查询记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
    })
  },
  examGo:function (e) {
    let time = this.data.time;
    let passf = this.data.passf;
    let num = this.data.num;

    // wx.redirectTo({
    //   url: "../someinfo/someinfo?pid="+this.data.pid+"&continued=1&passf=" + passf + "&time=" + time + "&training_qids=0&num=" + num
    // });

    wx.redirectTo({
      url: "../exam/exam?pid="+this.data.pid+"&continued=1&passf=" + passf + "&time=" + time + "&training_qids=0&nums=" + num
    });
  },

  defaultGo: function(){
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
      },async ()=>{
        const db = wx.cloud.database();
        const res = await db.collection('profiles').where({
          _openid: openid
        }).count();
        that.setData({
          total: res.total
        })
        console.log(res);
        if(res.total > 0){
          that.queryProfile(openid);
        }
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
      app.globalData.category = res.data.category;
      this.setData({
        userInfo: res.data.userInfo
      })
      app.globalData.openid = res.data._openid;
      app.globalData.userInfo = res.data.userInfo
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