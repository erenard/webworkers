export function rangeArray (begin, end) {
  return Array.from({ length: end - begin }, (_, i) => i + begin)
}

export const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

export const pipe = (...functions) => data =>
  functions.reduce((value, func) => func(value), data)

