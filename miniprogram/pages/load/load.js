var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    file: '',
    message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let id = options.id;
    this.setData({
      id
    })
  },
  generate: function(){
    return util.formatTime2(new Date());
  },
  onTap1: function(){
    let that = this;
    console.log('调用到了')
    wx.chooseMessageFile({
      count: 10,
      type: 'all',
      success(res) {
        console.log(res)
        that.uploadFile(res.tempFiles[0]['path'])
      }
    })
  },
  uploadFile: function(path){
    wx.showLoading({
      title: '上传中',
    })
    let ordernum = this.generate();
    let that = this;
    // 调用云函数
    wx.cloud.uploadFile({
      cloudPath: ordernum+'.xlsx',
      filePath: path, // 文件路径
    }).then(res => {
      // get resource ID
      console.log(res)
      that.setData({
        file: res.fileID
      },()=>{
        wx.hideLoading()
      })
      
    }).catch(error => {
      // handle error
    })
  },
  readFile: function(fileID) {
    wx.showLoading({
      title: '解析中',
    })
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'readFile',
      data: {
        fileID,
        category: this.data.id
      },
      success: res => {
        console.log('[云函数] [readFile]: ', res)
        wx.hideLoading()
        wx.showToast({
          title: '导入成功',
          icon: 'success',
          duration: 2000
        })
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  onTap2: function(){
    let file =this.data.file;
    wx.showLoading({
      title: '解析中',
    })
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'checkFile',
      data: {
        fileID:file
      },
      success: res => {
        console.log('[云函数] [readFile]: ', res)
        wx.hideLoading()
        // ["题型", "题目", "选项一", "选项二", "选项三", "选项四", "答案", "解析"]
        let arr = res.result;
        if(arr[0] == '题型' && arr[1] == '题目' && arr[2] == '选项一' && arr[3] == '选项二' && arr[4] == '选项三' && arr[5] == '选项四' && arr[6] == '答案' && arr[7] == '解析'){
          this.setData({
            message: '文件模板校验通过'
          })
          wx.showModal({
            showCancel: false,
            title: '提示',
            confirmText: '我知道了',
            content: '文件模板校验通过',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
    
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })   
        }else{
          this.setData({
            message: '文件模板校验不通过'
          })
          wx.showModal({
            showCancel: false,
            title: '提示',
            confirmText: '我知道了',
            content: '文件模板校验不通过',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
    
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })   
        }
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  onTap3: function(){
    let file =this.data.file;
    this.readFile(file)
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