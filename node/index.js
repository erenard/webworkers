const Worker = require(`webworker-threads`).Worker

const main = () => {
  const worker = new Worker(() => {
    this.onmessage = event => {
      console.log(event.data)
    }
  })
  worker.postMessage(`Hello world`)
  setTimeout(() => {
    worker.terminate()
  }, 100)
}

main()
