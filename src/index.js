// TODO 代码分析
const fs = require('./modules/fs');
const fsA = require('fs');
const config = require('./config.js')
const depend = require('./modules/depend')
const path = require("path");

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

test()
// start()

function test() {
  let pageFullPath = config.projectDir + "dist/goods/goods-detail/goods-detail.json";
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

  let dep = new depend();
  console.log("dep", dep);
  // // dep.filepath = pageFullPath;
  // // console.log('dep', dep);
  // // dep.show();

  let nodes = dep.jsonDeps(pageFullPath)
  console.log("nodes", nodes);
  // dep.show();

  fsA.writeFile("./src/data.json", JSON.stringify(nodes), (err) => {
    if (err) throw err;
    console.log("err", err)

  });


}


function start() {

  console.log("config", config);

  const pages = ready();
  const subSize = analyzerSize(pages.subPackages);
  // console.log("subSize", subSize)

  fs.writeFile("./src/data.json", JSON.stringify(subSize));
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

  // let subsObj = {
  //   value: 0,
  //   name: "小程序分包",
  //   path: "pages",
  //   children: []
  // }

  let subsArr = []

  // 每个包
  subs.forEach(sub => {
    let subObj = {
      value: 0,
      name: sub.root,
      path: sub.root,
      children: []
    }

    // 页面 page start
    sub.pages.forEach(page => {
      // 页面目录
      let pagePath = `${sub.root}/${page}`
      let pageObj = pageSize(pagePath);

      subObj.value += pageObj.value;
      subObj.children.push(pageObj);
    })

    // subsObj.value += subObj.value;
    // subsObj.children.push(subObj)
    // subsArr.value += subObj.value;
    subsArr.push(subObj)
  })

  return subsArr
}

function pageSize (pagePath) {
  let suffixs = ['js', 'json', 'wxml', 'wxss'];

  let pageArr = pagePath.split("/");
  let pageName = pageArr[pageArr.length - 1];
  let pageObj = {
    value: 0,
    name: pageName,
    path: pageName,
    children: []
  }

  // 文件 start
  suffixs.forEach(suffix => {
    let pageFullPath = `${config.distPath}/${pagePath}.${suffix}`
    let size = fs.statFileSync(pageFullPath).size / 1000;
    size = Number(size.toFixed(2));

    // console.log(pageFullPath, size);


    let fileObj = {}

    if(suffix === "js") {
      let dep = new depend();
      fileObj = dep.jsDeps(pageFullPath);

    } else {
      fileObj = {
        value: size,
        name: `${pageName}.${suffix}`,
        path: pagePath,
        children: []
      }
    }

    pageObj.value += size;
    pageObj.children.push(fileObj);
  })

  return pageObj
}
