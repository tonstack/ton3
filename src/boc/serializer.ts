/* eslint-disable @typescript-eslint/naming-convention */

import { Cell } from './cell'
import { Builder } from './builder'
import { Slice } from './slice'
import {
    hexToBits,
    hexToBytes,
    bytesToUint,
    bytesCompare,
    bitsToBytes,
    bytesToBits
} from '../utils/helpers'
import {
    augment,
    rollback
} from '../utils/bits'
import { crc32cBytesLe } from '../utils/checksum'

const REACH_BOC_MAGIC_PREFIX = hexToBytes('B5EE9C72')
const LEAN_BOC_MAGIC_PREFIX = hexToBytes('68FF65F3')
const LEAN_BOC_MAGIC_PREFIX_CRC = hexToBytes('ACC3A728')

interface BOCOptions {
    has_index?: boolean
    hash_crc32?: boolean
    has_cache_bits?: boolean
    topological_order?: 'breadth-first' | 'depth-first'
    flags?: number
}

interface BocHeader {
    has_index: boolean
    hash_crc32: number
    has_cache_bits: boolean
    flags: number
    size_bytes: number
    offset_bytes: number
    cells_num: number
    roots_num: number
    absent_num: number
    tot_cells_size: number
    root_list: number[]
    cells_data: number[]
}

interface CellNode {
    cell: Cell
    children: number
    scanned: number
}

interface BuilderNode {
    builder: Builder
    indent: number
}

interface CellPointer {
    cell: Cell
    refIndexes: number[]
}

interface CellData {
    pointer: CellPointer
    remainder: number[]
}

const deserializeFift = (data: string): Cell[] => {
    if (!data) {
        throw new Error('Can\'t deserialize. Empty fift hex.')
    }

    const re = /((\s*)x{([0-9a-zA-Z_]+)}\n?)/gmi
    const matches = [ ...data.matchAll(re) ] || []

    if (!matches.length) {
        throw new Error('Can\'t deserialize. Bad fift hex.')
    }

    const parseFiftHex = (fift: string): Bit[] => {
        const bits = fift
            .split('')
            .map(el => (el === '_' ? el : hexToBits(el).join('')))
            .join('')
            .replace(/1[0]*_$/, '')
            .split('')
            .map(b => parseInt(b, 10) as Bit)

        return bits
    }

    const isLastNested = (stack: BuilderNode[], indent: number): boolean => {
        const lastStackIndent = stack[stack.length - 1].indent

        return lastStackIndent !== 0 && lastStackIndent >= indent
    }

    const stack = matches.reduce((acc, el, i) => {
        const [ , , spaces, fift ] = el
        const isLast = i === matches.length - 1
        const indent = spaces.length
        const bits = parseFiftHex(fift)
        const builder = new Builder()
            .storeBits(bits)

        while (acc.length && isLastNested(acc, indent)) {
            const { builder: b } = acc.pop()

            acc[acc.length - 1].builder.storeRef(b.cell())
        }

        if (isLast) {
            acc[acc.length - 1].builder.storeRef(builder.cell())
        } else {
            acc.push({ indent, builder })
        }

        return acc
    }, [] as BuilderNode[])

    return stack.map(el => el.builder.cell())
}

const deserializeHeader = (bytes: number[]): BocHeader => {
    if (bytes.length < 4 + 1) {
        throw new Error('Not enough bytes for magic prefix')
    }

    const crcbytes = Uint8Array.from(bytes.slice(0, bytes.length - 4))
    const prefix = bytes.splice(0, 4)
    const [ flags_byte ] = bytes.splice(0, 1)
    const header: BocHeader = {
        has_index: true,
        hash_crc32: null,
        has_cache_bits: false,
        flags: 0,
        size_bytes: flags_byte,
        offset_bytes: null,
        cells_num: null,
        roots_num: null,
        absent_num: null,
        tot_cells_size: null,
        root_list: null,
        cells_data: null
    }

    if (bytesCompare(prefix, REACH_BOC_MAGIC_PREFIX)) {
        header.has_index = (flags_byte & 128) !== 0
        header.has_cache_bits = (flags_byte & 32) !== 0
        header.flags = (flags_byte & 16) * 2 + (flags_byte & 8)
        header.size_bytes = flags_byte % 8
        header.hash_crc32 = flags_byte & 64
    } else if (bytesCompare(prefix, LEAN_BOC_MAGIC_PREFIX)) {
        header.hash_crc32 = 0
    } else if (bytesCompare(prefix, LEAN_BOC_MAGIC_PREFIX_CRC)) {
        header.hash_crc32 = 1
    } else {
        throw new Error('Bad magic prefix')
    }

    if (bytes.length < 1 + 5 * header.size_bytes) {
        throw new Error('Not enough bytes for encoding cells counters')
    }

    const [ offset_bytes ] = bytes.splice(0, 1)

    header.cells_num = bytesToUint(bytes.splice(0, header.size_bytes))
    header.roots_num = bytesToUint(bytes.splice(0, header.size_bytes))
    header.absent_num = bytesToUint(bytes.splice(0, header.size_bytes))
    header.tot_cells_size = bytesToUint(bytes.splice(0, offset_bytes))
    header.offset_bytes = offset_bytes

    if (bytes.length < header.roots_num * header.size_bytes) {
        throw new Error('Not enough bytes for encoding root cells hashes')
    }

    header.root_list = [ ...Array(header.roots_num) ].reduce<number[]>((acc) => {
        const refIndex = bytesToUint(bytes.splice(0, header.size_bytes))

        return acc.concat([ refIndex ])
    }, [])

    if (header.has_index) {
        if (bytes.length < header.offset_bytes * header.cells_num) {
            throw new Error('Not enough bytes for index encoding')
        }

        // TODO: figure out why index = [] was unused
        Object.keys([ ...Array(header.cells_num) ])
            .forEach(() => bytes.splice(0, header.offset_bytes))
    }

    if (bytes.length < header.tot_cells_size) {
        throw new Error('Not enough bytes for cells data')
    }

    header.cells_data = bytes.splice(0, header.tot_cells_size)

    if (header.hash_crc32) {
        if (bytes.length < 4) {
            throw new Error('Not enough bytes for crc32c hashsum')
        }

        const result = crc32cBytesLe(crcbytes)

        if (!bytesCompare(result, bytes.splice(0, 4))) {
            throw new Error('Crc32c hashsum mismatch')
        }
    }

    if (bytes.length) {
        throw new Error('Too much bytes in BoC serialization')
    }

    return header
}

