const { onlyAuthenticated } = require('../auth-check')

describe('Auth Check middlewares', () => {
  describe('onlyAuthenticated', () => {
    describe('When get request without a valid user', () => {
      it('should response error to user', () => {
        const resMock = jest.fn()
        const nextMock = jest.fn()

        resMock.status = jest.fn(() => resMock)
        resMock.jsonp = jest.fn(() => resMock)
        resMock.end = jest.fn(() => resMock)

        onlyAuthenticated({}, resMock, nextMock)

        expect(resMock.status).toBeCalledWith(401)
        expect(resMock.jsonp).toBeCalledWith({ message: 'you are not authorized' })
        expect(resMock.end).toBeCalled()
      })
    })
  })
})
