import {
    SHA256,
    SHA512,
    enc
} from 'crypto-js'
import { bytesToHex } from './helpers'

const sha256 = (bytes: Uint8Array): string => {
    const hex = bytesToHex(bytes)
    const words = enc.Hex.parse(hex)

    return SHA256(words).toString()
}

const sha512 = (bytes: Uint8Array): string => {
    const hex = bytesToHex(bytes)
    const words = enc.Hex.parse(hex)

    return SHA512(words).toString()
}

export {
    sha256,
    sha512
}
