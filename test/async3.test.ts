import Abortable from '../src'
import { test } from '@jacobbubu/interleavings'
import * as pull from '@jacobbubu/pull-stream'

describe('async3', () => {
  it('test', (done) => {
    test(
      function (async) {
        const err = new Error('intentional')
        let i = 2

        const abortable = Abortable((_err) => {
          expect(_err).toBe(err)
          if (--i === 0) {
            async.done()
          }
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
                abortable.abort(err)
                async.wrap(function () {
                  o.push(data)
                  cb(err, data)
                })()
              } else {
                o.push(data)
                cb(null, data)
              }
            })()
          }),
          pull.drain(undefined, function (_err) {
            if (o.length === 3) {
              expect(o).toEqual([1, 2, 3])
            } else {
              expect(o).toEqual([1, 2])
            }
            expect(_err).toBe(err)
            if (--i === 0) {
              async.done()
            }
          })
        )
      },
      () => {
        done()
      }
    )
  })
})
