import Abortable from '../src'
import { test } from '@jacobbubu/interleavings'
import * as pull from 'pull-stream'

describe('async2', () => {
  it('test', (done) => {
    test(
      function (async) {
        const abortable = Abortable()
        const o: number[] = []
        pull(
          pull.values([1, 2, 3, 4, 5]),
          async.through('pre'),
          abortable,
          async.through('post'),
          function (read: pull.Source<number>): pull.Source<number> {
            return function (abort, cb) {
              if (o.length < 3) {
                read(abort, function (end, data) {
                  o.push(data!)
                  cb(end, data)
                })
              } else {
                abortable.abort()
                async.wrap(function () {
                  read(abort, cb)
                })()
              }
            }
          },
          pull.drain(undefined, function (_) {
            expect(o).toEqual([1, 2, 3])
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
