/* eslint-disable max-classes-per-file */

import { Builder } from './builder'
import { Slice } from './slice'
import type { Cell } from './cell'

export interface HashmapOptions<K, V> {
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
    protected hashmap: Map<string, Cell>

    protected keySize: number

    protected serializeKey: (key: K) => Bit[]

    protected serializeValue: (value: V) => Cell

    protected deserializeKey: (key: Bit[]) => K

    protected deserializeValue: (value: Cell) => V

    constructor (keySize: number, options?: HashmapOptions<K, V>) {
        const {
            serializers = { key: (key: K) => key, value: (value: V) => value },
            deserializers = { key: (key: Bit[]) => key, value: (value: Cell) => value }
        } = options || {}

        this.hashmap = new Map<string, Cell>()
        this.keySize = keySize
        this.serializeKey = serializers.key as (key: K) => Bit[]
        this.serializeValue = serializers.value as (value: V) => Cell
        this.deserializeKey = deserializers.key as (key: Bit[]) => K
        this.deserializeValue = deserializers.value as (value: Cell) => V
    }

    public* [Symbol.iterator] (): IterableIterator<[ K, V ]> {
        // eslint-disable-next-line no-restricted-syntax
        for (const [ k, v ] of this.hashmap) {
            const key = this.deserializeKey(k.split('').map(b => Number(b) as Bit))
            const value = this.deserializeValue(v)

            yield [ key, value ]
        }
    }

    public set (key: K, value: V): this {
        const k = this.serializeKey(key).join('')
        const v = this.serializeValue(value)

        this.hashmap.set(k, v)

        return this
    }

    public setRaw (key: Bit[], value: Cell): this {
        this.hashmap.set(key.join(''), value)

        return this
    }

    public get (key: K): V {
        const k = this.serializeKey(key).join('')
        const v = this.hashmap.get(k)

        return v !== undefined
            ? this.deserializeValue(v)
            : undefined
    }

    public getRaw (key: Bit[]): Cell {
        return this.hashmap.get(key.join(''))
    }

    protected sortHashmap (): HashmapNode[] {
        const sorted = [ ...this.hashmap ].reduce((acc, [ bitstring, value ]) => {
            const key = bitstring.split('').map(b => Number(b) as Bit)
            // Sort keys by DESC to serialize labels correctly later
            const order = parseInt(bitstring, 2)
            const lt = acc.findIndex(el => order > el.order)
            const index = lt > -1 ? lt : acc.length

            acc.splice(index, 0, { order, key, value })

            return acc
        }, [] as { order: number, key: Bit[], value: Cell }[])

        return sorted.map(el => [ el.key, el.value ])
    }

    protected serialize (): Cell {
        const nodes = this.sortHashmap()

        if (nodes.length === 0) {
            throw new Error('Hashmap: can\'t be empty. It must contain at least 1 key-value pair.')
        }

        return Hashmap.serializeEdge(nodes)
    }

