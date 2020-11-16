class tree {
    constructor(name = "", size=0, path = "") {
        this.name = name
        this.size = size
        this.path = path
        this.children = []
    }

    // 控制 value 保留两位小数
    set value(value) {
        return Number(value.toFixed(2))
    }

    // 添加子集
    addChildren(obj) {
        this.children.push(obj)
    }
}

module.exports = tree;