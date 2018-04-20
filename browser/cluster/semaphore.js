function Semaphore (max) {
  const tasks = []
  let counter = max

  const dispatch = () => {
    if (counter > 0 && tasks.length > 0) {
      counter--
      tasks.shift()()
    }
  }

  const release = () => {
    counter++
    dispatch()
    return counter
  }

  const acquire = () => {
    return new Promise (resolve => {
      tasks.push(resolve)
      return setTimeout(dispatch, 0)
    })
  }

  return async fn => {
    await acquire()
    try {
      return await fn()
    } catch (e) {
      throw e
    } finally {
      release()
    }
  }
}

export default Semaphore
