import { expect } from 'chai'
import { Mnemonic } from '../src/wallet'
import { BOC } from '../src/boc'
import { WalletContract } from '../src/contract'

describe('Some', () => {
    it('some test', () => {
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

        const myWallet = new WalletContract(0, 0, access.thisKeyPair)
        const deployMsg = myWallet.deployExtMsg()

        console.log(myWallet.address.toString('base64', true))
        myWallet.address.bounceable = true
        console.log(myWallet.address.toString('base64', true))

        console.log(`\n${BOC.toHexStandard(deployMsg)}\n`)

        expect(1).to.equal(1)
    })
})
