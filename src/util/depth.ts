const MAXIMUM_TRAVERSE_DEPTH = 10000

export function createDepthGuard() {
  let depth = 0
  return function tick() {
    depth++
    if (depth > MAXIMUM_TRAVERSE_DEPTH) {
      throw new Error('Maximum depth exceeded')
    }
  }
}
