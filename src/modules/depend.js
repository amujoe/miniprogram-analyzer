const { parse } = require("@babel/parser")
const { default: traverse } = require("@babel/traverse");
const fs = require("fs");
const fsA = require("./fs");
const { url } = require("inspector");
const path = require("path");
const tree = require("./tree");


class depend {

    constructor() {
        // this.filepath = ""
    }

    show() {
        console.log("depend show");
    }

    // 解析
    fileDeps(filepath) {
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
            }
            pageObj.size += size;
            pageObj.children.push(fileObj);
        })
      
        return pageObj
    }
    // js
    jsDeps(filepath){
        let size = depend.getSize(filepath);
        let fileObj = {
            value: size,
            name: path.basename(filepath),
            path: filepath,
            children: [{
                value: size,
                name: path.basename(filepath),
                path: filepath,
                children: []
            }]
        }

        let file = fsA.readFileSync(String(filepath), 'utf-8');
        let AST = depend.parse(file);
        let nodes = depend.traverse(filepath, AST);

        if(nodes.length) {
            nodes.forEach(item => {
                fileObj.value += item.value
                fileObj.children.push(item)
            })
        }

        return fileObj
    }
    // json > componets
    jsonDeps(filepath) {
        let compsObj = new tree("json", 0, filepath)
        console.log("json", compsObj)

        let file = JSON.parse(fsA.readFileSync(String(filepath), 'utf-8'));
        let components = file.usingComponents

        for(let key in components) {
            let comObj = new tree()
            comObj.name = key
            comObj.path = components[key]
            compsObj.addChildren(comObj)
        }

        return compsObj;
    }

    wxmlDeps(filepath) {

    }

    wxssDeps(filepath) {

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
                    deps.push({
                        name: path.basename(file),
                        value: depend.getSize(file),
                        path: value
                    })
                }
            },
            ExportDeclaration: ({node}) => {
                // export
                const { value } = node.source
                const file = depend.fileIsExists(filepath, value);
                if(file) {
                    deps.push({
                        name: path.basename(file),
                        value: depend.getSize(file),
                        path: value
                    })
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
        const dirName = path.dirname(filepath) // 文件目录
        const pathAbsolute = path.resolve(dirName, url)  // 绝对路径
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

        // 路径为空 || 文件不存在
        if(!filePath || !fs.existsSync(pathAbsolute)) return 0

        let size = fs.statSync(filePath).size / 1000;
        return Number(size.toFixed(2));
    }
}


module.exports = depend;