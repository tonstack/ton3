import { TextEncoder, TextDecoder } from 'util'
import { Bit } from '../boc/builder'

const isNodeEnv = typeof process === 'object' && process.title === 'node'

const uint8toInt8 = (uint8: number): number => {
    return uint8 << 24 >> 24
}

const int8ToUint8 = (int8: number): number => {
    const int = 1 << 7

    return int8 >= int ? (int8 - (int * 2)) : int8
}

const uintToHex = (uint: number): string => {
    const hex = `0${uint.toString(16)}`

    return hex.slice(-(Math.floor(hex.length / 2) * 2))
}

const hexToBits = (hex: string): Bit[] => hex.split('')
    .reduce((acc, val) => {
        const chunk = parseInt(val, 16)
            .toString(2)
            .padStart(4, '0')
            .split('')
            .map(bit => Number(bit))

        return acc.concat(chunk)
    }, [])

const hexToBytes = (hex: string): Uint8Array => new Uint8Array(hex.match(/.{1,2}/g)
    .map(byte => parseInt(byte, 16)))

const bitsToHex = (bits: Bit[]): string => {
    const bitstring = bits.join('')
    const hex = (bitstring.match(/.{1,4}/g) || []).map(el => parseInt(el.padStart(4, '0'), 2).toString(16))

    return hex.join('')
}

const bitsToInt8 = (bits: Bit[]): number => {
    return uint8toInt8(bytesToUint(bitsToBytes(bits)))
}

const bitsToBytes = (bits: Bit[]): Uint8Array => {
    if (bits.length === 0) {
        return new Uint8Array()
    }

    return hexToBytes(bitsToHex(bits))
}

const bytesToUint = (bytes: Uint8Array | number[]): number => {
    /* eslint-disable no-param-reassign */
    const data = Array.from(bytes)
    const uint = data.reduce<number>((acc, _el, i) => {
        acc *= 256
        acc += bytes[i]

        return acc
    }, 0)
    /* eslint-enable no-param-reassign */

    return uint
}

const bytesCompare = (a: Uint8Array | number[], b: Uint8Array | number[]): boolean => {
    if (a.length !== b.length) {
        return false
    }

    return Array.from(a).every((uint, i) => uint === b[i])
}

const bytesToBits = (data: Uint8Array | number[]): Bit[] => {
    const bytes = new Uint8Array(data)

    return bytes.reduce<Bit[]>((acc, uint) => {
        const chunk = uint.toString(2)
            .padStart(8, '0')
            .split('')
            .map(bit => Number(bit) as Bit)
    
        return acc.concat(chunk)
    }, [])
}

const bytesToHex = (bytes: Uint8Array): string => bytes.reduce((acc, uint) => `${acc}${uintToHex(uint)}`, '')

const bytesToString = (bytes: Uint8Array): string => {
    const decoder = new TextDecoder()

    return decoder.decode(bytes)
}

const stringToBytes = (value: string): Uint8Array => {
    const encoder = new TextEncoder()

    return encoder.encode(value)
}

const bytesToBase64 = (data: Uint8Array | number[]): string => {
    const bytes = Array.from(data)
    const str = String.fromCharCode(...bytes)

    return isNodeEnv
        ? Buffer.from(bytes).toString('base64')
        : btoa(str)
}

const base64ToBytes = (base64: string): Uint8Array => {
    const binary = isNodeEnv
        ? Buffer.from(base64, 'base64').toString('binary')
        : atob(base64)

    return Uint8Array.from(binary, char => char.charCodeAt(0))
}

const sliceIntoChunks = (arr: any[], chunkSize: number): any[] => {
    const res = []

    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize)
        res.push(chunk)
    }

    return res
}

export {
    uint8toInt8,
    int8ToUint8,
    uintToHex,
    hexToBits,
    hexToBytes,
    bitsToHex,
    bitsToInt8,
    bitsToBytes,
    bytesToUint,
    bytesCompare,
    bytesToBits,
    bytesToHex,
    sliceIntoChunks,
    stringToBytes,
    bytesToString,
    base64ToBytes,
    bytesToBase64
}
