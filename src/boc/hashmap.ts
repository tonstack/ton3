import {
    Bit,
    Builder
} from './builder'
import { Cell } from './cell'

interface HashmapOptions<K, V> {
    keySize?: number | 'auto'
    prefixed?: boolean | 'auto'
    nonEmpty?: boolean
    serializers?: {
        key: (key: K) => Bit[]
        value: (value: V) => Cell
    }
    deserializers?: {
        key: (key: Bit[]) => K
        value: (value: Cell) => V
    }
}

type HashmapNode = [ key: Bit[], value: Cell ]

class Hashmap<K = Bit[], V = Cell> {
    private hashmap: Map<string, Cell>

    private keySize: number | 'auto'

    private prefixed: boolean | 'auto'

    private nonEmpty: boolean

    private serializeKey: (key: K) => Bit[]

    private serializeValue: (value: V) => Cell

    private deserializeKey: (key: Bit[]) => K

    private deserializeValue: (value: Cell) => V

    constructor (options?: HashmapOptions<K, V>) {
        const {
            keySize = 'auto',
            prefixed = 'auto',
            nonEmpty = false,
            serializers = { key: (key: K) => key, value: (value: V) => value },
            deserializers = { key: (key: Bit[]) => key, value: (value: Cell) => value }
        } = options || {}

        this.hashmap = new Map<string, Cell>()
        this.keySize = keySize
        this.prefixed = prefixed
        this.nonEmpty = nonEmpty
        this.serializeKey = serializers.key as (key: K) => Bit[]
        this.serializeValue = serializers.value as (value: V) => Cell
        this.deserializeKey = deserializers.key as (key: Bit[]) => K
        this.deserializeValue = deserializers.value as (value: Cell) => V
    }

    public* [Symbol.iterator] (): IterableIterator<[ K, V ]> {
        for (const [ k, v ] of this.hashmap) {
            const key = this.deserializeKey(k.split('').map(b => Number(b) as Bit))
            const value = this.deserializeValue(v)

            yield [ key, value]
        }
    }

    private serialize (): Cell {
        const { sorted, prefixed } = this.serializeRoots()
        const result = new Builder()

        if (this.nonEmpty && sorted.length === 0) {
            throw new Error('Hashmap: non-empty hashmap must contain 1 or more elements.')
        }

        if (!this.nonEmpty) {
            result.storeBit(sorted.length > 0 ? 1 : 0)
        }

        // Is an empty Hashmap
        if (!this.nonEmpty && sorted.length === 0) {
            return result.cell()
        }

        return this.serializeEdge(sorted)
    }

    private serializeRoots (): { sorted: HashmapNode[], prefixed: boolean } {
        const {
            sorted,
            keySizeMin,
            keySizeMax,
            valueSizeMax,
            valueHasRefs
        } = [ ...this.hashmap ].reduce((acc, [ bitstring, value ]) => {
            const key = bitstring.split('').map(b => Number(b) as Bit)
            const keyLength = key.length
            const valueLength = value.bits.length
            const valueHasRefs = value.refs.length !== 0
            // Sort keys by DESC to serialize labels correctly later
            const order = parseInt(bitstring, 2)
            const lt = acc.sorted.findIndex((el) => order > el.order)
            const index = lt > -1 ? lt : acc.sorted.length

            acc.sorted.splice(index, 0, { order, key, value })
            acc.keySizeMin = keyLength < acc.keySizeMin ? keyLength : acc.keySizeMin
            acc.keySizeMax = keyLength > acc.keySizeMax ? keyLength : acc.keySizeMax
            acc.valueSizeMax = valueLength > acc.valueSizeMax ? valueLength : acc.valueSizeMax
            acc.valueHasRefs = !acc.valueHasRefs ? valueHasRefs : acc.valueHasRefs

            return acc
        }, {
            sorted: [] as { order: number, key: Bit[], value: Cell }[],
            keySizeMin: 1023,
            keySizeMax: 0,
            valueSizeMax: 0,
            valueHasRefs: false
        })

        const isPrefixHashmapType = valueHasRefs
            || keySizeMin !== keySizeMax
            || (keySizeMax + valueSizeMax) > 1023

        if (this.keySize !== 'auto' && keySizeMin !== keySizeMax) {
            throw new Error(`Hashmap: keys size must be fixed length of ${this.keySize}.`)
        }

        if (this.keySize !== 'auto' && (keySizeMin !== this.keySize || keySizeMax !== this.keySize)) {
            throw new Error(`Hashmap: keys size must be fixed length of ${this.keySize}.`)
        }

        if (this.prefixed === false && isPrefixHashmapType) {
            throw new Error(`Hashmap: provided keys and values can fit only in prefixed hashmap.`)
        }

        return {
            sorted: sorted.map(el => [ el.key, el.value ]),
            prefixed: this.prefixed === 'auto' ? isPrefixHashmapType : this.prefixed
        }
    }

