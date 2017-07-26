
export function fetchStatusHandler (response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    let error = new Error(response.statusText || response.status)
    error.response = response
    return Promise.reject(error)
  }
}
