import 'subworkers'
import ExecuteWorker from './execute.worker.js'

const workers = []
let pendingWorkerCount = 0
const results = []

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
  return true
}

onmessage = (event) => {
  switch (event.data.type) {
  case `initialize`:
    workers.push(...createWorkers(event.data.workerCount))
    break
  case `averageArray`:
    handleAverageArray(event.data)
    break
  }
  return true
}

function createWorkers (workerCount) {
  function initializeExecuteWorker () {
    const worker = new ExecuteWorker()
    worker.onmessage = handleExecutionMessage
    return worker
  }
  return Array.from({ length: workerCount }, (_, i) => initializeExecuteWorker(i))
}

function handleAverageArray (data) {
  const uint8Array = new Uint8Array(data.arrayBuffer)
  const length = uint8Array.length
  const subLength = length / workers.length
  return workers
    .map((worker, index) => {
      pendingWorkerCount++
      return {
        type: `average`,
        begin: Math.floor(subLength * index),
        end: Math.floor(subLength * (index + 1)),
        arrayBuffer: cloneTypedArray(uint8Array).buffer,
      }
    })
    .map((message, index) => {
      return workers[index].postMessage(message, [message.arrayBuffer])
    })
}

function cloneTypedArray (typedArray) {
  const clone = new Uint8Array(typedArray.length)
  clone.set(typedArray)
  return clone
}
