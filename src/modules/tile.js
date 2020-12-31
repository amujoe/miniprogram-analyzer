
const fs = require("fs");
const config = require('../config.js');
const depend = require("./depend.js");
const tree = require("./tree");

class tile {

    constructor() {
    }


    static start() {

        let distpath = config.distPath + '/';
       
        // 第一层级
        const dirs = tile.depend('dist', distpath);
        console.log("dirs", dirs);

        return dirs;
    }

    // 递归
    static depend(name, path) {

        if(!path) {
            console.log("depend: Invalid path")
        }

        // 查看文件夹下的目录
        let filesDir = new tree(name, 0, path)
        let filenames = tile.analyzerDir(path);
        
        filenames.forEach(item => {

            // 如果是文件夹
            if (tile.isDir(path + item)) {
                console.log("path-dir", `${path}${item}/`)
                let fileschildren = tile.depend(item, `${path}${item}/`)

                filesDir.addSize(fileschildren.value);
                filesDir.addChildren(fileschildren);
                return;
            }

            //  是文件
            let file = new tree(item, 0, path + item)
            console.log("file", file);
            // 是文件
            file.value = tile.getSize(path + item)

            filesDir.addSize(file.value)
            filesDir.addChildren(file)
        })

        return filesDir;
    }

    // 分析文件目录
    static analyzerDir(path) {
        console.log("path isDir?", path);
        console.log("path isDir?", tile.isDir(path));

        if (!tile.isDir(path)) {
            console.log("analyzerDir: Invalid path")
        }

        return fs.readdirSync(path);
    }

    // 判断是不是目录
    static isDir(path) {
        let file = fs.statSync(path)
        return file.isDirectory()
    }

    // 获取文件大小
    static getSize(filePath) {
        // console.log("filePath3", filePath)

        // 路径为空 || 文件不存在
        if(!filePath || !fs.existsSync(filePath)) return 0

        let size = fs.statSync(filePath).size / 1000;
        return Number(size.toFixed(2));
    }
}

module.exports = tile;
