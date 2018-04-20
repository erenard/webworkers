import 'subworkers'
import Cluster from './cluster.js'

const length = 1024 * 1024
const uint8Array = new Uint8Array(
  Array.from({ length }, () => Math.random() * 20)
)
const worker = new Worker()

worker.onmessage = function(event) {
  if (event.data.type === `ready`) {
    console.log(`done`, event.data)
  }
}

worker.postMessage({
  type: `initialize`,
  workerCount: 30,
})

worker.postMessage(
  {
    type: `averageArray`,
    arrayBuffer: uint8Array.buffer,
  },
  [uint8Array.buffer]
)
