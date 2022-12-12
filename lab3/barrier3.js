const fs = require('fs');
let a = 0
const readFile = (path) => {
    return Number(fs.readFileSync(path, 'utf8'))
} 

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('The first promise has resolved');
      resolve(readFile('f1.txt'))
    }, 1 * 1000);
  });
  const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('The second promise has resolved');
      resolve(readFile('./f2.txt'))
    }, 1 * 1000);
  });
  const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('The third promise has resolved');
      resolve(readFile('./f3.txt'))
    }, 1 * 1000);
  });
  // p3.then( res => {
  //   a += res
  //   console.log(a)
  // })

  // p2.then( res => {
  //   a += res
  //   console.log(a)
  // })

  // p1.then( res => {
  //   a += res
  //   console.log(a)
  // })

  

  Promise.all([p1, p2, p3]).then((results) => {
    const total = results.reduce((p, c) => p + c);
  
    console.log(`Results: ${results}`);
    console.log(`Total: ${total}`);
  });