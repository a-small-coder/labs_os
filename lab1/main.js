const os = require('node:os');

console.log("Задание №1\n");
console.log("os.name: ", os.platform());
console.log("user.name: ", os.userInfo().username);
console.log("OS version: ", os.version());

console.log("\nЗадание №2\n");
console.log("total memory: ", os.totalmem());
console.log("free memory: ", os.freemem());
console.log("phisical processors: ", os.cpus());

console.log("\nЗадание №3\n");
console.log("current date: ", new Date());
console.log("uptime: ", os.uptime());

console.log("\nЗадание №4\n");
console.log("os type: ", os.type());
console.log("os arc:", os.arch());
console.log("user dir: ", os.userInfo().homedir);
console.log("networks: ", os.networkInterfaces());