    private serializeEdge (nodes: HashmapNode[]): Cell {
        // hme_empty$0
        if (!nodes.length) {
            return new Builder()
                .storeBit(0)
                .cell()
        }

        const edge = new Builder()
        const label = this.serializeLabel(nodes)

        edge.storeBits(label)

        // hmn_leaf#_
        if (nodes.length === 1) {
            const leaf = this.serializeLeaf(nodes[0])

            edge.storeSlice(leaf.parse())
        }

        // hmn_fork#_
        if (nodes.length > 1) {
            // Left edge can be empty, anyway we need to create hme_empty$0 to support right one
            const [ leftNodes, rightNodes ] = this.serializeFork(nodes)
            const leftEdge = this.serializeEdge(leftNodes)

            edge.storeRef(leftEdge)

            if (rightNodes.length) {
                const rightEdge = this.serializeEdge(rightNodes)

                edge.storeRef(rightEdge)
            }
        }

        return edge.cell()
    }

    private serializeFork (nodes: HashmapNode[]): [ HashmapNode[], HashmapNode[] ] {
        // Serialize nodes to edges
        return nodes.reduce((acc, [ key, value ]) => {
            // Sort nodes by left/right edges
            acc[key.shift()].push([ key, value ])

            return acc
        }, [ [], [] ] as [ HashmapNode[], HashmapNode[] ])
    }

    private serializeLeaf (node: HashmapNode): Cell {
        return node[1]
    }

    private serializeLabel (nodes: HashmapNode[]): Bit[] {
        // Each label can always be serialized in at least two different fashions, using
        // hml_short or hml_long constructors. Usually the shortest serialization (and
        // in the case of a tie—the lexicographically smallest among the shortest) is
        // preferred and is generated by TVM hashmap primitives, while the other
        // variants are still considered valid.

        // Get nodes keys
        const [ first ] = nodes[0]
        const [ last ] = nodes[nodes.length - 1]
        // m = length at most possible bits of n (key)
        const m = first.length
        const sameBitsIndex = first.findIndex((bit, i) => bit !== last[i])
        const sameBitsLength = sameBitsIndex === -1 ? first.length : sameBitsIndex

        if (first[0] !== last[0] || m === 0) {
            // hml_short for zero most possible bits
            return this.serializeShort([])
        }

        const label = first.slice(0, sameBitsLength)
        const repeated = label.join('').match(/(^0+)|(^1+)/)[0].split('').map(b => Number(b) as Bit)
        const labelShort = this.serializeShort(label)
        const labelLong = this.serializeLong(label, m)
        const labelSame = nodes.length > 1 && repeated.length > 1
            ? this.serializeSame(repeated, m)
            : null

        const labels = [
            { bits: label.length, label: labelShort },
            { bits: label.length, label: labelLong },
            { bits: repeated.length, label: labelSame }
        ].filter(el => el.label !== null)

        // Sort labels by their length
        labels.sort((a, b) => a.label.length - b.label.length)

        // Get most compact label
        const choosen = labels[0]

        // Remove label bits from nodes keys
        nodes.forEach(([ key ]) => key.splice(0, choosen.bits))

        return choosen.label
    }

    private serializeShort (bits: Bit[]): Bit[] {
        // l binary 1s and one binary 0 (the unary representation of the length l)
        const len = `${bits.map(_ => 1).join('')}0`
        // Bits comprising the label itself
        const s = bits.join('')

        // hml_short$0
        return `0${len}${s}`
            .split('')
            .map(b => Number(b) as Bit)
    }

    private serializeLong (bits: Bit[], m: number): Bit[] {
        // Big-endian binary representation of the length l in log2(n + 1) bits
        const log2 = Math.ceil(Math.log2(m + 1))
        const n = bits.length.toString(2).padStart(log2, '0')
        // Bits comprising the label itself
        const s = bits.join('')

        // hml_long$10
        return `10${n}${s}`
            .split('')
            .map(b => Number(b) as Bit)
    }

    private serializeSame (bits: Bit[], m: number): Bit[] {
        // Repeated bit
        const v = bits[0]
        const log2 = Math.ceil(Math.log2(m + 1))
        // Big-endian binary representation of the length l in log2(n + 1) bits
        const n = bits.length.toString(2).padStart(log2, '0')

        // hml_same$11
        return `11${v}${n}`
            .split('')
            .map(b => Number(b) as Bit)
    }

    public set (key: K, value: V): this {
        const k = this.serializeKey(key).join('')
        const v = this.serializeValue(value)

        this.hashmap.set(k, v)

        return this
    }

    public get (key: K): V {
        const k = this.serializeKey(key).join('')
        const v = this.hashmap.get(k)

        return v !== undefined
            ? this.deserializeValue(v)
            : undefined
    }

    public* entries (): IterableIterator<[ K, V ]> {
        for (const [ k, v ] of this.hashmap) {
            const key = this.deserializeKey(k.split('').map(b => Number(b) as Bit))
            const value = this.deserializeValue(v)

            yield [ key, value]
        }
    }

    public cell (): Cell {
        return this.serialize()
    }
}

export { Hashmap }
