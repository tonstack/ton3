import {
    Bit,
    BitArray
} from './bit-array'
import { Slice } from './slice'
import { Cell } from './cell'
import {
    hexToBytes,
    bytesToHex
} from '../utils/helpers'
import {
    SerializationOptions,
    serialize,
    deserializeFift,
    deserialize
} from './serializer'

class BoC {
    public root: Cell[]

    constructor (cells: Cell[] = []) {
        this.root = cells.length ? [ ...cells ] : [ new Cell() ]
    }

    public static from (data: Uint8Array | string, type: 'bytes' | 'hex' | 'fift' = 'bytes'): BoC {
        const isBytes = BoC.isBytes(data)
        const isHex = BoC.isHex(data)
        const isFift = BoC.isFift(data)
        let cells: Cell[]

        switch (true) {
            case isBytes:
                cells = deserialize(data as Uint8Array)

                break
            case isHex:
                cells = deserialize(hexToBytes(data as string))

                break
            case isFift:
                cells = deserializeFift(data as string)

                break
            default:
                cells = null
        }

        if (cells === null) {
            throw new Error('Can\'t deserialize BoC. Bad data.')
        }

        return new BoC(cells)
    }

    public toBytes (options?: SerializationOptions): Uint8Array {
        return serialize(this.root[0], options)
    }

    public toHex (options?: SerializationOptions): string {
        return bytesToHex(serialize(this.root[0], options))
    }

    private static isHex (data: any): boolean {
        const re = /^[a-zA-Z0-9]+$/

        return typeof data === 'string' && re.test(data)
    }

    private static isFift (data: any): boolean {
        const re = /^x\{/

        return typeof data === 'string' && re.test(data)
    }

    private static isBytes (data: any): boolean {
        return ArrayBuffer.isView(data)
    }
}

export {
    BoC,
    Cell,
    Slice,
    BitArray,
    Bit
}
