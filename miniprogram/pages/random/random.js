// pages/moni/moni.js
let _ = require("../../utils/underscore-min.js");
let md5 = require('../../utils/md5.js').md5;
let app = getApp();  
var util = require('../../utils/util.js');  
Page({

  data: {
    showModal: true,
    currIndex: 0,
    favor: false,
    currentNum: 1,
    redNum: 0,
    greenNum: 0,
    allNum: 0,
    showFooter: false,
    indexInd: 0,
    current: 0,
    textTab: "答题模式",
    selectInd: !0,
    testMode: !1,
    everyDay_all: 0,
    xiejie: !0,
    interval: 300,
    arr: [],
    questions: [],
    recmend: !1,
    starshow: !1,
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(options);
    this.queryQues();
  },
  queryQues: async function(){
    let that = this;
    var category = app.globalData.category;
    // 在小程序代码中：
    wx.cloud.callFunction({
      name: 'queryRandomQues',
      data: {
        category: category._id
      },
      complete: res => {
        console.log('callFunction queryRandomQues result: ', res);
        let favorItems = res.result.favorItems;
        let favorArr = [];
        favorItems.forEach((favor)=>{
          favorArr.push(favor.qid);
        })
        console.log(favorArr);
        let arr = res.result.quesItems;
        // arr = _.shuffle(arr);
        arr.forEach((element,index) => {
          element.index = index;
          element.selected = false;
          element.status = false;

          element.favor = false;
          if(favorArr.indexOf(element._id)!=-1){
            element.favor = true;
          }

          element.options.forEach(option=>{
            option.selected = false;
            option.text = '';
          })
        });

        that.setData({
          favor: arr[0]['favor'],
          questions: arr,
          nums: arr.length
        },()=>{
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        
        })
      }
    })
  },
  onQuery:function(){
    let that = this;

    const db = wx.cloud.database()
    db.collection('questions')
    .where({
      category: app.globalData.category._id
    })
    .get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.data;
      let arr = [];
      let questions = [];
      items.map((item,idx)=>{
        console.log(idx);
        console.log(item);
        arr.push(item._id);
        
        let options = item.options;
        options.forEach((o)=>{
          o.selected = false;
        })
        item.index = idx;
        item.options = options;
        item.selected = false;
        item.status = false;
        questions.push(item);
      })
      that.setData({
        questions,
        arr: arr,
        md5: md5(arr.join()),
        nums: arr.length
      },()=>{
        console.log('已赋值完成')
        wx.hideLoading()
      })
    })
  },
  onReady: function () {

  },
  closeModal: function(){
    this.setData({
      showModal: false
    })
  },
  onShow: function () {
    setTimeout(()=>{
      this.setData({
        showModal: true
      })
     
    },1000)
  },
  
  starcollect:function(){
    let favor = this.data.favor;
    this.setData({
      favor: !favor
    },()=>{
      console.log(this.data.currIndex);
      console.log(this.data.questions);
      let questions = this.data.questions;
      let question = this.data.questions[this.data.currIndex];
      question.favor = this.data.favor;
      this.data.questions[this.data.currIndex] = question;
      if(this.data.favor){
        this.addFav(question);
      }
      if(!this.data.favor){
        this.delFav(question);
      }
      
    })



  },
  delFav: function(q){
    wx.cloud.callFunction({
      name: 'delFav',
      data: {
        qid: q._id
      },
      complete: res => {
        console.log('callFunction delFav result: ', res);
      }
    });
  },
  addFav: function(q){
    let that = this;
    let time = util.getTime(new Date());
    const db = wx.cloud.database()
    db.collection('favorite').add({
      data: {
        category: q['category'],
        qid: q['_id'],
        question: q,
        time
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增记录成功',
        })
        
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  
  previewImg: function(){
    var index = 0;
    var imgArr = this.data.questions[this.data.currIndex].imgs;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
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
  jumpToQuestion:function(e) {
    console.log('jump');
    console.log(e.currentTarget.dataset);
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;

    this.setData({
      current: index,
      currentNum: index+1,
      index,
      circular: true,
      showFooter: false,
      videoctrl: true
    },()=>{
      // this.autoPlay();
      console.log('jump结束');
    });
  },
  touchstart: function (t) { },
  bindtouchmove: function (t) { },
  bindtouchend: function (t) { },
  bindKeyInput: function (e) {
    console.log(e.detail.value);
    let index = e.currentTarget.dataset.index;
    console.log(this.data.questions);
    console.log(this.data.currIndex);
    let question = this.data.questions[this.data.currIndex];
    let options = question.options;
    options[index]['text'] = e.detail.value;
    options[index]['selected'] = true;

    question.options = options;
    console.log(index);
    let questions = this.data.questions;
    let currIndex = this.data.currIndex;
    questions[currIndex] = question;
    this.setData({
      questions,
      inputValue: e.detail.value
    })
  },
  selectAnswer: function (e) {
    console.log('selectAnswer');
    console.log(new Date())
    console.log(this.data.questions);
    console.log(e);
    console.log(e.currentTarget.dataset);
    let item = JSON.parse(e.currentTarget.dataset.value);
    if(item.selected){
      return;
    }
    let code = e.currentTarget.dataset.code;
    let answer = e.currentTarget.dataset.answer;
    let options = item.options;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    item.selected = true;

    item.status = false;
    
    options.map(o => {
      if(o.code == code){
        o.selected = true;
      }
      if((o.code == code)&&(o.value == 1)){
        o.val = 1;
        greenNum++;
        item.status = true;
      }
      if((o.code == code)&&(o.value == 0)){
        o.val = 0;
        redNum++;
        item.status = false;
      }
    })
    console.log('item');
    console.log(item);
    item.options = options;
    let questions = this.data.questions;
    questions[item.index] = item;


    console.log(new Date())
    console.log({
      questions,
      greenNum: greenNum,
      redNum: redNum,
    })
    this.setData({
      questions,
      greenNum: greenNum,
      redNum: redNum,
    },()=>{
      console.log(new Date());
      console.log('单选逻辑处理完成')

    })
    // if(item.status == true && item.index < this.data.nums-1){
    //   this.autoPlay();
    // }
  },
  selectAnswerMore: function (t) {
    console.log('多选选第二个选项')
    console.log('selectAnswerMore');
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    let code = t.currentTarget.dataset.code;
    let answer = t.currentTarget.dataset.answer;
    let options = item.options;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    options.map(o => {
      if(o.code == code){
        o.selected = !o.selected;
      }
    })
    console.log(options);
    console.log(item);
    item.options = options;

    let questions = this.data.questions;
    questions[item.index] = item;
    this.setData({
      questions
    })
  },
  newMoreSelectSub: function(t){
    setTimeout(()=>{
      this.moreSelectSub(t);
    },1000)
  },
  moreSelectSub: function (t) {
    console.log('多选');
    console.log('moreSelectSub');
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    if(item.selected){
      return;
    }
    let options = item.options;

    let nums = 0;

    let redNum = this.data.redNum;
    let greenNum = this.data.greenNum;

    item.selected = true;
    item.status = false;
    
    let typecode = item.typecode;
    switch(typecode){
      case '01':
      case '02':
      case '03':
        let arr1 = [];
        let arr2 = [];
        options.forEach(o => {
          if(o.value=='1'){
            arr1.push(o.code)
          }
          if(o.selected){
            arr2.push(o.code);
          }
        })
        if(arr1.join() == arr2.join()){
          greenNum++;
          item.status = true;
        }else{
          redNum++;
          item.status = false;
        }

        break;  
      case '04':
        let arr = [];
        let items = [];
        options.forEach(option=>{
          arr.push(option.text);
          items.push(option.content);
        })               
        if(arr.sort().join('') == items.sort().join('')){
          item.status = true;
        }else{
          item.status = false;
        }
        break;                            
      default: 
      console.log('其他未涉及题型')
    }
    let questions = this.data.questions;
    questions[item.index] = item;

    this.setData({
      questions,
      redNum,
      greenNum
    },()=>{
      console.log('多选提交完成')
    })
    console.log('item');
    console.log(item);

    // if(item.status == true &&  item.index < this.data.nums-1){
    //   this.autoPlay();
    // }
  },
  autoPlay: function () {
    console.log('auto')
    this.setData({
      autoplay: true
    });
  },
  pageChange:function(e){
    console.log('bindchange');
    console.log(e);
    console.log(e.detail);
    let favor = this.data.questions[e.detail.current]['favor'];
    this.setData({
      favor,
      currIndex: e.detail.current,
      currentNum: e.detail.current+1,
      autoplay: false
    })
  },
  _updown: function () {
    this.setData({
      showFooter: !this.data.showFooter
    },()=>{
      console.log(this.data.showFooter)
    })
    
  },
  changeTab: function (t) {
    var that = this
    var questions = that.data.questions;
    that.setData({
      questions: questions,
      textTab: t.currentTarget.dataset.texttab,
      selectInd: "答题模式" == t.currentTarget.dataset.texttab,
      testMode: "答题模式" == t.currentTarget.dataset.texttab
    })
  },
  del_data:function(){

  },
  onUnload: function() {

  }

})