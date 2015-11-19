# list-broken-requires

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A command-line tool to find broken `require` and `import` paths in a source directory. For example, when you are requiring a file which has been moved or deleted.

For example, if you have a `src` folder with the following `indx.js`

```js
// points to a file that does not exist
const a = require('./some/broken/path.js')

// also looks for ES6 imports
import './another/broken/path.js'

// a valid file
import './does-exist.js'
```

Now, we can run the tool on our `src` directory:

```sh
list-broken-requires src
```

Output:

```sh
/path/to/src/index.js
  './some/broken/path.js'  
  './another/broken/path.js'

Broken requires: 2
```

## Install

```sh
npm install -g list-broken-requires
```

## Usage

#### CLI

```
Usage:
  list-broken-requires [dir]
```

Where `dir` defaults to the current working directory.

## See Also

- [dependency-check](https://www.npmjs.com/package/dependency-check)

## License

MIT, see [LICENSE.md](http://github.com/Jam3/list-broken-requires/blob/master/LICENSE.md) for details.
