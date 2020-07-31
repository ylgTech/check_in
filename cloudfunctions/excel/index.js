// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "clock-ye8c9"
})

//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const db = cloud.database()
    let specific = await db.collection('clock_data')
    .aggregate()
    .project({
      _id: 0,
      hm: 1,
      ymd: 1,
      location: 1,
      number: 1,
    })
    .end()
    let specificList = specific.list

    let rank = await db.collection('clock_data')
    .aggregate().sortByCount('$number').end()
    let rankList = rank.list

    console.log(rank)
    
    //1,定义excel表格名
    let dataCVS = '粉冶院自习打卡表.xlsx'

    //2，定义存储数据的
    let specificData = [];
    let specificColumn = ['具体时间', '具体日期', '打卡地址', '组别']; //表属性
    specificData.push(specificColumn);

    for (let key in specificList) {
      let arr = [];
      arr.push(specificList[key].hm);
      arr.push(specificList[key].ymd);
      arr.push(specificList[key].location);
      arr.push(specificList[key].number);
      specificData.push(arr)
    }

    let rankData = [];
    let rankColumn = ['组别', '总计打卡数']
    rankData.push(rankColumn)
    for (let i in rankList) {
      rankData.push([rankList[i]._id, rankList[i].count])
    }

    //3，把数据保存到excel里
    var buffer = await xlsx.build([{
      name: "排名数据",
      data: rankData
    },{
      name: "详细数据",
      data: specificData
    }]);

    //4，把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })

  } catch (e) {
    console.log(e)
    return e
  }
}