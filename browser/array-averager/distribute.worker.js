import 'subworkers'

import ArrayWorker from './array.worker.js'

let workers = []
let workerCount = 0
let pendingWorkerCount = 0

const handleSubWorkerMessage = (event) => {
  if (event.data.type === `done`) {
    console.log(event.data.result)
    // typedarray.copyWithin(target, start[, end = this.length])
    pendingWorkerCount--
    if (pendingWorkerCount === 0) {
      postMessage({
        type: `ready`,
      })
    }
  }
}



const initializeSubWorker = () => {
  let worker = new ArrayWorker()
  worker.onmessage = handleSubWorkerMessage
  return worker
}

const handleInitialize = (data) => {
  workerCount = data.workerCount
  for (let i = 0; i < workerCount; i++) {
    workers.push(initializeSubWorker(i))
  }
}

const handleAverageArray = (data) => {
  const uint8Array = new Uint8Array(data.arrayBuffer)
  const length = uint8Array.length
  const subLength = length / workerCount
  for (let workerIndex = 0; workerIndex < workerCount; workerIndex++) {
    let begin = Math.floor(subLength * workerIndex)
    let end = Math.floor(subLength * (workerIndex + 1))
    const detachableCopy = new Uint8Array(length)
    detachableCopy.set(data)
    pendingWorkerCount++
    workers[workerIndex].postMessage(
      {
        type: `average`,
        begin,
        end,
        arrayBuffer: detachableCopy.buffer,
      },
      [detachableCopy.buffer]
    )
  }
}

onmessage = (event) => {
  let type = event.data.type
  switch (type) {
  case `initialize`:
    handleInitialize(event.data)
    break
  case `averageArray`:
    handleAverageArray(event.data)
    break
  }
}