    protected static serializeEdge (nodes: HashmapNode[]): Cell {
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

            edge.storeSlice(Slice.parse(leaf))
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

    protected static serializeFork (nodes: HashmapNode[]): [ HashmapNode[], HashmapNode[] ] {
        // Serialize nodes to edges
        return nodes.reduce((acc, [ key, value ]) => {
            // Sort nodes by left/right edges
            acc[key.shift()].push([ key, value ])

            return acc
        }, [ [], [] ] as [ HashmapNode[], HashmapNode[] ])
    }

    protected static serializeLeaf (node: HashmapNode): Cell {
        return node[1]
    }

    protected static serializeLabel (nodes: HashmapNode[]): Bit[] {
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
            return this.serializeLabelShort([])
        }

        const label = first.slice(0, sameBitsLength)
        const repeated = label.join('').match(/(^0+)|(^1+)/)[0].split('').map(b => Number(b) as Bit)
        const labelShort = this.serializeLabelShort(label)
        const labelLong = this.serializeLabelLong(label, m)
        const labelSame = nodes.length > 1 && repeated.length > 1
            ? this.serializeLabelSame(repeated, m)
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

    /**
     * hml_short$0 consists of:
     * - binary 0 as constructor
     * - l binary 1s and one binary 0 (the unary representation of the length l)
     * - bits comprising the label itself
     */
    protected static serializeLabelShort (bits: Bit[]): Bit[] {
        const label = new Builder()

        label.storeBit(0)
            .storeBits(bits.map(() => 1))
            .storeBit(0)
            .storeBits(bits)

        return label.bits
    }

    /**
     * hml_long$10 consists of:
     * - binary 1 and 0 as constructor
     * - big-endian binary representation of the length l in log2(n + 1) bits
     * - bits comprising the label itself
     */
    protected static serializeLabelLong (bits: Bit[], m: number): Bit[] {
        const label = new Builder()

        label.storeBits([ 1, 0 ])
            .storeUint(bits.length, Math.ceil(Math.log2(m + 1)))
            .storeBits(bits)

        return label.bits
    }

    /**
     * hml_same$11 consists of:
     * - binary 1 and 1 as constructor
     * - unary representation of repeated bit
     * - big-endian binary representation of the length l in log2(n + 1) bits
     */
    protected static serializeLabelSame (bits: Bit[], m: number): Bit[] {
        const label = new Builder()

        label.storeBits([ 1, 1 ])
            .storeBit(bits[0])
            .storeUint(bits.length, Math.ceil(Math.log2(m + 1)))

        return label.bits
    }

    protected static deserialize<K, V> (
        slice: Slice,
        keySize: number,
        options?: HashmapOptions<K, V>
    ): Hashmap<K, V> {
        if (slice.bits.length < 2) {
            throw new Error('Hashmap: can\'t be empty. It must contain at least 1 key-value pair.')
        }

        const hashmap = new Hashmap(keySize, options)
        const nodes = Hashmap.deserializeEdge(slice, keySize)

        for (let i = 0; i < nodes.length; i += 1) {
            const [ key, value ] = nodes[i]

            hashmap.setRaw(key, value)
        }

        return hashmap
    }

    protected static deserializeEdge (
        edge: Slice,
        keySize: number,
        key: Bit[] = []
    ): HashmapNode[] {
        const nodes: HashmapNode[] = []

        key.push(...this.deserializeLabel(edge, keySize - key.length))

        if (key.length === keySize) {
            const value = new Builder().storeSlice(edge).cell()

            return nodes.concat([ [ key, value ] ])
        }

        return edge.refs.reduce((acc, _r, i) => {
            const forkEdge = Slice.parse(edge.loadRef())
            const forkKey = key.concat([ i as Bit ])

            return acc.concat(this.deserializeEdge(forkEdge, keySize, forkKey))
        }, [])
    }

    protected static deserializeLabel (edge: Slice, m: number): Bit[] {
        // m = length at most possible bits of n (key)

        // hml_short$0
        if (edge.loadBit() === 0) {
            return this.deserializeLabelShort(edge)
        }

        // hml_long$10
        if (edge.loadBit() === 0) {
            return this.deserializeLabelLong(edge, m)
        }

        // hml_same$11
        return this.deserializeLabelSame(edge, m)
    }

    protected static deserializeLabelShort (edge: Slice): Bit[] {
        const length = edge.bits.findIndex(b => b === 0)

        return edge.skip(length + 1) && edge.loadBits(length)
    }

    protected static deserializeLabelLong (edge: Slice, m: number): Bit[] {
        const length = edge.loadUint(Math.ceil(Math.log2(m + 1)))

        return edge.loadBits(length)
    }

    protected static deserializeLabelSame (edge: Slice, m: number): Bit[] {
        const repeated = edge.loadBit()
        const length = edge.loadUint(Math.ceil(Math.log2(m + 1)))

        return [ ...Array(length) ].map(() => repeated)
    }

    public cell (): Cell {
        return this.serialize()
    }

    public static parse<K = Bit[], V = Cell> (
        slice: Slice,
        keySize: number,
        options?: HashmapOptions<K, V>
    ): Hashmap<K, V> {
        return this.deserialize<K, V>(slice, keySize, options)
    }
}

class HashmapE<K = Bit[], V = Cell> extends Hashmap<K, V> {
    constructor (keySize: number, options?: HashmapOptions<K, V>) {
        super(keySize, options)
    }

    protected serialize (): Cell {
        const nodes = this.sortHashmap()
        const result = new Builder()

        if (!nodes.length) {
            return result
                .storeBit(0)
                .cell()
        }

        return result
            .storeBit(1)
            .storeRef(HashmapE.serializeEdge(nodes))
            .cell()
    }

    protected static deserialize<K, V> (
        slice: Slice,
        keySize: number,
        options?: HashmapOptions<K, V>
    ): HashmapE<K, V> {
        if (slice.bits.length !== 1) {
            throw new Error('HashmapE: bad hashmap size flag.')
        }

        if (slice.loadBit() === 0) {
            return new HashmapE<K, V>(keySize, options)
        }

        const hashmap = new HashmapE<K, V>(keySize, options)
        const nodes = Hashmap.deserializeEdge(slice, keySize)

        for (let i = 0; i < nodes.length; i += 1) {
            const [ key, value ] = nodes[i]

            hashmap.setRaw(key, value)
        }

        return hashmap
    }

    public static parse<K = Bit[], V = Cell> (
        slice: Slice,
        keySize: number,
        options?: HashmapOptions<K, V>
    ): HashmapE<K, V> {
        return this.deserialize<K, V>(slice, keySize, options)
    }
}

export {
    HashmapE,
    Hashmap
}
