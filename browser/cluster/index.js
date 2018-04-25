import 'subworkers'
import Cluster from './cluster'
import worker from './execute.worker'

const length = 1024 * 1024
const uint8Array = new Uint8Array(
  Array.from({ length }, () => Math.random() * 20)
)

const cluster = Cluster(worker)

cluster({
  type: `averageArray`,
  begin: 0,
  end: length,
  arrayBuffer: uint8Array.buffer,
}, [uint8Array.buffer])
  .then(event => {
    console.log(`Done`, event.data)
  })
