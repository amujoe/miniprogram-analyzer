// TODO 代码分析
const fs = require('./modules/fs');
const config = require('./config.js')
const depTools = require('./modules/depend')
const tree = require("./modules/tree");

// 从 app.json 里面文件入手, 根据文件调用关系, 分析文件大小
// 1. 拉取文件目录
// 2. 分析文件大小
// 2.1 分析文件依赖的组件
// 3. 生存 json
// 4. 导出图形

start()

function start() {

  const pages = ready();
  const mainSize = analyzerSize(pages.main);
  const subSize = analyzerSize(pages.subPackages);

  fs.writeFile("./data/data.json", JSON.stringify([...mainSize, ...subSize]));
}


// 1. 拉取文件目录
function ready() {

  let appJson = JSON.parse(fs.readFileSync(config.appJson));
  let main = [
    {
      root: "pages",
      name: "pages",
      pages: appJson.pages.map(item => item.substr(6))
    }
  ]
  return {
    main: main, // 主包,
    subPackages: appJson.subPackages // 分包
  }
}

// 2. 分析分包, 文件大小
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
