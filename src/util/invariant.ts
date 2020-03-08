export function invariant(condition: boolean, message: string) {
  if (!condition) {
    const error = new Error(message)
    error.name = 'Invariant Violation'
    throw error
  }
}
