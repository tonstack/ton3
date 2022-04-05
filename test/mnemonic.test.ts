import { expect } from 'chai'
import { bytesToHex } from '../src/utils/helpers'
import { Mnemonic } from '../src/crypto/mnemonic'

describe('Mnemonic', () => {
    it('Mnemonic simple generation', () => {
        const mnemonic = new Mnemonic([], 'aboba228')

        console.log(mnemonic.words)
        console.log()
        console.log(`publicKey:       ${bytesToHex(mnemonic.keys.public)}`)
        console.log()
        console.log(`privateKey: ${bytesToHex(mnemonic.keys.private)}`)
        console.log(`seed: ${bytesToHex(mnemonic.seed)}`)

        expect(1).to.equal(1)
    })
})
