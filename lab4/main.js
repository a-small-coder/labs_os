const child_process = require('child_process');

const child = child_process.fork('child.js');
const child2 = child_process.fork('child.js');

function setRes(rowNumber, columnNumber, res, pid){
    console.log(`pid= ${pid} | res: ${res} of [${rowNumber}][${columnNumber}]`)
    RESULT[rowNumber][columnNumber] = res
}

function registerRes(){
    currentRowColumn[1] += 1
    if(currentRowColumn[1] == n) {
        currentRowColumn[0] += 1
        currentRowColumn[1] = 0
    }
}

function processDone(){
    aviableProcess -= 1
    if (aviableProcess == 0){
        for(let i=0; i< RESULT.length; i++){
            console.log(RESULT[i])
        }
        console.log(`We spent ${Date.now() - time} ms`)
    }
}

// settings

const n = 40
const m = 40

const A = []
const B = []
const RESULT = []

aviableProcess = 2
currentRowColumn = [0, 0]

const time = Date.now()

for(let i=0; i<m; i++){
    A.push(Array.from({length: n}, () => Math.floor(Math.random() * 40)))
    B.push(Array.from({length: n}, () => Math.floor(Math.random() * 40)))
    RESULT.push(Array.from({length: n}, () => 0))
}
// init work

child.send({
    type: 'multiply',
    row: A[currentRowColumn[0]],
    column: B[currentRowColumn[1]],
    rowNumber: currentRowColumn[0],
    columnNumber: currentRowColumn[1]
})
registerRes()

child2.send({
    type: 'multiply',
    row: A[currentRowColumn[0]],
    column: B[currentRowColumn[1]],
    rowNumber: currentRowColumn[0],
    columnNumber: currentRowColumn[1]
})


// listening process

child.on('message', (message) => {
    switch (message.type) {
        case 'recive result':
            setRes(message.rowNumber, message.columnNumber, message.res, child.pid)
            registerRes()
            if (currentRowColumn[0] < m){
                child.send({
                    type: 'multiply',
                    row: A[currentRowColumn[0]],
                    column: B[currentRowColumn[1]],
                    rowNumber: currentRowColumn[0],
                    columnNumber: currentRowColumn[1]
                })
            }
            else {
                child.send({
                    type: "close"
                })
            }
            break;
    
        default:
            break;
    }
});

child2.on('message', (message) => {
    switch (message.type) {
        case 'recive result':
            setRes(message.rowNumber, message.columnNumber, message.res, child2.pid)
            registerRes()
            if (currentRowColumn[0] < m){
                child2.send({
                    type: 'multiply',
                    row: A[currentRowColumn[0]],
                    column: B[currentRowColumn[1]],
                    rowNumber: currentRowColumn[0],
                    columnNumber: currentRowColumn[1]
                })
            }
            // else {
            //     child2.send({
            //         type: "close"
            //     })
            // }
            break;
    
        default:
            break;
    }
});

child.on('close', (code) => {
    console.log(`Child process exited. Code: ${code}`)
    processDone()
}
);

child2.on('close', (code) => {
    console.log(`Child process exited. Code: ${code}`)
    processDone()
}
  
  
);


// message from child = {
//     type: 'recive result',
//     rowNumber: Number,
//     columnNumber: Number,
//     res: Number
// }


