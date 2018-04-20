import Semaphore from './semaphore'

const maxWorkers = navigator && navigator.hardwareConcurrency || 4
const defaultHandler = async (worker, data) => {
  worker.postMessage(data)
  return await once(`message`)
}

const Cluster = (
  path,
  handler = defaultHandler,
  max = maxWorkers
) => {
  const pool = []
  const semaphore = Semaphore(max)
  const useWorker = async (fn) => {
    const worker = pool.pop() || new Worker(path)
    try {
      return await fn(worker)
    } catch (e) {
      throw e
    } finally {
      pool.push(worker)
    }
  }
  return async (data) => await semaphore(() => {
    useWorker(worker => handler(worker, data))
  })
}

export default Cluster