const deserializeCell = (bytes: number[], refIndexSize: number): CellData => {
    const remainder = Array.from(bytes)

    if (remainder.length < 2) {
        throw new Error('BoC not enough bytes to encode cell descriptors')
    }

    const [ refsDescriptor, bitsDescriptor ] = remainder.splice(0, 2)

    // Exotic cell are currently unsupported
    // const _isExotic = !!(refsDescriptor & 8)
    const isAugmented = bitsDescriptor % 2 !== 0
    const refNum = refsDescriptor % 8
    const size = Math.ceil(bitsDescriptor / 2)

    if (remainder.length < size + refIndexSize * refNum) {
        throw new Error('BoC not enough bytes to encode cell data')
    }

    const bits = isAugmented
        ? rollback(bytesToBits(remainder.splice(0, size)))
        : bytesToBits(remainder.splice(0, size))

    const cell = new Builder(bits.length)
        .storeBits(bits)
        .cell()

    const refIndexes: number[] = []

    for (let i = 0; i < refNum; i += 1) {
        const refIndex = bytesToUint(remainder.splice(0, refIndexSize))

        refIndexes.push(refIndex)
    }

    return {
        pointer: { cell, refIndexes },
        remainder
    }
}

const deserialize = (data: Uint8Array): Cell[] => {
    const bytes = Array.from(data)
    const pointers: CellPointer[] = []
    const {
        cells_num,
        size_bytes,
        cells_data,
        root_list
    } = deserializeHeader(bytes)

    for (let i = 0, remainder = cells_data; i < cells_num; i += 1) {
        const deserialized = deserializeCell(remainder, size_bytes)

        remainder = deserialized.remainder
        pointers.push(deserialized.pointer)
    }

    Object.keys(pointers)
        .reverse()
        .forEach((i) => {
            const pointerIndex = parseInt(i, 10)
            const pointer = pointers[pointerIndex]
            const builder = new Builder().storeSlice(Slice.parse(pointer.cell))

            pointer.refIndexes.forEach((refIndex) => {
                const ref = pointers[refIndex].cell

                if (refIndex < pointerIndex) {
                    throw new Error('Topological order is broken')
                }

                builder.storeRef(ref)
            })

            pointer.cell = builder.cell()
        })

    return root_list.reduce((acc, refIndex) => acc.concat([ pointers[refIndex].cell ]), [])
}

const depthFirstSort = (root: Cell): { cells: Cell[], hashmap: Map<string, number> } => {
    // TODO: fix multiple root cells serialization

    const hashmap = new Map<string, number>()
    const nodes: CellNode[] = [ { cell: root, children: root.refs.length, scanned: 0 } ]
    const stack: { cell: Cell, hash: string }[] = [ { cell: root, hash: root.hash() } ]

    hashmap.set(stack[0].hash, 0)

    // Reorder stack and hashmap if duplicate found
    const move = (index: number): void => {
        stack.push(stack.splice(index, 1)[0])
        stack.slice(index).forEach((el, i) => hashmap.set(el.hash, index + i))
    }

    // Add tree node to ordered stack
    const add = (node: CellNode): void => {
        // eslint-disable-next-line no-plusplus, no-param-reassign
        const ref = node.cell.refs[node.scanned++]
        const hash = ref.hash()
        const index = hashmap.get(hash)

        if (index !== undefined) {
            return move(index)
        }

        hashmap.set(hash, stack.length)
        nodes.push({ cell: ref, children: ref.refs.length, scanned: 0 })
        stack.push({ cell: ref, hash })

        return undefined
    }

    // Loop through multi-tree and make depth-first search till last node
    while (nodes.length) {
        let current = nodes[nodes.length - 1]

        if (current.children !== current.scanned) {
            add(current)
        } else {
            while (nodes.length && current && current.children === current.scanned) {
                nodes.pop()

                current = nodes[nodes.length - 1]
            }

            if (current !== undefined) {
                add(current)
            }
        }
    }

    return {
        cells: stack.map(el => el.cell),
        hashmap
    }
}

