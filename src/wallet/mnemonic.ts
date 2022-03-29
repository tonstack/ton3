import { Bit } from '../boc/builder'
import {
    bytesToBits,
    hexToBytes,
    hexToBits,
    sliceIntoChunks
} from '../utils/helpers'
import {
    bip0039en,
    hash,
    algo,
    nacl,
    pbkdf2
} from '../utils/crypto'

const PBKDF2_ROUNDS = 2048 // according to bip39

interface PrivateKeyStruct {
    seed: Uint8Array // seed only
    full: Uint8Array // nacl private key format
}

interface KeyPairStruct {
    privateKey: PrivateKeyStruct
    publicKey: Uint8Array
}

const MnemonicErrors = {
    setPassphrase: new Error("can't set passphrase in inted Mnemonic"),
    setMnemonic: new Error("can't set mnemonic in inted Mnemonic")
}

class Mnemonic {
    private passphrase: string

    private mnemonic: string[]

    private entropy: Uint8Array | null

    private keyPair: KeyPairStruct | null

    constructor () {
        this.passphrase = ''
        this.mnemonic = []
        this.entropy = null
        this.keyPair = null
    }

    public get thisPassphrase (): string {
        return this.passphrase
    }

    public get thisMnemonic (): string[] {
        return this.mnemonic
    }

    public get thisEntropy (): Uint8Array | null {
        return this.entropy
    }

    public get thisKeyPair (): KeyPairStruct | null {
        return this.keyPair
    }

    public isInit (): boolean {
        return (
            this.passphrase !== ''
            && this.mnemonic !== []
            && this.keyPair !== null
            && this.entropy !== null
        )
    }

    public clear (): void {
        this.passphrase = ''
        this.mnemonic = []
        this.entropy = null
        this.keyPair = null
    }

    public setPassphrase (passphrase: string): void {
        if (!this.isInit()) {
            this.passphrase = passphrase
        } else {
            throw MnemonicErrors.setPassphrase
        }
    }

    public setMnemonic (mnemonic: string[]): void {
        if (!this.isInit()) {
            this.mnemonic = mnemonic
        } else {
            throw MnemonicErrors.setMnemonic
        }
    }

    private static deriveChecksumBits (entropy: Uint8Array): Bit[] {
        const CS = (entropy.length * 8) / 32
        const hex = hash(entropy, 'sha256')
        const bits = hexToBits(hex)

        return bits.slice(0, CS)
    }

    private setRandomEntropy () {
        this.entropy = nacl.randomBytes(32)
    }

    private static normalizeString (str: string): string {
        return (str || '').normalize('NFKD')
    }

    private static mnemonicFromEntropy (entropy: Uint8Array): string[] {
        const entropyBits: Bit[] = bytesToBits(entropy)
        const checkSumBits: Bit[] = Mnemonic.deriveChecksumBits(entropy)
        const fullBits: Bit[] = entropyBits.concat(checkSumBits)
        const pieces = sliceIntoChunks(fullBits, 11)

        return pieces.map(chunk => bip0039en[parseInt(chunk.join(''), 2)])
    }

    private static mnemonicToSeed (mnemonic: string[], passphrase: string): Uint8Array {
        const mnemonicString = Mnemonic.normalizeString(mnemonic.join(' '))
        const salt = `mnemonic${Mnemonic.normalizeString(passphrase)}`
        const wordArray = {
            iterations: PBKDF2_ROUNDS,
            keySize: 512 / 32,
            hasher: algo.SHA512
        }

        const output = pbkdf2(mnemonicString, salt, wordArray)

        // first 32 seed bytes
        return hexToBytes(output.toString()).slice(0, 32)
    }

    private static ed25519FromSeed (seed: Uint8Array): nacl.SignKeyPair {
        return nacl.sign.keyPair.fromSeed(seed)
    }

    public generate (): void {
        if (this.mnemonic.length === 0) {
            this.setRandomEntropy()
            this.mnemonic = Mnemonic.mnemonicFromEntropy(this.entropy)
        }

        const newseed = Mnemonic.mnemonicToSeed(this.mnemonic, this.passphrase)
        const signKeyPair = Mnemonic.ed25519FromSeed(newseed)

        this.keyPair = {
            privateKey: {
                seed: newseed,
                full: signKeyPair.secretKey
            },
            publicKey: signKeyPair.publicKey
        }
    }
}

export {
    // classes
    Mnemonic,

    // structs (interfaces)
    KeyPairStruct,
    PrivateKeyStruct,

    // error objects
    MnemonicErrors
}
