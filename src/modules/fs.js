let fs = require("fs");

let buf = new Buffer.alloc(1024);

// 读取目录
const readDir = dirpath => {
  let resolve, reject;
  let promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // 读取
  fs.readdir(dirpath, function(err, files) {
    if (err) {
      console.error("读取目录报错:" + err);
      reject(err)
    }
    console.log("读取文件目录成功", files);
    resolve(files)
  });

  return promise;
};

// 读取文件
const read = filepath => {
  let resolve, reject;
  let promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  // 打开文件
  fs.open(filepath, "r+", (err, fd) => {
    if (err) {
      console.error("打开文件报错:" + err);
      reject();
    }

    // 读取
    fs.read(fd, buf, 0, buf.length, 0, function(err, bytes) {
      if (err) {
        console.error("读取文件报错:" + err);
        reject();
      }

      // 仅输出读取的字节
      if (bytes > 0) {
        console.log(buf.slice(0, bytes).toString());
        resolve(buf.slice(0, bytes).toString());
      }

      // 关闭文件
      fs.close(fd, function(err){
        if (err){
          console.error("文件关闭报错:" + err);
        } 
        console.log("文件关闭成功");
     });
    });
  });
  return promise;
};

/**
 * 异步方式读取
 * filepath 文件路径
 */
const readFile = filepath => {
  let resolve, reject;
  let promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // 读取
  fs.readFile(filepath, function(err, data) {
    if (err) {
      console.error("读取文件报错:" + err);
      reject();
      return;
    }
    
    console.log("文件读取成功");
    resolve(data);
  });

  return promise;
};

/**
 * 同步方式读取
 * filepath 文件路径
 */
const readFileSync = filepath => {
  // 读取
  return fs.readFileSync(filepath, 'utf-8');
};

/**
 * 获取文件信息 同步
 * filepath 文件路径
 */
const statFileSync = (filepath) => {

  // 读取文件信息
  return fs.statSync(filepath);
};

/**
 * 获取文件信息
 * filepath 文件路径
 * isFn 判断内容
 */
const statFile = (filepath) => {
  let resolve, reject;
  let promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // 读取
  fs.stat(filepath, function(err, stats) {
    if (err) {
      console.error("获取文件信息报错:" + err);
      reject();
      return;
    }

    console.log("读取文件信息成功！", stats);

    // 输出: 是否是文件
    if(isFn === "isFile") {
      resolve(stats.isFile())
      return
    }

    // 输出: 是否是文件夹
    if(isFn === "isDirectory") {
      resolve(stats.isDirectory())
      return
    }

    // 输出: 文件信息
    resolve(stats)
    return promise;
  });
};

// 写入文件
const writeFile = (file, content) => {
  let resolve, reject;
  let promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  fs.writeFile(file, content, err => {
    if (err) {
      console.log("写入文件失败", err);
      reject();
      return
    }

    console.log("写入文件成功");
    resolve();
  });

  return promise;
};


module.exports = { 
  // 读取目录
  readDir,
  // 读取
  read,
  readFile,
  readFileSync,
  // 获取文件信息
  statFile,
  statFileSync,
  // 写入
  writeFile
};
