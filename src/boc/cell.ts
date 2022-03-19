import {
    Bit,
    BitArray
} from './bit-array'
import { Slice } from './slice'
import {
    bitsToHex,
    hexToBits
} from '../utils/helpers'
import {
    sha256,
    encoderHex
} from '../utils/crypto'

class Cell {
    public bits: BitArray

    public refs: Cell[]

    public isExotic: boolean

    constructor () {
        this.bits = new BitArray()
        this.refs = []
        this.isExotic = false
    }

    private getMaxLevel (): number {
        // TODO: level calculation differ for exotic cells

        return this.refs.reduce((acc, cell) => {
            const level = cell.getMaxLevel()

            return level > acc ? level : acc
        }, 0)
    }

    private getMaxDepth (): number {
        const maxDepth = this.refs.reduce((acc, cell) => {
            const depth = cell.getMaxDepth()

            return depth > acc ? depth : acc
        }, 0)

        return this.refs.length
            ? maxDepth + 1
            : maxDepth
    }

    concat (cell: Cell): void {
        this.bits.append(cell.bits)
        this.refs = [ ...this.refs, ...cell.refs ]
    }

    maxDepth (): Bit[] {
        const maxDepth = this.getMaxDepth()
        const value = Math.floor(maxDepth / 256) + (maxDepth % 256)
        const bits = value.toString(2).padStart(16, '0').split('').map(el => parseInt(el, 10)) as Bit[]

        return bits
    }

    refsDescriptor (): Bit[] {
        const refs = this.refs.length + Number(this.isExotic) + this.getMaxLevel() * 4
        const bits = refs.toString(2).padStart(8, '0').split('').map(el => parseInt(el, 10)) as Bit[]

        return bits
    }

    bitsDescriptor (): Bit[] {
        const { length } = this.bits.getBits()
        const cap = Math.ceil(length / 8) + Math.floor(length / 8)
        const bits = cap.toString(2).padStart(8, '0').split('').map(el => parseInt(el, 10)) as Bit[]

        return bits
    }

    toSlice (): Slice {
        return new Slice(this)
    }

    hash (): string {
        const refsDescriptor = this.refsDescriptor()
        const bitsDescriptor = this.bitsDescriptor()
        const augmentedBits = this.bits.clone().augment().getBits()
        let repr = [ ...refsDescriptor, ...bitsDescriptor, ...augmentedBits ]

        this.refs.forEach((ref) => {
            const depth = ref.maxDepth()

            repr = [ ...repr, ...depth ]
        })

        this.refs.forEach((ref) => {
            const hash = ref.hash()
            const bits = hexToBits(hash)

            repr = [ ...repr, ...bits ]
        })

        const hex = bitsToHex(repr)
        const hash = sha256(encoderHex.parse(hex))

        return hash.toString()
    }

    print (indent: string = ''): string {
        const output = [ `${indent}x{${this.bits.toString('fift')}}\n` ]

        this.refs.forEach(ref => output.push(ref.print(`${indent} `)))

        return output.join('')
    }
}

export { Cell }
