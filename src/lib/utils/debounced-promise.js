let timer = null
let resolves = []

function debouncedPromise (func, timeout = 0, thisArg) {
  clearTimeout(timer)

  timer = setTimeout(() => {
    const result = func.call(thisArg)
    resolves.forEach(r => r(result))
    resolves = []
  }, timeout)

  return new Promise(resolve => resolves.push(resolve))
}

export default debouncedPromise
