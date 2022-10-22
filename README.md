## 💎 ton3

[![npm](https://img.shields.io/npm/v/ton3)](https://www.npmjs.com/package/ton3) ![GitHub top language](https://img.shields.io/github/languages/top/tonstack/ton3) [![TON](https://img.shields.io/badge/based%20on-The%20Open%20Network-blue)](https://ton.org/)

ton3 is a javascript package inspired by [tonweb](https://github.com/toncenter/tonweb) to work with [TON blockchain](https://ton.org).\
> :warning: Work in progress, API can (and most likely will) be changed! This is not production ready version yet.

## How to install
```
npm i ton3
```

## Documentation
Visit [ton3-core](https://github.com/tonstack/ton3-core/docs/) to see API reference.

## Simple usage
```typescript
import { Providers, Mnemonic, Address, Coins, Builder, BOC } from 'ton3'
/* Alternatively you can use standalone packages
 * import { Mnemonic, Address, Coins, Builder, BOC } from 'ton3-core'
 * import { ProviderRESTV2 } from 'ton3-providers'
*/
import { Wallets } from 'ton3-contracts'

const highloadWalletExample = async () => {
    const endpoint = 'https://testnet.toncenter.com/api/v2'
    const apiKey = 'xxx'
    const provider = new Providers.ProviderRESTV2(endpoint, { apiKey })
    const client = await provider.client()

    const mnemonic = new Mnemonic()
    const highload = new Wallets.ContractHighloadWalletV2({ workchain: 0, publicKey: mnemonic.keys.public })

    console.log(mnemonic.words) // Get mnemonic phrase
    console.log(highload.address.toString()) // Get contract address

    // You need to deposit 1 ton to your contract address before deployment

    // Contract deployment
    const deploy = highload
        .createDeployMessage()
        .sign(mnemonic.keys.private)

    const { data: deployData } = await client.sendBoc(null, { boc: BOC.toBase64Standard(deploy) })

    console.log(deployData)

    // Create and send payments
    const transfers = Array(5).fill(null).reduce((acc, _el) => acc.concat({
        destination: new Address('xxx'),
        amount: new Coins('0.01'),
        body: new Builder().storeUint(0, 32).storeString('My message').cell(),
        mode: 3
    }), [])

    const payments = highload
        .createTransferMessage(transfers)
        .sign(mnemonic.keys.private)

    const { data: paymentsData } = await client.sendBoc(null, { boc: BOC.toBase64Standard(payments) })

    console.log(paymentsData)
}
```

## License

MIT License
