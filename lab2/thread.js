const { threadId } = require("worker_threads");
 
// function theCPUIntensiveTask(name) {
//   return `Hello World ${name}`;
// }
 
// const intensiveResult = theCPUIntensiveTask(workerData.name);
 
// parentPort.postMessage(intensiveResult);


const pid = process.pid;
const start = process.hrtime.bigint();

console.log(`(Thread - ${threadId}): Hello, I'm thread with id=${threadId}`);
console.log(`(Thread - ${threadId}): My parent process has pid=${pid}`);
const end = process.hrtime.bigint();
console.log(`(Thread - ${threadId}): I'm working since "${start}" to "${end}" nanoseconds`)
console.log(`(Thread - ${threadId}): My work took ${end - start} nanoseconds\n`)
