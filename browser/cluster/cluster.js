import Semaphore from './semaphore'

const maxWorkers = navigator && navigator.hardwareConcurrency || 4

const defaultHandler = async (worker, data, buffers) => {
  worker.postMessage(data, buffers)
  return await new Promise((resolve, reject) => {
    worker.onmessage = event => {
      resolve(event)
    }
    worker.onerror = event => {
      reject(event)
    }
  })
}

const Cluster = (
  Worker,
  handler = defaultHandler,
  max = maxWorkers
) => {
  const pool = []
  const semaphore = Semaphore(max)
  const useWorker = async (fn) => {
    const worker = pool.pop() || new Worker()
    try {
      return await fn(worker)
    } catch (e) {
      throw e
    } finally {
      pool.push(worker)
    }
  }
  return async (data, buffers) => await semaphore(() => {
    return useWorker(worker => handler(worker, data, buffers))
  })
}

export default Cluster
