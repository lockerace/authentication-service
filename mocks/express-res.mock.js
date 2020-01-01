function getExpressResMock () {
  const resMock = jest.fn()

  resMock.status = jest.fn(() => resMock)
  resMock.jsonp = jest.fn(() => resMock)
  resMock.end = jest.fn(() => resMock)

  return resMock
}

module.exports = getExpressResMock
