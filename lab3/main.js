const threads = require("worker_threads");
const { Worker, isMainThread } = threads;

const semaforCount = 5

class CountingSemaphore {
   constructor(shared, offset = 0, initial) {
      this.counter = new Int32Array(shared, offset, 1);
      if (typeof initial === "number") {
         Atomics.store(this.counter, 0, initial);
      }
   }

   enter() {
      while (true) {
         Atomics.wait(this.counter, 0, 0);
         const n = Atomics.load(this.counter, 0);
         if (n > 0) {
            const prev = Atomics.compareExchange(this.counter, 0, n, n - 1);
            if (prev === n) return;
         }
      }
   }

   leave() {
      Atomics.add(this.counter, 0, 1);
      Atomics.notify(this.counter, 0, 1);
   }
}

if (isMainThread) {
   const buffer = new SharedArrayBuffer(4);
   const semaphore = new CountingSemaphore(buffer, 0, semaforCount);
   console.log(`Счетчик семафора: ${semaphore.counter[0]}`);
   for (let i = 0; i < 50; i++) {
      new Worker(__filename, { workerData: buffer });
   }
} else {
   const { threadId, workerData } = threads;
   const semaphore = new CountingSemaphore(workerData);
   semaphore.enter();
   console.log(`На поле выходит ${threadId}.`);
   const players = semaforCount - semaphore.counter[0];
   if (players > semaforCount) {
      console.log(`Нарушение! На поле ${players} игроков`);
   }

   setTimeout(() => {
      semaphore.leave();
   }, 10);
}
