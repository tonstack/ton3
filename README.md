## 💎 tontools

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg?style=for-the-badge)](http://www.typescriptlang.org/)
[![TON](https://img.shields.io/badge/based%20on-The%20Open%20Network-blue?style=for-the-badge)](https://ton.org/)

Tontools-js is a javascript package inspired by [tonweb](https://github.com/toncenter/tonweb) to work with [TON blockchain](https://ton.org).\
Visit [documentation](./docs/) to see API reference.
> :warning: Work in progress, API can (and most likely will) be changed! This is not production ready version yet.

## How to install
```
npm i @tonstack/tontools
```

## How to use
```typescript
import { BOC, Builder } from '@tonstack/tontools'

const text = 'Hello, World!'
const cell = new Builder()
    .storeString(text)
    .cell()

const boc = BOC.toBytesStandard(cell)
const result = BOC.fromStandard(boc)
    .parse()
    .loadString()

console.log(text === result) // true
```

## Main authors

[tjifyodor](https://github.com/tjifyodor)\
[cryshado](https://github.com/cryshado)

## License

MIT License
