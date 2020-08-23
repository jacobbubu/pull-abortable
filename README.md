# @jacobbubu/pull-abortable

[![Build Status](https://github.com/jacobbubu/pull-abortable/workflows/Build%20and%20Release/badge.svg)](https://github.com/jacobbubu/pull-abortable/actions?query=workflow%3A%22Build+and+Release%22)
[![Coverage Status](https://coveralls.io/repos/github/jacobbubu/pull-abortable/badge.svg)](https://coveralls.io/github/jacobbubu/pull-abortable)
[![npm](https://img.shields.io/npm/v/@jacobbubu/pull-abortable.svg)](https://www.npmjs.com/package/@jacobbubu/pull-abortable/)

> Rewriting the [pull-abortable](https://github.com/dominictarr/pull-abortable) with TypeScript.

# pull-abortable

a pull-stream that may be aborted from the outside.

## why rewriting?

* Familiarity with the original author's intent
* Strong type declarations for colleagues to understand and migrate to other programming languages

## example

``` js
import * as pull from 'pull-stream'
import Abortable from '@jacobbubu/pull-abortable'

const abortable = Abortable()
pull(
  source,
  abortable,
  sink
)
//at any time you can abort the pipeline,
//the source will be cleaned up, and any
//error will be passed to the sink next time it reads.
atAnyTime(function () {
  abortable.abort()
})

// abort the stream and end with an error
abortable.abort(new Error('example'))
```

## License

MIT
