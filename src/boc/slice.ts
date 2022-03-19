import { Bit } from './bit-array'
import { Coins } from '../coins'
import { Address } from '../address'
import {
    bitsToBytes,
    bytesToString,
    bitsToHex
} from '../utils/helpers'
import type { Cell } from './cell'

class Slice {
    private bits: Bit[]

    private refs: Cell[]

    /**
     * Creates an instance of {@link Slice} from provided {@link Cell}
     * 
     * @param {Cell} cell
     * 
     * @example
     * ```ts
     * import { Cell, Slice } from '@tonstack/tontools'
     * 
     * const cell = new Cell()
     * const slice = new Slice(cell)
     * ```
     */
    constructor (cell: Cell) {
        this.bits = cell.bits.getBits()
        this.refs = Array.from(cell.refs)
    }

    /**
     * Skip bits from {@link Slice}
     * 
     * @param {number} size - Total bits should be skipped
     * 
     * @example
     * ```ts
     * import { Cell, Slice } from '@tonstack/tontools'
     * 
     * const cell = new Cell()
     * 
     * cell.bits.writeBits([ 0, 1, 1, 0 ])
     * 
     * const slice = cell.toSlice()
     * 
     * console.log(slice.skip(2).readBits(2)) // [ 1, 0 ]
     * ```
     * 
     * @return {this}
     */
    public skip (size: number): Slice {
        if (this.bits.length < size) {
            throw new Error('Slice skip overflow')
        }

        this.bits.splice(0, size)

        return this
    }

    /**
     * Read ref from {@link Slice}
     * 
     * @param {boolean} [splice=true] - Remove bits after reading
     * 
     * @example
     * ```ts
     * import { Cell, Slice } from '@tonstack/tontools'
     * 
     * const cell = new Cell()
     * const ref = new Cell()
     * 
     * cell.refs.push(ref)
     * 
     * const slice = cell.toSlice()
     * 
     * console.log(slice.readRef()) // Cell
     * ```
     * 
     * @return {Cell}
     */
    public readRef (splice: boolean = true): Cell {
        if (!this.refs.length) {
            throw new Error('Slice refs overflow')
        }

        return splice ? this.refs.shift() : this.refs[0]
    }

    /**
     * Read bit from {@link Slice}
     * 
     * @param {boolean} [splice=true] - Remove bits after reading
     * 
     * @example
     * ```ts
     * import { Cell, Slice } from '@tonstack/tontools'
     * 
     * const cell = new Cell()
     * 
     * cell.bits.writeBit(1)
     * 
     * const slice = cell.toSlice()
     * 
     * console.log(slice.readBit()) // 1
     * ```
     * 
     * @return {Bit[]}
     */
    public readBit (splice: boolean = true): Bit {
        if (!this.bits.length) {
            throw new Error('Slice bits overflow')
        }

        return splice ? this.bits.shift() : this.bits[0]
    }

    /**
     * Read bits from {@link Slice}
     * 
     * @param {number} size - Total bits should be readed to represent requested value
     * @param {boolean} [splice=true] - Remove bits after reading
     * 
     * @example
     * ```ts
     * import { Cell, Slice } from '@tonstack/tontools'
     * 
     * const cell = new Cell()
     * 
     * cell.bits.writeBits([ 0, 1 ])
     * 
     * const slice = cell.toSlice()
     * 
     * console.log(slice.readBits(2)) // [ 0, 1 ]
     * ```
     * 
     * @return {Bit[]}
     */
    public readBits (size: number, splice: boolean = true): Bit[] {
        if (size <= 0 || this.bits.length < size) {
            throw new Error('Slice bits overflow')
        }

        return splice ? this.bits.splice(0, size) : this.bits.slice(0, size)
    }

    /**
     * Read int from {@link Slice}
     * 
     * @param {number} size - Total bits should be readed to represent requested value
     * @param {boolean} [splice=true] - Remove bits after reading
     * 
     * @example
     * ```ts
     * import { Cell, Slice } from '@tonstack/tontools'
     * 
     * const cell = new Cell()
     * 
     * cell.bits.writeUint(-14, 15)
     * 
     * const slice = cell.toSlice()
     * 
     * console.log(slice.readUint(15)) // -14
     * ```
     * 
     * @return {number}
     */
    public readInt (size: number, splice: boolean = true): number {
        const uint = this.readUint(size, splice)
        const int = 1 << (size - 1)

        return uint >= int ? (uint - (int * 2)) : uint
    }

    /**
     * Read uint from {@link Slice}
     * 
     * @param {number} size - Total bits should be readed to represent requested value
     * @param {boolean} [splice=true] - Remove bits after reading
     * 
     * @example
     * ```ts
     * import { Cell, Slice } from '@tonstack/tontools'
     * 
     * const cell = new Cell()
     * 
     * cell.bits.writeUint(14, 9)
     * 
     * const slice = cell.toSlice()
     * 
     * console.log(slice.readUint(9)) // 14
     * ```
     * 
     * @return {number}
     */
    public readUint (size: number, splice: boolean = true): number {
        const bits = this.readBits(size, splice)

        return bits.reverse().reduce((acc, bit, i) => (bit * (2 ** i) + acc), 0)
    }

