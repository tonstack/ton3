import nacl from 'tweetnacl'
import sha256 from 'crypto-js/sha256'
import sha512 from 'crypto-js/sha512'
import pbkdf2 from 'crypto-js/pbkdf2'
import { algo } from 'crypto-js'
import encoderHex from 'crypto-js/enc-hex'
import * as bip0039en from './bip-0039-en.json'

const crc16 = (data: Uint8Array | number[]): number => {
    const POLY = 0x1021
    const bytes = new Uint8Array(data)
    const result = bytes.reduce((crc, el) => {
        crc = crc ^ (el << 8)

        new Array(8).fill(0).forEach(() => {
            crc = (crc & 0x8000) === 0x8000
                ? (crc << 1) ^ POLY
                : crc << 1
        })

        return crc
    }, 0)

    return (result & 0xffff)
}

// crc16 bytes in big-endian order
const crc16BytesBe = (data: Uint8Array | number[]): Uint8Array => {
    const crc = crc16(data)
    const buffer = new ArrayBuffer(2)
    const view = new DataView(buffer)

    view.setUint16(0, crc, false)

    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength)
}

const crc32c = (data: Uint8Array | number[]): number => {
    const POLY = 0x82f63b78
    const bytes = new Uint8Array(data)
    const result = [ ...Array(bytes.length) ].reduce((crc, _el, i) => {
        crc = i === 0 ? 0xffffffff ^ bytes[i] : crc ^ bytes[i]

        new Array(8).fill(0).forEach(() => {
            crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1
        })

        return crc
    }, 0)

    return result ^ 0xffffffff
}

// crc32c bytes in little-endian order
const crc32cBytesLe = (data: Uint8Array | number[]): Uint8Array => {
    const crc = crc32c(data)
    const buffer = new ArrayBuffer(4)
    const view = new DataView(buffer)

    view.setUint32(0, crc, true)

    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength)
}

export {
    nacl,
    algo,
    sha256,
    sha512,
    pbkdf2,
    crc16BytesBe,
    crc32cBytesLe,
    encoderHex,
    bip0039en
}
