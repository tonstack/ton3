## 💎 tontools

[![npm](https://img.shields.io/npm/v/@tonstack/tontools)](https://www.npmjs.com/package/@tonstack/tontools) ![GitHub top language](https://img.shields.io/github/languages/top/tonstack/tontools-js) [![TON](https://img.shields.io/badge/based%20on-The%20Open%20Network-blue)](https://ton.org/)

Tontools-js is a javascript package inspired by [tonweb](https://github.com/toncenter/tonweb) to work with [TON blockchain](https://ton.org).\
Visit [documentation](./docs/) to see API reference.
> :warning: Work in progress, API can (and most likely will) be changed! This is not production ready version yet.

## How to install
```
npm i @tonstack/tontools
```

## Simple usage
```typescript
import { Mnemonic, BOC, WalletV3Contract } from '@tonstack/tontools'

const access = new Mnemonic()
access.generate() // generate mnemonic/keypair

console.log(access.thisMnemonic) // print mnemonic

const wall = new WalletV3Contract(0, 0, access.thisKeyPair)

wall.address.bounceable = true
console.log(wall.address.toString('base64', true))

// print walletV3 deploy BOC in hexadecimal
console.log(`\n${BOC.toHexStandard(myWallet.deployExtMsg())}\n`)
```

## Features and status

| Feature                                     | Status  |
|---------------------------------------------|-------- |
| Builder, Cell, Slice                        | ✅      |
| Hashmap, HashmapE (de)serialization         | ✅      |
| Ordinary Bag of Cells (de)serialization     | ✅      |
| Mnemonic/keypair with bip39 + ed25519       | ✅      |
| Coins (class for ton, nanoton e.t.c.)       | ✅      |
| TON address manipulation                    | ✅      |
| Msg Templates (such as MessageX e.t.c.)     | ✅      |
| walletv3 and highload-wallet-v2 support     | ✅      |
| TL (de)serialization                        | ❌      |
| Connecting rust ADNL bindings               | ❌      |
| Old "tonweb" style mnemonic support         | ❌      |
| ~100% tests coverage                        | ❌      |
| Pre-release code review                     | ❌      |

## License

MIT License
