// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {


    return await wx.cloud.uploadFile({
      cloudPath: event.fielname,
      filePath: event.path, // 文件路径
    }).then(res => {
      // get resource ID
      console.log(res.fileID)
    }).catch(error => {
      // handle error
    })
    
  } catch (err) {
    console.log(err)
    return err
  }
}