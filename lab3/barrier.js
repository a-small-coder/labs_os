/* 
 * <wsdookadr>
 *
 *
 * Normally , asynchronous operations do not guarantee the order of execution of their callbacks.
 * However, there's a concept called barrier, which stops execution of a thread if it has reached a point P, 
 * until all other threads have reached that same point P and only then continues execution.
 * That concept can be transferred to the async world.
 * 
 * http://en.wikipedia.org/wiki/Synchronous_rendezvous
 *
 * The same mechanism can be used in when dealing with async calls.
 * So in the next example order() will assure the order of execution A->B->C.
 * If we wouldn't have used order() , then you would see a permutation(including identity) of A,B,C 
 * on the screen since there was a random time delay, hence, no guarantee on the order of execution.
 * 
 *
 */



var queue = {
    arrived_at_barrier: [],
    totalCallbacks: 3
};


function A() { console.log("A"); };
function B() { console.log("B"); };
function C() { console.log("C"); };


var order = function (callback,executionTime) {
    return function() {
        var queueLength = 0;
        for(i in queue.arrived_at_barrier) {
            queueLength++;
        };

        queue.arrived_at_barrier[callback.name] = {
            "executionTime": executionTime,
            "callback"     : callback
        };


        if(queueLength < -1 + queue.totalCallbacks) {
            //BARRIER
            console.log("new one");
        } else {
            console.log("last one added, starting to run all of them in order...");
            //Now order A,B,C according to their .executionTime and run them in that order

            var inOrder = [];
            for(i in queue.arrived_at_barrier) {
                inOrder.push(queue.arrived_at_barrier[i]);
            };

            inOrder.sort(function(a,b){ if(a.executionTime < b.executionTime) return -1; if(a.executionTime > b.executionTime) return +1; return 0; });
            for(var j=0;j<inOrder.length;j++) {
                //RUN the callbacks
                inOrder[j].callback();
            };

        };
    };
}


setTimeout( order(A,1),Math.ceil(Math.random(1)*1000) );
setTimeout( order(B,2),Math.ceil(Math.random(1)*1000) );
setTimeout( order(C,3),Math.ceil(Math.random(1)*1000) );