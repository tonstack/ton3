import { expect } from 'chai'
import { Mnemonic } from '../src/crypto/mnemonic'
import { BOC, Builder } from '../src/boc'
import { HighloadWalletV2Contract } from '../src/contracts'
import { Address } from '../src/address'
import { Coins } from '../src/coins'

describe('Some', () => {
    it('transfer walletv3', () => {
        const words = [
            'maple', 'accident', 'hand',
            'own', 'range', 'turtle',
            'push', 'scene', 'very',
            'aisle', 'jelly', 'pride',
            'sorry', 'action', 'planet',
            'short', 'order', 'affair',
            'doll', 'between', 'enjoy',
            'arctic', 'muffin', 'thunder'
        ]
        const mnemonic = new Mnemonic(words)
        const myWallet = new HighloadWalletV2Contract(0, 30, mnemonic.keys)

        for (let i: number = 0; i < 1; i += 1) {
            myWallet.addTransfers([
                {
                    destination: new Address('EQBosFYEWK-JOuNOdsN-iUoTaKwS4G0hoNTUrhfndZYvXGf3'),
                    amount: new Coins(4.6),
                    body: new Builder().storeUint(0, 32).storeString(`${i}`).cell(),
                    mode: 3
                }
            ])
        }

        console.log(myWallet.address.toString('base64', { bounceable: true }))

        console.log(`\n${BOC.toHexStandard(myWallet.sendTransfersExtMsg(1000))}\n`)

        expect(1).to.equal(1)
    })

    // it('transfer', () => {
    //     const access = new Mnemonic()

    //     access.setMnemonic([
    //         'amateur', 'force', 'share',
    //         'evil', 'switch', 'marine',
    //         'burden', 'bachelor', 'lumber',
    //         'vital', 'brick', 'tiny',
    //         'crop', 'mosquito', 'air',
    //         'expire', 'exercise', 'weasel',
    //         'void', 'spin', 'veteran',
    //         'jar', 'whale', 'rice'
    //     ])
    //     access.generate()

    //     const myWallet = new HighloadWalletV2Contract(0, 0, access.thisKeyPair)

    //     myWallet.addTransfers([
    //         {
    //             destination: new Address('EQBAtTjqPOsBvWPO_ij7xkLA11cjiXUKA3gRHVSbrYMEmWOF'),
    //             comment: 'transfer #1',
    //             amount: new Coins('0.1'),
    //             mode: 3
    //         },
    //         {
    //             destination: new Address('EQAv_oUk_Ne5ezLJYzTk-TSwlHIIuvoLLn9hnPu7dDdfaOiJ'),
    //             comment: 'transfer #2',
    //             amount: new Coins('0.2'),
    //             mode: 3
    //         }
    //     ])

    //     const transferMsg = myWallet.sendTransfersExtMsg()
    //     console.log(`\n${BOC.toHexStandard(transferMsg)}\n`)

    //     expect(1).to.equal(1)
    // })
    // it('some test', () => {
    //     const access = new Mnemonic()

    //     access.setMnemonic([
    //         'amateur', 'force', 'share',
    //         'evil', 'switch', 'marine',
    //         'burden', 'bachelor', 'lumber',
    //         'vital', 'brick', 'tiny',
    //         'crop', 'mosquito', 'air',
    //         'expire', 'exercise', 'weasel',
    //         'void', 'spin', 'veteran',
    //         'jar', 'whale', 'rice'
    //     ])
    //     access.generate()

    //     const myWallet = new HighloadWalletV2Contract(0, 0, access.thisKeyPair)
    //     const deployMsg = myWallet.deployExtMsg()

    //     console.log(myWallet.address.toString('base64', true))
    //     myWallet.address.bounceable = true
    //     console.log(myWallet.address.toString('base64', true))

    //     console.log(`\n${BOC.toHexStandard(deployMsg)}\n`)

    //     expect(1).to.equal(1)
    // })
})
