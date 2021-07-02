// pages/category/category.js
var app = getApp(), question = require('../../utils/question.js');
let md5 = require('../../utils/md5.js').md5;
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
  handleChange({ detail = {} }) {
    console.log(detail)
    this.setData({
      current: detail.value
    },()=>{
      let key = md5(detail.value);
      console.log(key);
      console.log(this.data.objs);
      let category = this.data.objs[key];
      this.update(category);
    });
  },
  onLoad: function (e) {
    console.log('app.globalData',app.globalData);
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
  },
  onQuery: function(storageCate) {
    let that = this;
    let selectedItems = app.globalData.selectedItems;

    const db = wx.cloud.database()
    db.collection('category').get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res);
      let arr = res.data;
      // let newArr = arr.filter(item => selectedItems.indexOf(item._id) != -1);
      let newArr = arr;
      let objs = {

      };
      newArr.forEach(element => {
        console.log(md5(element.name));
        objs[md5(element.name)] = element;
      });
      that.setData({
        objs,
        cateList: newArr
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
    .then((res)=>{
      console.log(res);
      console.log('更新成功');
      console.log(category);
      app.globalData.category = category;
      // that.delNotes();
      // that.delFavor();

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

    
  },

  clickOver:function(t){
    var that = this;
    if(that.data.current == ''){
      wx.showToast({
        icon:'loading',
        title: '请选择题库',
      })
      return
    }
    that.goHome();
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