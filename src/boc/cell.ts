import {
    Bit,
    Builder
} from './builder'
import { Slice } from './slice'
import {
    bitsToBytes,
    bitsToHex,
    hexToBits
} from '../utils/helpers'
import { hash } from '../utils/crypto'

class Cell {
    private _bits: Bit[]

    private _refs: Cell[]

    private _exotic: boolean

    constructor (bits: Bit[] = [], refs: Cell[] = [], exotic = false) {
        this._bits = bits
        this._refs = refs
        this._exotic = exotic
    }

    public get bits (): Bit[] {
        return Array.from(this._bits)
    }

    public get refs (): Cell[] {
        return Array.from(this._refs)
    }

    public get exotic (): boolean {
        return this._exotic
    }

    private get maxDepth (): Bit[] {
        const maxDepth = this.calculateMaxDepth()
        const value = Math.floor(maxDepth / 256) + (maxDepth % 256)
        const bits = value.toString(2).padStart(16, '0').split('').map(el => parseInt(el, 10)) as Bit[]

        return bits
    }

    private get refsDescriptor (): Bit[] {
        const refs = this._refs.length + (Number(this._exotic) * 8) + (this.calculateMaxLevel() * 32)
        const bits = refs.toString(2).padStart(8, '0').split('').map(el => parseInt(el, 10)) as Bit[]

        return bits
    }

    private get bitsDescriptor (): Bit[] {
        const cap = Math.ceil(this._bits.length / 8) + Math.floor(this._bits.length / 8)
        const bits = cap.toString(2).padStart(8, '0').split('').map(el => parseInt(el, 10)) as Bit[]

        return bits
    }

    private get representation (): Bit[] {
        let representation = [ ...this.descriptors, ...this.augmentedBits ]

        this._refs.forEach((ref) => {
            const depth = ref.maxDepth

            representation = [ ...representation, ...depth ]
        })

        this._refs.forEach((ref) => {
            const hash = ref.hash()
            const bits = hexToBits(hash)

            representation = [ ...representation, ...bits ]
        })

        return representation
    }

    private calculateMaxLevel (): number {
        // TODO: write code for exotic cells support
        if (!this.exotic) {
            return 0
        }

        return 0
    }

    private calculateMaxDepth (): number {
        const maxDepth = this._refs.reduce((acc, cell) => {
            const depth = cell.calculateMaxDepth()

            return depth > acc ? depth : acc
        }, 0)

        return this._refs.length
            ? maxDepth + 1
            : maxDepth
    }

    public get descriptors (): Bit[] {
        return [ ...this.refsDescriptor, ...this.bitsDescriptor ]
    }

    public get augmentedBits (): Bit[] {
        return Builder.augmentBits(this._bits)
    }

    public hash (): string {
        const bytes = bitsToBytes(this.representation)

        return hash(bytes, 'sha256')
    }

    public print (indent: string = ''): string {
        const bits = Array.from(this._bits)
        const areDivisible = bits.length % 4 === 0
        const augmented = !areDivisible ? Builder.augmentBits(bits, 4) : bits
        const fiftHex = `${bitsToHex(augmented).toUpperCase()}${!areDivisible ? '_' : ''}`
        const output = [ `${indent}x{${fiftHex}}\n` ]

        this._refs.forEach(ref => output.push(ref.print(`${indent} `)))

        return output.join('')
    }

    public parse (): Slice {
        // Use getters to get a copy of an arrays
        return new Slice(this.bits, this.refs)
    }
}

export { Cell }
