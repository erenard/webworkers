console.log(`message-logger`)
import 'subworkers'
import Worker from './distribute.worker.js'

const worker = new Worker()
worker.postMessage({
  type: `initialize`,
  workerCount: 3,
})

worker.postMessage({
  type: `logMessages`,
  messages: [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`],
})

worker.onmessage = function(event) {
  if (event.data.type === `ready`) {
    console.log(`done`)
  }
}
