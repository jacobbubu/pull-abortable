import Abortable from '../src/'

describe('pre-abort', () => {
  it('test', (done) => {
    const _err = new Error('test error')
    let ended
    const a = Abortable(function (err) {
      expect(err).toBe(_err)
      ended = true
      done()
    })

    a.abort(_err)
  })
})
