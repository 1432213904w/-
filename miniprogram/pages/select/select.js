// miniprogram/pages/select/select.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      radioItems: [
          {name: 'cell standard', value: '0', checked: true},
          {name: 'cell standard', value: '1'}
      ],
      checkboxItems: [
          {name: 'standard is dealt for u.', value: '0', checked: true},
          {name: 'standard is dealicient for u.', value: '1'}
      ],
  },
  radioChange: function (e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value);

      var radioItems = this.data.radioItems;
      for (var i = 0, len = radioItems.length; i < len; ++i) {
          radioItems[i].checked = radioItems[i].value == e.detail.value;
      }

      this.setData({
          radioItems: radioItems,
          [`formData.radio`]: e.detail.value
      });
  },
  checkboxChange: function (e) {
      console.log('checkbox发生change事件，携带value值为：', e.detail.value);

      var checkboxItems = this.data.checkboxItems, values = e.detail.value;
      for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
          checkboxItems[i].checked = false;

          for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
              if(checkboxItems[i].value == values[j]){
                  checkboxItems[i].checked = true;
                  break;
              }
          }
      }

      this.setData({
          checkboxItems: checkboxItems,
          [`formData.checkbox`]: e.detail.value
      });
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onQuery();
  },
  onQuery: function(storageCate) {
    let that = this;

    const db = wx.cloud.database()
    db.collection('category').get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res);
      let arr = res.data;
      let items = [];
      arr.forEach(element => {
        items.push({
            name: element.name,
            value: element._id
        })
      });
      this.setData({
        checkboxItems: items
      })
    })
  },
  complete: function(){
    var checkboxItems = this.data.checkboxItems;
    let selected = [];
    checkboxItems.forEach(item=>{
        if(item.checked){
            selected.push(item.value)
        }
    })
    console.log(selected);
    app.globalData.selected = selected;

    if(selected.length == 0){
      wx.showToast({
        icon:'loading',
        title: '请选择题库',
      })
      return
    }
    wx.navigateTo({
        url: '../somecode/somecode',
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