import Cluster from './cluster'
import worker from './execute.worker'

const length = 1024 * 1024 * 100
const uint8Array = new Uint8Array(
  Array.from({ length }, () => Math.random() * 20)
)

const cluster = Cluster(worker)

const partition = (maximum, partCount) => {
  const partSize = maximum / partCount
  return Array.from({ length: partCount }, (_, index) => {
    const begin = Math.round(index * partSize)
    const end = Math.round(Math.min(index * partSize + partSize, maximum))
    const size = end - begin
    return {
      begin,
      end,
      size,
    }
  })
}

const testPartition = size => {
  const result = partition(size, 3)
  const total = result.reduce((left, right) => {
    return { size: left.size + right.size }
  }, { size: 0 })
  if (size !== total.size) {
    throw size
  }
}

testPartition(31)
testPartition(32)
testPartition(33)
testPartition(34)
testPartition(35)
testPartition(36)

// 5ms
const cloneTypedArray = typedArray => {
  const typedArrayCopy = new Uint8Array(typedArray.length)
  typedArrayCopy.set(typedArray)
  return typedArrayCopy
}

const chunks = (typedArray, chunkCount) => {
  const ranges = partition(typedArray.length, chunkCount)
  return ranges.map(range => {
    const a = Date.now()
    const clone = cloneTypedArray(typedArray)
    console.log(`Clone time `, Date.now() - a)
    return {
      range,
      typedArray: clone,
    }
  })
}

const average = data => {
  return cluster({
    type: `averageArray`,
    begin: data.range.begin,
    end: data.range.end,
    arrayBuffer: data.typedArray.buffer,
  }, [data.typedArray.buffer])
}

const testPerformance = (nbCores) => {
  const start = window.performance.now()
  return Promise.all(chunks(uint8Array, nbCores).map(average)).then(averages => {
    const total = averages
      .map(event => event.data.result)
      .reduce((left, right) => {
        return left + right
      }, 0)
    return total / averages.length
  }).then(average => {
    console.log(`Average ${average} in `, window.performance.now() - start)
    console.log(`flush`)
    console.log(`flush`)
    console.log(`flush`)
  })
}
console.log(`start`)
const nbCores = 1
testPerformance(nbCores)
  .then(() => {
    testPerformance(nbCores)
      .then(() => {
        testPerformance(nbCores)
          .then(() => {
            testPerformance(nbCores)
              .then(() => {
                testPerformance(nbCores)
              })
          })
      })
  })
// 1: 3300
// 2: 1730
// 3: 1350
// 4: 1100
// 5: 1100
// 6: 1000
