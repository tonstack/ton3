import { expect } from 'chai'
import { Mnemonic } from '../src/wallet'
import { BOC } from '../src/boc'
import { HighloadWalletV2Contract, WalletV3Contract } from '../src/contracts'
import { Address } from '../src/address'
import { Coins } from '../src/coins'

describe('Some', () => {
    it('transfer walletv3', () => {
        const access = new Mnemonic()

        access.setMnemonic([
            'amateur', 'force', 'share',
            'evil', 'switch', 'marine',
            'burden', 'bachelor', 'lumber',
            'vital', 'brick', 'tiny',
            'crop', 'mosquito', 'air',
            'expire', 'exercise', 'weasel',
            'void', 'spin', 'veteran',
            'jar', 'whale', 'rice'
        ])
        access.generate()

        const myWallet = new WalletV3Contract(0, 11, access.thisKeyPair)
        myWallet.addTransfers([
            {
                destination: new Address('EQBAtTjqPOsBvWPO_ij7xkLA11cjiXUKA3gRHVSbrYMEmWOF'),
                amount: new Coins(0.1),
                body: WalletV3Contract.simpleTextMsg('simpleTextMsg #1'),
                mode: 3
            },
            {
                destination: new Address('EQBAtTjqPOsBvWPO_ij7xkLA11cjiXUKA3gRHVSbrYMEmWOF'),
                amount: new Coins(0.11),
                body: WalletV3Contract.simpleTextMsg('simpleTextMsg #2'),
                mode: 3
            },
            {
                destination: new Address('EQBAtTjqPOsBvWPO_ij7xkLA11cjiXUKA3gRHVSbrYMEmWOF'),
                amount: new Coins(0.12),
                body: WalletV3Contract.simpleTextMsg('simpleTextMsg #3'),
                mode: 3
            },
            {
                destination: new Address('EQBAtTjqPOsBvWPO_ij7xkLA11cjiXUKA3gRHVSbrYMEmWOF'),
                amount: new Coins(0.13),
                body: WalletV3Contract.simpleTextMsg('simpleTextMsg #4'),
                mode: 3
            }
        ])

        console.log(`\n${BOC.toHexStandard(myWallet.sendTransfersExtMsg(1))}\n`)
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
