console.log(`Child process is running`);

process.on("message", (message) => {

    switch (message.type) {
        case "close":
            process.exit();

        case "multiply":
            const row = message.row
            const column = message.column
            let res = 0;
            for (let i=0; i<row.length; i++){
                res += row[i]*column[i]
            }

            process.send({
                type: "recive result",
                rowNumber: message.rowNumber,
                columnNumber: message.columnNumber,
                res: res
            })

            break;

        default:

            break;
    }
});

// message from parent = {
//     type: 'recive result',
//     row: array,
//     column: array,
//     rowNumber: Number,
//     columnNumber: Number,
//     res: Number
// }