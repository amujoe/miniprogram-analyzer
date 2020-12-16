// TODO 代码分析
const fs = require('./modules/fs');
const fsA = require('fs');
const config = require('./config.js')
const depend = require('./modules/depend')
const path = require("path");
const tree = require("./modules/tree");
// const serve = require("./modules/serve");
const cmd = require("./modules/cmd");

let depTools = new depend();

// console.log('path', path);

// 1. 拉取文件目录
// 2. 分析文件大小
// 2.1 分析文件依赖的组件
// 3. 生存 json
// 4. 导出图形

// console.log('depend', depend);
// let dep = new depend();
// dep.show();

// let pageFullPath = config.projectDir + "dist/goods/goods-detail/goods-detail.js";
// let url = "../../utils/templateMessageIds";
// let path = path.resolve(pageFullPath, url)
// console.log('path', path)
// console.log("fsext", fs.existsSync(path))

// test()
start()

function test() {
  console.log("123")
  // let pageFullPath = config.projectDir + "dist/goods/goods-detail/goods-detail.json";
  // let url = "../../api/goods-detail-api";

  // let pathRes = path.resolve(pageFullPath, url)
  // let dir = path.dirname(pageFullPath)
  // console.log('dir', dir)
  // console.log('path', pathRes)
  // console.log("fsext", fsA.existsSync(pathRes))

  // let stat = fs.statFileSync(macpath + pageFullPath);
  // console.log('stat', stat.isFile());
  // console.log('stat', stat);

  // let file = fs.readFileSync(pageFullPath);
  // return

  // fsA.writeFile("./src/data.json", "hello world", (err) => {
  //   if (err) throw err;
  //   console.log("err", err)

  // });
  // let subObj = new tree("123", 20, "123")
  // subObj.sizeA=23
  // console.log('subobj', subObj);

  // let dep = new depend();
  // console.log("dep", dep);
  // // // dep.filepath = pageFullPath;
  // // // console.log('dep', dep);
  // // // dep.show();

  // let nodes = dep.jsonDeps(pageFullPath)
  // console.log("nodes", nodes);
  // // dep.show();

  // fsA.writeFile("./src/data.json", JSON.stringify(nodes), (err) => {
  //   if (err) throw err;
  //   console.log("err", err)

  // });

  // cmd.run("node src/modules/serve.js")

}


function start() {

  console.log("config", config);

  const pages = ready();
  const subSize = analyzerSize(pages.subPackages);
  // console.log("subSize", subSize)

  fs.writeFile("./data/data.json", JSON.stringify(subSize));
}


// 1. 拉取文件目录
function ready() {

  let appJson = JSON.parse(fs.readFileSync(config.appJson));

  return {
    main: appJson.pages, // 主包,
    subPackages: appJson.subPackages // 分包
  }
}


// 分析分包, 文件大小
function analyzerSize(subs) {

  if(!Array.isArray(subs) || subs.length == 0) {
    return
  }

  let subsArr = []

  // 每个包
  subs.forEach(sub => {
    let subObj = new tree(sub.root, 0, sub.root)

    // 页面 page start
    sub.pages.forEach(page => {
      // 页面目录
      let pagePath = `${config.distPath}/${sub.root}/${page}`
      let pageObj = depTools.fileDeps(pagePath);
      console.log("pageObj",pageObj.value)

      // subObj.value += pageObj.value;
      subObj.addSize(pageObj.value)
      subObj.addChildren(pageObj);
    })
   
    subsArr.push(subObj)
  })

  return subsArr
}
