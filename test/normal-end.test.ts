import Abortable from '../src/'
import { test } from '@jacobbubu/interleavings'
import * as pull from '@jacobbubu/pull-stream'

describe('normal-end', () => {
  it('test', (done) => {
    test(
      function (async) {
        let times = 0
        const abortable = Abortable(function () {
          times += 1
        })
        pull(
          pull.values([1, 2, 3, 4, 5]),
          async.through('pre'),
          abortable,
          async.through('post'),
          pull.collect(function (_, results) {
            expect('results').toEqual([1, 2, 3, 4, 5])
            expect(times).toBeTruthy()
            async.done()
          })
        )
      },
      () => {
        done()
      }
    )
  })
})
