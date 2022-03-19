## 💎 tontools

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg?style=for-the-badge)](http://www.typescriptlang.org/)
[![TON](https://img.shields.io/badge/based%20on-The%20Open%20Network-blue?style=for-the-badge)](https://ton.org/)


Tontools-js is a javascript package inspired by [tonweb](https://github.com/toncenter/tonweb) to work with TON blockchain.\
Visit [documentation](https://github.com/tonstack/tontools-js/docs) to see API reference.
> :warning: Work in progress, API can (and most likely will) be changed! This is not production ready version yet.

## How to install
```
npm i @tonstack/tontools
```

## How to use
```ts
import { BoC } from '@tonstack/tontools'

const boc = new BoC()
const cell = boc.refs[0]

cell.bits.writeBits([ 1, 0, 1 ])

// ...

```

## Main authors

[tjifyodor](https://github.com/tjifyodor)\
[cryshado](https://github.com/cryshado)

## License

MIT License
