import 'subworkers'

import MessageLogger from './message-logger.worker.js'

let workers = []
let workerCount = 0

let pendingMessageCount = 0
let messageProcessedCount = 0

const handleSubWorkerMessage = event => {
    pendingMessageCount--
    messageProcessedCount++
    if(pendingMessageCount === 0) {
        postMessage({
            type: 'ready'
        })
    }
}

const initializeSubWorker = workerIndex => {
    let worker = new MessageLogger()
    worker.onmessage = handleSubWorkerMessage
    return worker
}

const handleInitialize = data => {
    workerCount = data.workerCount
    for (let i = 0; i < workerCount; i++) {
        workers.push(initializeSubWorker(i))
    }
}

const handleLogMessages = data => {
    data.messages.forEach((message, index) => {
        pendingMessageCount++
        workers[index % workerCount].postMessage(message)
    })
}

onmessage = event => {
    let type = event.data.type
    switch (type) {
        case 'initialize':
            handleInitialize(event.data)
            break;
        case 'logMessages':
            handleLogMessages(event.data)
            break;
    }
}