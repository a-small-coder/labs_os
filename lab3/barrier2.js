const threads = require("worker_threads");
const { Worker, isMainThread } = threads;


class CyclicBarrier {
   waitingParties = [];
   limit;

   constructor(shared, offset = 0, initial) {
      this.limit = new Int32Array(shared, offset, 1);
      if (typeof initial === "number") {
         Atomics.store(this.limit, 0, initial);
      }
   }

   release() {
      while (this.waitingParties.length) {
         this.waitingParties.pop().call();
      }
   }

   register() {
      return new Promise((resolve, reject) => {
         this.waitingParties.push(resolve);

         if (this.waitingParties.length >= this.limit) {
            this.release();
         }
      });
   }
}

const limit = 4;

if (isMainThread) {
   const buffer = new SharedArrayBuffer(4);
   const barrier = new CyclicBarrier(buffer, 0, limit);
   for (let i = 0; i < 50; i++) {
      new Worker(__filename, { workerData: barrier });
   }
} else {
   const { threadId, workerData } = threads;
   const barrier = new CyclicBarrier(workerData);
   console.log(`На поле выходит ${threadId}.`);

   setTimeout(() => {
      console.log("work done");
      barrier.register();
      console.log(`Всего на поле ${barrier.waitingParties.length}`);
   }, 10);
}
