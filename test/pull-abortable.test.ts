import Abortable from '../src/'
import { test } from '@jacobbubu/interleavings'
import * as pull from '@jacobbubu/pull-stream'

describe('basic', () => {
  it('test', (done) => {
    test(
      function (async) {
        let ended = false
        const abortable = Abortable(function () {
          ended = true
        })
        const o: number[] = []

        pull(
          pull.values([1, 2, 3, 4, 5]),
          async.through('pre'),
          abortable,
          async.through('post'),
          pull.asyncMap(function (data: number, cb) {
            async.wrap(function () {
              if (data === 3) {
                abortable.abort()
              }
              o.push(data)
              cb(null, data)
            })()
          }),
          pull.drain(undefined, function (_) {
            if (o.length === 3) {
              expect(o).toEqual([1, 2, 3])
            } else {
              expect(o).toEqual([1, 2])
            }

            expect(ended).toBeTruthy()
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
