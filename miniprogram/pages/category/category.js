// pages/category/category.js
var app = getApp(), question = require('../../utils/question.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedCate:'',
    cateList: [],
    cattext:'',
    loading:!1,
    storageCate:''
  },

  onLoad: function (e) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    this.onGetOpenid();

    let that = this;
    let category = app.globalData.category;
    that.setData({
      category
    })
    that.onQuery();
    this.queryQuesCount();
  },
  onQuery: function(storageCate) {
    let that = this;

    const db = wx.cloud.database()
    db.collection('category').get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res);
      let arr = res.data;
      let objs = {

      };
      arr.forEach(element => {
        objs[element._id] = element;
      });
      that.setData({
        objs,
        cateList: res.data
      })
    })
  },
  onReady: function () {

  },

  onShow: function () {
    
  },
  update: function(category){
    let that = this;
    const db = wx.cloud.database();
    const _ = db.command
    let openid = app.globalData.openid;
    db.collection('profiles')
    .doc(openid).update({
      data: {
        category: category
      }
    })
    .then(()=>{
      console.log('更新成功');
      console.log(category);
      app.globalData.category = category;
      that.delNotes();
      that.delFavor();

    })
    .catch(err => {
      console.log(err);
    })
  },
  delNotes: function(){
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'delNotes',
      // 传递给云函数的event参数
      data: {

      }
    }).then(res => {
      // output: res.result === 3
    }).catch(err => {
      // handle error
    })
  },
  delFavor: function(){
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'delFavor',
      // 传递给云函数的event参数
      data: {
 
      }
    }).then(res => {
      // output: res.result === 3
    }).catch(err => {
      // handle error
    })
  },
  cardSelect:function(t){
    let objs = this.data.objs;
    let selectedCate = this.data.selectedCate;
    let category = objs[t.currentTarget.dataset.id];
    this.setData({
      category
    })
    this.update(category);
    this.setData({
      selectedCate: t.currentTarget.dataset.id,
      selectedCateName: t.currentTarget.dataset.name,
      selectedCateNum: t.currentTarget.dataset.number,
      selectedCateTime: t.currentTarget.dataset.time,
      selectedCatePassf: t.currentTarget.dataset.passf
    })
    this.queryQuesCount()
    
  },

  queryQuesCount:function(){
    var that = this;
    that.setData({
      loading: !0
    }), wx.showLoading({
      title: "加载中"
    });
    that.onQueryQues();
  },
  onQueryQues:function(){
    let that = this;

    const db = wx.cloud.database()
    db.collection('question').where({
      category: app.globalData.category._id
    }).get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      wx.hideLoading();
      setTimeout(function () {
        that.setData({
          loading: !1
        });
      }, 1e3);
      that.setData({
        count:res.data.length,
      });
    })
  
  },
  clickOver:function(t){
    var that = this;
    if(that.data.selectedCate == ''){
      wx.showToast({
        icon:'loading',
        title: '请选择题库',
      })
      return
    }
    that.goHome();
  },
  onQueryQuesList:function(){
    let that = this;

    const db = wx.cloud.database()
    db.collection('question').where({
      category: that.data.selectedCate
    }).get().then(res => {
      // res.data 包含该记录的数据
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.data;
      items.map(it=>{

      })
    })
  
  },
  goHome: function () {
    wx.switchTab({
      url: "../index/index"
    })
  },
  onGetOpenid: function() {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        that.setData({
          openid: res.result.openid
        })
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  }
})