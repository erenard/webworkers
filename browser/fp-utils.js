export function rangeArray (begin, end) {
  const a = Date.now()
  const result = Array.from({ length: end - begin }, (_, i) => i + begin)
  console.log(`rangeArray ` + (Date.now() - a))
  return result
}

export function rangeGenerator (begin, end) {
  return {
    "value": end,
    "next" () {
      return rangeGenerator(end > begin ? end - 1 : begin)
    },
  }
}

export function rangeMap (begin, end, func) {
  return Array.from({ length: end - begin }, (_, i) => func(i + begin))
}

export const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

export const pipe = (...functions) => data =>
  functions.reduce((value, func) => func(value), data)

