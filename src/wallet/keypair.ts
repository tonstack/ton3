import { Bit } from '../boc/builder'
import {
    bytesToBits,
    hexToBits,
    hexToBytes,
    sliceIntoChunks
} from '../utils/helpers'
import {
    bip0039en,
    algo,
    nacl,
    pbkdf2,
    hash
} from '../utils/crypto'

const PBKDF2_ROUNDS = 2048

class KeyPair {
    public passphrase: string

    public mnemonic: string[]

    public privateKey: Uint8Array

    public publicKey: Uint8Array

    constructor (passphrase: string = '', mnemonic: string[] = []) {
        this.passphrase = passphrase
        this.mnemonic = KeyPair.mnemonicFromEntropy(KeyPair.getRandomEntropy()) || mnemonic
        this.privateKey = KeyPair.mnemonicToSeed(this.mnemonic, this.passphrase)
        this.publicKey = KeyPair.ed25519PubKeyFromSeed(this.privateKey)
    }

    public static deriveChecksumBits (entropy: Uint8Array): Bit[] {
        const CS = (entropy.length * 8) / 32
        const result = hash(entropy, 'sha256')

        return hexToBits(result).slice(0, CS)
    }

    public static getRandomEntropy (): Uint8Array {
        return nacl.randomBytes(32)
    }

    public static normalizeString (str: string): string {
        return (str || '').normalize('NFKD')
    }

    public static mnemonicFromEntropy (entropy: Uint8Array): string[] {
        const entropyBits: Bit[] = bytesToBits(entropy)
        const checkSumBits: Bit[] = KeyPair.deriveChecksumBits(entropy)
        const fullBits: Bit[] = entropyBits.concat(checkSumBits)
        const pieces = sliceIntoChunks(fullBits, 11)

        return pieces.map(chunk => bip0039en[ parseInt(chunk.join(''), 2) ])
    }

    public static mnemonicToSeed (mnemonic: string[], passphrase: string): Uint8Array {
        const mnemonicString = KeyPair.normalizeString(mnemonic.join(' '))
        const salt = `mnemonic${KeyPair.normalizeString(passphrase)}`
        const wordArray = {
            iterations: PBKDF2_ROUNDS,
            keySize: 512 / 32,
            hasher: algo.SHA512
        }

        const output = pbkdf2(mnemonicString, salt, wordArray)

        // first 32 seed bytes
        return hexToBytes(output.toString()).slice(0, 32)
    }

    public static ed25519PubKeyFromSeed (seed: Uint8Array): Uint8Array {
        return nacl.sign.keyPair.fromSeed(seed).publicKey
    }
}

export { KeyPair }
