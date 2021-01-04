// TODO 代码分析
const fs = require('fs');
const config = require('./config.js')
const Tile = require('./modules/tile')

// 平铺, 分析每个文件夹大小
// 1. 解析文件目录
// 2. 分析大小
// 3. 分析文件有没有被调用


start()
function start() {
  console.log("start")
 
  const dirs = Tile.start();
  // let obj = {
  //   name: "dist",
  //   children: [...dirs.children]
  // }

  fs.writeFileSync("./data/data.json", JSON.stringify([...dirs.children]));
  console.log("写入完成");
}


