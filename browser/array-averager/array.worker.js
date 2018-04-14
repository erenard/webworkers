onmessage = (event) => {
  const data = event.data
  switch (data.type) {
  case `average`:
    averageArray(data.begin, data.end, data.arrayBuffer)
    break
  }
}

function range (begin, end) {
  let nextValue = begin
  return {
    next: () => {
      return nextValue < end ?
        { value: nextValue++, done: false } :
        { done: true }
    },
  }
}

function * rangeGen (begin, end) {
  let nextValue = begin
  while (nextValue < end) {
    yield nextValue++
  }
}

for (let index of [...range(5, 10)]) {
  console.log(index)
}

const averageArray = function (begin, end, arrayBuffer) {
  let uint8Array = new Uint8Array(arrayBuffer)
  let sum = uint8Array.reduce((accumulator, uint8) => (accumulator + uint8), 0)
  console.log(sum)
  postMessage({ type: `done`, result: sum / uint8Array.length })
}