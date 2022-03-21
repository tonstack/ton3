import {
    Bit,
    Builder
} from './builder'
import { Slice } from './slice'
import { Cell } from './cell'
import {
    hexToBytes,
    bytesToHex
} from '../utils/helpers'
import {
    serialize,
    deserialize,
    BOCOptions
} from './serializer'

class BOC {
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

    /**
     * Returns deserialized BOC root cells.
     * 
     * @static
     * @param {(Uint8Array | string)} data - Bytes or HEX of serialized BOC.
     * @return {Cell[]}
     */
    public static from (data: Uint8Array | string): Cell[] {
        const isBytes = BOC.isBytes(data)
        const isHex = BOC.isHex(data)
        const isFift = BOC.isFift(data)
        let cells: Cell[]

        switch (true) {
            case isBytes:
                cells = deserialize(data as Uint8Array)

                break
            case isHex:
                cells = deserialize(hexToBytes(data as string))

                break
            // case isFift:
            //     cells = deserializeFift(data as string)

            //     break
            default:
                cells = null
        }

        if (cells === null) {
            throw new Error('BOC: can\'t deserialize. Bad data.')
        }

        return cells
    }

    /**
     * Returns deserialized standard BOC root cell.
     * 
     * @static
     * @param {(Uint8Array | string)} data - Bytes or HEX of serialized BOC.
     * @return {Cell}
     */
    public static fromStandard (data: Uint8Array | string): Cell {
        const cells = BOC.from(data)

        if (cells.length !== 1) {
            throw new Error(`BOC: standard BOC consists of only 1 root cell. Got ${cells.length}.`)
        }

        return cells[0]
    }

    /**
     * Returns serialized BOC in bytes representation.
     * 
     * @static
     * @param {Cell[]} cells - Root cells.
     * @param {BOCOptions} [options]
     * @return {Uint8Array}
     */
    public static toBytes (cells: Cell[], options?: BOCOptions): Uint8Array {
        if (cells.length === 0 || cells.length > 4) {
            throw new Error('BOC: root cells length must be from 1 to 4')
        }

        return serialize(cells[0], options)
    }

    /**
     * Returns serialized standard BOC in bytes representation.
     * 
     * @static
     * @param {Cell} cell - Root cell.
     * @param {BOCOptions} [options]
     * @return {Uint8Array}
     */
    public static toBytesStandard (cell: Cell, options?: BOCOptions): Uint8Array {
        return BOC.toBytes([ cell ], options)
    }

    /**
     * Returns serialized BOC in hex representation.
     * 
     * @static
     * @param {Cell[]} cells - Root cells.
     * @param {BOCOptions} [options]
     * @return {string}
     */
    public static toHex (cells: Cell[], options?: BOCOptions): string {
        const bytes = BOC.toBytes(cells, options)

        return bytesToHex(bytes)
    }

    /**
     * Returns serialized standard BOC in hex representation.
     * 
     * @static
     * @param {Cell} cell - Root cell.
     * @param {BOCOptions} [options]
     * @return {string}
     */
    public static toHexStandard (cell: Cell, options?: BOCOptions): string {
        return BOC.toHex([ cell ], options)
    }
}

export {
    BOC,
    Cell,
    Slice,
    Builder,
    Bit
}
