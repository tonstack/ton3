import { expect } from 'chai'
import { bytesToHex } from '../src/utils/helpers'
import { Mnemonic } from '../src/wallet'

describe('Mnemonic', () => {
    it('Mnemonic simple generation', () => {
        const myKey = new Mnemonic()
        myKey.setPassphrase('aboba228')
        myKey.generate()

        console.log(myKey.thisMnemonic)
        console.log()
        console.log(`publicKey:       ${bytesToHex(myKey.thisKeyPair.publicKey)}`)
        console.log()
        console.log(`privateKey.full: ${bytesToHex(myKey.thisKeyPair.privateKey.full)}`)
        console.log(`privateKey.seed: ${bytesToHex(myKey.thisKeyPair.privateKey.seed)}`)

        expect(1).to.equal(1)
    })
})
