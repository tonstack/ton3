import { Address } from '../address'
import { Coins } from '../coins'
import {
    bitsToBytes,
    stringToBytes
} from '../utils/helpers'

type Bit = 0 | 1

class BitArray {
    private bits: Bit[]
    private size: number

    constructor (size: number = 1023) {
        this.bits = []
        this.size = size
    }

    /**
     * Total size of {@link BitArray} in bits (1023 bits max)
     *
     * @readonly
     * @type {number}
     */
    public get length(): number {
        return this.bits.length
    }

    /**
     * Free space left of {@link BitArray} in bits (1023 bits max)
     *
     * @readonly
     * @type {number}
     */
    public get remainder(): number {
        return this.size - this.length
    }

    public getBit (pointer: number): Bit {
        return this.bits[pointer]
    }

    public getBits (): Bit[] {
        return Array.from(this.bits)
    }

    public getBytes (): Uint8Array {
        return bitsToBytes(this.bits)
    }

    public writeBit (bit: Bit | number): BitArray {
        if (bit !== 0 && bit !== 1) {
            throw new Error('Can\'t write bit, because it\'s value doesn\'t equals 0 nor 1')
        }

        this.checkRemainder(1)
        this.bits.push(bit)

        return this
    }

    public writeBits (bits: Bit[]): BitArray {
        this.checkRemainder(bits.length)

        bits.forEach(this.writeBit.bind(this))

        return this
    }

    public writeInt (value: number | bigint, length: number): BitArray {
        const int = BigInt(value)
        const intBits = 1n << (BigInt(length) - 1n)

        if (int < -intBits || int >= intBits) {
            throw new Error('writeInt: integer overflow')
        }

        this.writeNumber(int, length)

        return this
    }

    public writeUint (value: number | bigint, length: number): BitArray {
        const uint = BigInt(value)

        if (uint < 0 || uint >= (1n << BigInt(length))) {
            throw new Error('writeUint: integer overflow')
        }

        this.writeNumber(uint, length)

        return this
    }

    private writeNumber (value: bigint, length: number): BitArray {
        const bits = [ ...Array(length) ]
            .map((_el, i) => Number(((value >> BigInt(i)) & 1n) === 1n) as Bit)
            .reverse()

        this.writeBits(bits)

        return this
    }

    public writeBytes (value: Uint8Array | number[]): BitArray {
        this.checkRemainder(value.length * 8)

        Uint8Array.from(value).forEach((byte: number) => this.writeUint(byte, 8))

        return this
    }

    public writeAddress (address: Address | null): BitArray {
        if (address === Address.NULL) {
            this.writeBits([ 0, 0 ])

            return this
        }

        const anycast = 0

        this.checkRemainder(2 + 1 + 8 + 256)
        this.writeBits([ 1, 0 ])
        this.writeUint(anycast, 1)
        this.writeInt(address.getWorkchain(), 8)
        this.writeBytes(address.getHash())

        return this
    }

    public writeCoins (value: Coins): BitArray {
        if (value.isNegative()) {
            throw new Error('Can\'t write negative Coins value')
        }

        if (value.isZero()) {
            this.writeUint(0, 4)

            return this
        }

        const length = Math.ceil((BigInt(value.toNano()).toString(16).length) / 2)
        const size = length * 8
        const nano = BigInt(value.toNano())

        this.checkRemainder(4 + size)
        this.writeUint(length, 4)
        this.writeUint(nano, size)

        return this
    }

    public writeFiftHex (value: string): BitArray {
        const data = this.fromFiftHex(value)

        this.append(data)

        return this
    }

    public writeString (value: string): BitArray {
        const bytes = stringToBytes(value)

        this.writeBytes(bytes)

        return this
    }

    public append (data: BitArray): BitArray {
        this.writeBits(data.getBits())

        return this
    }

    public clone (): BitArray {
        const data = new BitArray()

        data.append(this)

        return data
    }

    public toString (type: 'bits' | 'fift' | 'hex' = 'bits'): string {
        switch (type) {
            case 'fift':
                return this.toFiftHex()
            default:
                return this.bits.join('')
        }
    }

    private toFiftHex (): string {
        const isDivisible = this.bits.length % 4 === 0
        const bits = !isDivisible ? this.clone().augment(4).toString() : this.clone().toString()
        const hex = bits.match(/.{4}/g)
            .map(chunk => parseInt(chunk, 2).toString(16))
            .join('')

        return `${hex.toUpperCase()}${isDivisible ? '_' : ''}`
    }

    public fromFiftHex (fift: string): BitArray {
        const data = new BitArray()
        const bits = fift
            .split('')
            .map(el => (el === '_' ? el : (`000${parseInt(el, 16).toString(2)}`).slice(-4)))
            .join('')
            .replace(/1[0]*_$/, '')
            .split('')
            .map(parseInt)

        bits.forEach(data.writeBit.bind(this))

        return data
    }

    /**
     * Augment bits with 1 and leading 0 to be divisible by 8 or 4 without remainder
     * Mostly used for {@link BoC} serialization
     *
     * @param {(4 | 8)} [toModulo=8]
     * @return {this}
     */
    public augment (toModulo: 4 | 8 = 8): BitArray {
        const { length } = this.getBits()
        const amount = toModulo - (length % toModulo)
        const bits = [ ...Array(amount) ].map((_el, i) => (i === 0 ? 1 : 0))

        if (bits.length !== 0 && bits.length !== toModulo) {
            // Do not use .writeBits() because it won't overflow maximum of 1023 bits
            this.bits = this.bits.concat(bits)
        }

        return this
    }

    /**
     * Remove augmented bits from {@link BitArray.augment()} operation
     * Mostly used for {@link BoC} deserialization
     * 
     * @return {this}
     */
    public rollback (): BitArray {
        const index = this.bits.slice(-7).reverse().indexOf(1)

        if (index === -1) {
            throw new Error('Incorrectly augmented bits')
        }

        this.bits.splice(-(index + 1))

        return this
    }

    private checkRemainder (size: number): void {
        if (size > this.remainder) {
            throw new Error(`BitArray overflow. Can't add ${size} bits. Only ${this.remainder} bits left`)
        }
    }
}

export {
    BitArray,
    Bit
}
