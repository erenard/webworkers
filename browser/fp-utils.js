export function rangeArray (begin, end) {
  return Array.from({ length: end - begin }, (_, i) => i + begin)
}
