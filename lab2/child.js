// process.on('message', (msg) => {
//     console.log('Message from parent:', msg);
//   });

const pid = process.pid;
const ppid = process.ppid;
const start = process.hrtime.bigint();

console.log(`(Process - ${pid}): Hello, I'm process with pid=${pid}`);
console.log(`(Process - ${pid}): My parent process has pid=${ppid}`);
const end = process.hrtime.bigint();
console.log(`(Process - ${pid}): I'm working since "${start}" to "${end}" nanoseconds`)
console.log(`(Process - ${pid}): My work took ${end - start} nanoseconds\n`)

