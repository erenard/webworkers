
import { rangeArray } from '../fp-utils'

onmessage = (event) => {
  const data = event.data
  switch (data.type) {
  case `average`:
    averageArray(data.begin, data.end, data.arrayBuffer)
    break
  }
}

const averageArray = function (begin, end, arrayBuffer) {
  let uint8Array = new Uint8Array(arrayBuffer)
  let average = rangeArray(begin, end)
    .map(index => uint8Array[index])
    .reduce((previousValue, currentValue) => previousValue + currentValue)
    / uint8Array.length
  postMessage({ type: `done`, result: average })
}