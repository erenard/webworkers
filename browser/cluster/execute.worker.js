//import { rangeMap } from '../fp-utils'

onmessage = (event) => {
  const data = event.data
  switch (data.type) {
  case `averageArray`:
    averageArray(data.begin, data.end, data.arrayBuffer)
    break
  }
}

const averageArrayFct = function (begin, end, arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer)
  const count = (end - begin)
  const t = Date.now()
  const subarray = Array.from({ length: end - begin }, (_, i) => uint8Array[i + begin])
  //.map(index => uint8Array[index])
  console.log(`Read array`, Date.now() - t)
  const b = Date.now()
  const average = subarray
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    / count
  console.log(`Array reduction`, Date.now() - b)
  postMessage({ type: `done`, result: average })
}

const averageAllArray = function (begin, end, arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer)
  const a = Date.now()
  const average = uint8Array
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    / uint8Array.length
  console.log(Date.now() - a)
  postMessage({ type: `done`, result: average })
}

const averageArray = function (begin, end, arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer)
  const a = Date.now()
  let accumulator = 0
  for (let index = begin; index < end; index++) {
    accumulator += uint8Array[index]
  }
  const average = accumulator / (end - begin)
  console.log(`Average time`, Date.now() - a)
  postMessage({ type: `done`, result: average })
}