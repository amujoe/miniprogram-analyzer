class tree {
    constructor(name = "", value=0, path = "") {
        this.name = name
        this.value = value
        this.path = path
        this.children = []
    }

    // 添加体积
    addSize(value) {
        // this.value = (this.value + value).toFixed(2)
        // this.value = this.value + value;
        this.value =this.value + value;
        // this.children.push(obj)
    }

    // 添加子集
    addChildren(obj) {
        this.children.push(obj)
    }
}

module.exports = tree;