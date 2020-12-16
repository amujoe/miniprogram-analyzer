const cp = require('child_process')

// 运行指令
const runCommand = command => {
  let resolve, reject
  let promise = new Promise((res, rej) =>{
    resolve = res
    reject = rej
  })

  console.info('command:' + command)
  cp.exec(command, (err, stdout, stderr) => {
    if(err) {
      console.error('cmd err', err)
      reject(err, stdout, stderr)
    } 
    if(stdout) {
      console.info('cmd stdout', stdout)
      resolve(err, stdout, stderr)
    }
    if(stderr) {
      console.error('cmd stderr', stderr)
      resolve(err, stdout, stderr)
    }
  })

  return promise
}

module.exports = {
  run: runCommand
}