    /**
     * Read bytes from {@link Slice}
     * 
     * @param {boolean} [splice=true] - Remove bits after reading
     * 
     * @example
     * ```ts
     * import { Cell, Slice } from '@tonstack/tontools'
     * 
     * const cell = new Cell()
     * 
     * cell.bits.writeBytes(new Uint8Array([ 255, 255 ]))
     * 
     * const slice = cell.toSlice()
     * 
     * console.log(slice.readBytes(16)) // [ 255, 255 ]
     * ```
     * 
     * @return {Uint8Array}
     */
    public readBytes (size: number, splice: boolean = true): Uint8Array {
        const bits = this.readBits(size, splice)
        
        return bitsToBytes(bits)
    }

    /**
     * Read string from {@link Slice}
     * 
     * @param {number} [size=null] - Total bits should be readed to represent requested value
     * @param {boolean} [splice=true] - Remove bits after reading
     * 
     * @example
     * ```ts
     * import { Cell, Slice } from '@tonstack/tontools'
     * 
     * const cell = new Cell()
     * 
     * cell.bits.writeString('Привет, мир!')
     * 
     * const slice = cell.toSlice()
     * 
     * console.log(slice.readString()) // 'Привет, мир!'
     * ```
     * 
     * @return {string}
     */
    public readString (size: number = null, splice: boolean = true): string {
        const bytes = size === null
            ? this.readBytes(this.bits.length, splice)
            : this.readBytes(size, splice)

        return bytesToString(bytes)
    }

    /**
     * Read {@link Address} from {@link Slice}
     *
     * @param {boolean} [splice=true] - Remove bits after reading
     * 
     * @example
     * ```ts
     * import { Cell, Address, Slice } from '@tonstack/tontools'
     * 
     * const cell = new Cell()
     * const address = new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')
     * 
     * cell.bits.writeAddress(address)
     * 
     * const slice = cell.toSlice()
     * 
     * console.log(slice.readAddress().toString()) // 'kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny'
     * ```
     * 
     * @return {Address}
     */
    public readAddress (splice: boolean = true): Address | null {
        const FLAG_ADDRESS_NO = [ 0, 0 ]
        const FLAG_ADDRESS = [ 1, 0 ]
        const flag = this.readBits(2, false)

        if (flag.every((bit, i) => bit === FLAG_ADDRESS_NO[i])) {
            return splice
                ? this.skip(2) && Address.NULL
                : Address.NULL
        }

        if (flag.every((bit, i) => bit === FLAG_ADDRESS[i])) {
            // 2 bits flag, 1 bit anycast, 8 bits workchain, 256 bits address hash
            const size = 2 + 1 + 8 + 256
            const bits = this.readBits(size, false)
            // Splice 2 because we dont need flag bits
            // Anycast is currently unused
            const _anycast = bits.splice(2, 1)
            const workchain = bits.splice(2, 8)
            const hash = bits.splice(2, 256)
            const bytes = bitsToBytes(workchain.concat(hash))

            return splice
                ? this.skip(size) && new Address(bytes)
                : new Address(bytes)
        }

        throw new Error('Bad address flag bits')
    }

    /**
     * Read {@link Coins} from {@link Slice}
     *
     * @param {boolean} [splice=true] - Remove bits after reading
     * 
     * @example
     * ```ts
     * import { Cell, Coins, Slice } from '@tonstack/tontools'
     * 
     * const cell = new Cell()
     * const coins = new Coins('100')
     * 
     * cell.bits.writeCoins(coins)
     * 
     * const slice = cell.toSlice()
     * 
     * console.log(slice.readCoins().toString()) // '100'
     * ```
     * 
     * @return {Coins}
     */
    public readCoins (splice: boolean = true): Coins {
        const length = this.readUint(4, false)

        if (length === 0) {
            return splice
                ? this.skip(4) && new Coins(0)
                : new Coins(0)
        }

        const size = 4 + (length * 8)
        const bits = this.readBits(size, false)
        const hex = `0x${bitsToHex(bits.splice(4))}`

        return splice
            ? this.skip(size) && new Coins(hex, true)
            : new Coins(hex, true)
    }

    /**
     * Create new {@link Slice} from given {@link Cell}
     *
     * @static
     * @param {Cell} cell - Cell to get slice from
     * 
     * @example
     * ```ts
     * import { Cell, Slice } from '@tonstack/tontools'
     * 
     * const cell = new Cell()
     * const slice = Slice.from(cell)
     * ```
     * 
     * @return {Slice}
     */
    public static from (cell: Cell): Slice {
        return new Slice(cell)
    }
}

export { Slice }
