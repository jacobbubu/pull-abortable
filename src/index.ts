import * as pull from '@jacobbubu/pull-stream'

function noop() {
  /* noop */
}

export type OnEnd = (err: pull.EndOrError) => void

export default function abortable<T>(onEnd?: OnEnd) {
  let aborted: pull.EndOrError = false
  let ended: pull.EndOrError = false

  let rawRead: pull.Source<T>

  const cbs: pull.SourceCallback<T>[] = []
  let buffer: T[] = []

  function doEnd() {
    if (!onEnd) return
    if (aborted && aborted !== true) return onEnd(aborted)
    if (ended && ended !== true) return onEnd(ended)
    return onEnd(null)
  }

  function cancel() {
    ended = ended || true
    doEnd()
    endDrain(aborted || ended)
    if (rawRead) {
      rawRead(aborted, function (err) {
        endDrain(err || aborted)
      })
    }
  }

  function drain() {
    while (buffer.length > 0) {
      const cb = cbs.shift()
      if (cb) {
        cb(null, buffer.shift()!)
      } else {
        break
      }
    }
    return cbs.length === 0
  }

  function endDrain(ended: pull.EndOrError) {
    buffer = []
    while (cbs.length > 0) {
      const cb = cbs.shift()!
      cb(ended)
    }
  }

  function reader(read: pull.Source<T>): pull.Source<T> {
    rawRead = read
    return function (abort, cb) {
      if (abort) {
        aborted = abort
      }

      cbs.push(cb)
      if (aborted) return endDrain(aborted)
      if (drain()) return

      // buffered data cannot meet the requirements
      rawRead(null, (endOrError, data) => {
        if (endOrError) {
          ended = aborted || endOrError
          drain()
          doEnd()
          endDrain(ended)
          return
        }
        buffer.push(data!)
        drain()
      })
    }
  }

  reader.abort = function (err?: pull.Abort) {
    if (ended) return
    aborted = err || true
    cancel()
  }

  return reader
}
