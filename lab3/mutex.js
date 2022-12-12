const threads = require('worker_threads');
const { Worker, isMainThread } = threads;

const LOCKED = 0;
const UNLOCKED = 1;

class Mutex {
  constructor(shared, offset = 0, initial = false) {
    this.lock = new Int32Array(shared, offset, 1);
    if (initial) Atomics.store(this.lock, 0, UNLOCKED);
    this.owner = false;
  }

  enter(callback) {
    Atomics.wait(this.lock, 0, LOCKED);
    Atomics.store(this.lock, 0, LOCKED);
    this.owner = true;
    setTimeout(callback, 0);
  }

  leave() {
    if (!this.owner) return;
    Atomics.store(this.lock, 0, UNLOCKED);
    Atomics.notify(this.lock, 0, 1);
    this.owner = false;
    return true;
  }
}

// Usage

if (isMainThread) {
  const buffer = new SharedArrayBuffer(4);
  const line = new Mutex(buffer, 0, true);
  console.dir({ line });
  for (let i=0; i< 10; i++){
    new Worker(__filename, { workerData: buffer });
  }
} else {
  const { threadId, workerData } = threads;
  const line = new Mutex(workerData);
  if (line.lock) {
    line.enter(() => {
      console.log(`Plane ${threadId} on line!`);
      setTimeout(() => {
        if (line.leave()) {
          console.log(`Plane ${threadId} left line`);
        }
      }, 100);
    });
  } else {
    console.log('Can not leave line: no allow');
  }
}