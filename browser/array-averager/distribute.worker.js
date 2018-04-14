import 'subworkers'

import ExecuteWorker from './execute.worker.js'

let workers = []
let workerCount = 0
let pendingWorkerCount = 0
let results = []

function handleExecutionMessage (event) {
  if (event.data.type === `done`) {
    // typedarray.copyWithin(target, start[, end = this.length])
    pendingWorkerCount--
    results.push(event.data.result)
    if (pendingWorkerCount === 0) {
      postMessage({
        type: `ready`,
        result: results,
      })
    }
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

function handleInitialize (data) {
  function initializeExecuteWorker () {
    let worker = new ExecuteWorker()
    worker.onmessage = handleExecutionMessage
    return worker
  }
  workerCount = data.workerCount
  workers = Array.from({ length: workerCount }, (_, i) => initializeExecuteWorker(i))
}

function handleAverageArray (data) {
  const uint8Array = new Uint8Array(data.arrayBuffer)
  const length = uint8Array.length
  const subLength = length / workerCount
  workers.forEach((worker, workerIndex) => {
    let begin = Math.floor(subLength * workerIndex)
    let end = Math.floor(subLength * (workerIndex + 1))
    const detachableCopy = new Uint8Array(length)
    detachableCopy.set(uint8Array)
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
  })
}
