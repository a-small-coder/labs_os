const { fork, exec } = require('child_process');
const { Worker } = require("worker_threads");

const pid = process.pid

console.log(`(Process - ${pid}): Hello, I'm process with pid=${pid}`)
console.log(`(Process - ${pid}): Now, I will create a two child processes\n`)

const forked1 = fork('child.js');
const forked2 = fork('child.js');


console.log(`(Process - ${pid}): Hello, I'm process with pid=${pid}`)
console.log(`(Process - ${pid}): Now, I will create a two child threads\n`)
const worker1 = new Worker("./thread.js");
const worker2 = new Worker("./thread.js");


exec('ps -x', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
  
    console.log(`${stdout}`);
  });
// forked.on('message', () => {});