const breadthFirstSort = (root: Cell): { cells: Cell[], hashmap: Map<string, number> } => {
    // TODO: fix multiple root cells serialization

    const hashmap = new Map<string, number>()
    const nodes: Cell[] = [ root ]
    const stack: { cell: Cell, hash: string }[] = [ { cell: root, hash: root.hash() } ]

    hashmap.set(stack[0].hash, 0)

    // Reorder stack and hashmap if duplicate found
    const move = (index: number): void => {
        stack.push(stack.splice(index, 1)[0])
        stack.slice(index).forEach((el, i) => hashmap.set(el.hash, index + i))
    }

    // Add tree node to ordered stack
    const add = (node: Cell): void => {
        const hash = node.hash()
        const index = hashmap.get(hash)

        if (index !== undefined) {
            return move(index)
        }

        hashmap.set(hash, stack.length)
        nodes.push(node)
        stack.push({ cell: node, hash })

        return undefined
    }

    // Loop through multi-tree and make breadth-first search till last node
    while (nodes.length) {
        const { length } = nodes

        nodes.forEach((node) => {
            node.refs.forEach(ref => add(ref))
        })

        nodes.splice(0, length)
    }

    return {
        cells: stack.map(el => el.cell),
        hashmap
    }
}

const serializeCell = (cell: Cell, hashmap: Map<string, number>, refIndexSize: number): Bit[] => {
    const representation = cell.descriptors.concat(cell.augmentedBits)
    const bits = cell.refs.reduce((acc, ref) => {
        const builder = new Builder()
        const refIndex = hashmap.get(ref.hash())

        builder.storeUint(refIndex, refIndexSize)

        return acc.concat(builder.bits)
    }, representation)

    return bits
}

const serialize = (root: Cell[], options: BOCOptions = {}): Uint8Array => {
    // TODO: fix more than 1 root cells support
    const standard = root[0]
    const {
        has_index = false,
        has_cache_bits = false,
        hash_crc32 = true,
        topological_order = 'breadth-first',
        flags = 0
    } = options

    const { cells: cells_list, hashmap } = topological_order === 'breadth-first'
        ? breadthFirstSort(standard)
        : depthFirstSort(standard)

    const cells_num = cells_list.length
    const size = cells_num.toString(2).length
    const size_bytes = Math.max(Math.ceil(size / 8), 1)
    const [ cells_bits, size_index ] = cells_list.reduce<[ Bit[], number[] ]>((acc, cell) => {
        const bits = serializeCell(cell, hashmap, size_bytes * 8)

        acc[0] = acc[0].concat(bits)
        acc[1].push(bits.length / 8)

        return acc
    }, [ [], [] ])

    const full_size = cells_bits.length / 8
    const offset_bits = full_size.toString(2).length
    const offset_bytes = Math.max(Math.ceil(offset_bits / 8), 1)
    const builder_size = (32 + 3 + 2 + 3 + 8)
        + (cells_bits.length)
        + ((size_bytes * 8) * 4)
        + (offset_bytes * 8)
        + (has_index ? (cells_list.length * (offset_bytes * 8)) : 0)

    const result = new Builder(builder_size)

    result.storeBytes(REACH_BOC_MAGIC_PREFIX)
        .storeBit(Number(has_index))
        .storeBit(Number(hash_crc32))
        .storeBit(Number(has_cache_bits))
        .storeUint(flags, 2)
        .storeUint(size_bytes, 3)
        .storeUint(offset_bytes, 8)
        .storeUint(cells_num, size_bytes * 8)
        .storeUint(root.length, size_bytes * 8)
        .storeUint(0, size_bytes * 8)
        .storeUint(full_size, offset_bytes * 8)
        .storeUint(0, size_bytes * 8)

    if (has_index) {
        cells_list.forEach((_, index) => {
            result.storeUint(size_index[index], offset_bytes * 8)
        })
    }

    const augmentedBits = augment(result.storeBits(cells_bits).bits)
    const bytes = bitsToBytes(augmentedBits)

    if (hash_crc32) {
        const hashsum = crc32cBytesLe(bytes)

        return new Uint8Array([ ...bytes, ...hashsum ])
    }

    return bytes
}

export {
    serialize,
    deserialize,
    deserializeFift,
    BOCOptions
}
