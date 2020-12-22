const { parse } = require("@babel/parser")
const { default: traverse } = require("@babel/traverse");
const fs = require("fs");
const fsA = require("./fs");
const { url } = require("inspector");
const path = require("path");
const config = require('../config.js')
const tree = require("./tree");


class depend {

    constructor() {
    }

    // 解析
    static fileDeps(filepath) {
        // console.log("filepath", filepath);
        let pageObj = new tree(path.basename(filepath), 0, filepath)
        
        let suffixs = ['js', 'json', 'wxml', 'wxss'];
        suffixs.forEach(suffix => {
            let fullPath = `${filepath}.${suffix}`;
            let fileObj = null;

            switch(suffix) {
                case "js":
                    fileObj = depend.jsDeps(fullPath)
                    break
                case "json":
                    fileObj = depend.jsonDeps(fullPath)
                    break
                case "wxml":
                    fileObj = depend.wxmlDeps(fullPath)
                    break
                case "wxss":
                    fileObj = depend.wxssDeps(fullPath)
                    break
                default:
                    break
            }
            // pageObj.value += fileObj.value;
            pageObj.addSize(fileObj.value)
            pageObj.children.push(fileObj);
        })
      
        return pageObj
    }
    // js
    static jsDeps(filepath){
        // console.log("filepath2", filepath);
        let jsObj = new tree(path.basename(filepath), depend.getSize(filepath), filepath)

        let selfObj = JSON.parse(JSON.stringify(jsObj))
        jsObj.addChildren(selfObj)

        let file = fsA.readFileSync(String(filepath), 'utf-8');
        let AST = depend.parse(file);
        let nodes = depend.traverse(filepath, AST);

        if(nodes.length) {
            nodes.forEach(item => {
                // jsObj.value += item.value
                jsObj.addSize(item.value)
                jsObj.addChildren(item)
            })
        }

        return jsObj
    }
    // json > componets
    static jsonDeps(filepath) {
        let compsObj = new tree("json", 0, filepath)
        // console.log("json", compsObj)

        let file = JSON.parse(fsA.readFileSync(String(filepath), 'utf-8'));
        let components = file.usingComponents
        console.log("filepath-1", filepath);
        console.log("components", components);

        // 没有组件
        if (!components) {
            console.log("components is undefined");
            return compsObj;
        }

        for(let key in components) {
            console.log("components[key]-1", components[key])
            // console.log("components[key]-path", depend.getPathAbsolute(filepath, components[key]));
            console.log("plugin", components[key].substr(0, 9))

            let comPath = "";
            // ‘/’ 表示公共组件
            if (components[key][0] == '/') {
                comPath = config.distPath + components[key];
            } else if (components[key].substr(0, 9) == 'plugin://') {
                // 插件 
                continue;
            } else {
                comPath = depend.getPathAbsolute(filepath, components[key])
            }

            // let comPath = depend.getPathAbsolute(filepath, components[key])
            let comObj = depend.fileDeps(comPath)
            // console.log("comObj", comObj)
            // let comObj = new tree()
            // comObj.name = key
            // comObj.path = depend.getPathAbsolute(filepath, components[key])
            // com = depend.fileDeps(comObj.path);

            // subObj.addSize(pageObj.value)
            // subObj.addChildren(pageObj);
            compsObj.addSize(comObj.value)
            compsObj.addChildren(comObj)
        }

        return compsObj;
    }

    // wxml
    static wxmlDeps(filepath) {
        let wxmlObj = new tree(path.basename(filepath), 0, filepath)
        wxmlObj.value = depend.getSize(filepath);

        return wxmlObj;
    }

    // wxss
    static wxssDeps(filepath) {
        let wxssObj = new tree(path.basename(filepath), 0, filepath)
        wxssObj.value = depend.getSize(filepath);
        
        return wxssObj;
    }

    // 解析为 AST 节点
    static parse(content) {
        return parse(content, {
            sourceType: 'module',
            plugins: ["exportDefaultFrom"]
        })
    }
    // 遍历 AST 节点, 解析依赖
    static traverse(filepath, ast) {

        let deps = []
        traverse(ast, {
            ImportDeclaration: ({ node }) => {
                // import from
                const { value } = node.source
                const file = depend.fileIsExists(filepath, value);
                if(file) {
                    let wxmlObj = new tree(path.basename(file), depend.getSize(file), value)
                    deps.push(wxmlObj)
                }
            },
            ExportDeclaration: ({node}) => {
                // export
                const { value } = node.source
                const file = depend.fileIsExists(filepath, value);
                if(file) {
                    let wxmlObj = new tree(path.basename(file), depend.getSize(file), value)
                    deps.push(wxmlObj)
                    // deps.push({
                    //     name: path.basename(file),
                    //     value: depend.getSize(file),
                    //     path: value
                    // })
                }
                // console.log("export", node);
            },
            CallExpression: ({node}) => {
                // console.log("call", node);

            },
        })

        return deps;
    }
    // 判断文件是不是真实存在
    static fileIsExists(filepath, url){
        const pathAbsolute = depend.getPathAbsolute(filepath, url)  // 绝对路径
        const ext = path.extname(url)  // 后缀
        // console.log("filepath", filepath);
        // console.log("url", url);
        // console.log("pathAbsolute", pathAbsolute);
        // console.log("fs.ex", fs.existsSync(pathAbsolute));

        // 1. 如果有后缀表示是文件, 是文件 && 存在
        if(ext === ".js" && fs.existsSync(pathAbsolute)){
            return pathAbsolute
        }

        // 2. 没后缀, 加后缀
        const tempFile = pathAbsolute + '.js'
        if(fs.existsSync(tempFile)){
            return tempFile
        }

        // 3. 找 index.js 文件
        const indexFile = path.join(pathAbsolute, 'index.js')
        if(fs.existsSync(indexFile)){
            return indexFile
        }

        return null
    }
    // 获取文件大小
    static getSize(filePath) {
        // console.log("filePath3", filePath)

        // 路径为空 || 文件不存在
        if(!filePath || !fs.existsSync(filePath)) return 0

        let size = fs.statSync(filePath).size / 1000;
        return Number(size.toFixed(2));
    }
    // 获取绝对路径
    static getPathAbsolute(filePath, url) {
        if(!filePath || !url) return "";

        return path.resolve(path.dirname(filePath), url)  // 绝对路径
    }
}


module.exports = depend;