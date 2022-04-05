import nacl from 'tweetnacl'
import { algo, PBKDF2 } from 'crypto-js'
import bip0039en from './bip-0039-en.json'
import {
    bytesToBits,
    hexToBytes,
    hexToBits
} from '../utils/helpers'
import { sha256 } from '../utils/hash'

interface KeyPair {
    private: Uint8Array
    public: Uint8Array
}

class Mnemonic {
    private _words: string[]

    private _seed: Uint8Array

    private _keys: KeyPair

    constructor (mnemonic: string[] = [], salt: string = null) {
        if (mnemonic.length && mnemonic.length !== 24) {
            throw new Error('Mnemonic: must contain 24 bip39 words.')
        }

        const words = mnemonic.length ? mnemonic : Mnemonic.genereteWords()
        const seed = Mnemonic.genereteSeed(words, salt)
        const sign = nacl.sign.keyPair.fromSeed(seed)
        const keys = {
            private: sign.secretKey,
            public: sign.publicKey
        }

        this._words = words
        this._seed = seed
        this._keys = keys
    }

    public get words (): string[] {
        return this._words
    }

    public get seed (): Uint8Array {
        return this._seed
    }

    public get keys (): KeyPair {
        return this._keys
    }

    private static deriveChecksumBits (entropy: Uint8Array): Bit[] {
        const CS = (entropy.length * 8) / 32
        const hex = sha256(entropy)
        const bits = hexToBits(hex)

        return bits.slice(0, CS)
    }

    private static normalize (str: string): string {
        return (str || '').normalize('NFKD')
    }

    private static genereteWords (): string[] {
        const entropy = nacl.randomBytes(32)
        const checkSumBits = Mnemonic.deriveChecksumBits(entropy)
        const entropyBits = bytesToBits(entropy)
        const fullBits = entropyBits.concat(checkSumBits)
        const chunks = fullBits.join('').match(/(.{1,11})/g)
        const words = chunks.map((chunk) => {
            const index = parseInt(chunk, 2)

            return bip0039en[index] as string
        })

        return words
    }

    private static genereteSeed (_mnemonic: string[], _salt: string): Uint8Array {
        const PBKDF2_ROUNDS = 2048 // according to bip39

        _mnemonic.forEach((word) => {
            if (!bip0039en.includes(word)) {
                throw new Error(`Mnemonic: invalid mnemonic phrase words: "${word}".`)
            }
        })

        const mnemonic = Mnemonic.normalize(_mnemonic.join(' '))
        const salt = _salt !== null
            ? `mnemonic${Mnemonic.normalize(_salt)}`
            : 'mnemonic'

        const wordArray = {
            iterations: PBKDF2_ROUNDS,
            keySize: 512 / 32,
            hasher: algo.SHA512
        }

        const hex = PBKDF2(mnemonic, salt, wordArray).toString()
        const bytes = hexToBytes(hex)

        // first 32 seed bytes
        return bytes.slice(0, 32)
    }
}

export {
    Mnemonic,
    KeyPair
}
