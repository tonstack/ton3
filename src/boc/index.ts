import { Builder } from './builder'
import { Slice } from './slice'
import { Cell } from './cell'
import {
    Hashmap,
    HashmapE
} from './hashmap'
import {
    base64ToBytes,
    bytesToBase64,
    hexToBytes,
    bytesToHex
} from '../utils/helpers'
import {
    serialize,
    deserialize,
    deserializeFift,
    BOCOptions
} from './serializer'

class BOC {
    private static isHex (data: any): boolean {
        const re = /^[a-fA-F0-9]+$/

        return typeof data === 'string' && re.test(data)
    }

    private static isBase64 (data: any): boolean {
        // eslint-disable-next-line no-useless-escape
        const re = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/

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
     * @param {(Uint8Array | string)} data - Bytes, HEX or Base64 of serialized BOC.
     * @return {Cell[]}
     */
    public static from (data: Uint8Array | string): Cell[] {
        if (BOC.isBytes(data)) {
            return deserialize(data as Uint8Array)
        }

        const value = (data as string).trim()

        if (BOC.isFift(value)) {
            return deserializeFift(value)
        }

        if (BOC.isHex(value)) {
            return deserialize(hexToBytes(value))
        }

        if (BOC.isBase64(value)) {
            return deserialize(base64ToBytes(value))
        }

        throw new Error('BOC: can\'t deserialize. Bad data.')
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

        return serialize(cells, options)
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
     * Returns serialized BOC in base64 representation.
     *
     * @static
     * @param {Cell[]} cells - Root cells.
     * @param {BOCOptions} [options]
     * @return {string}
     */
    public static toBase64 (cells: Cell[], options?: BOCOptions): string {
        const bytes = BOC.toBytes(cells, options)

        return bytesToBase64(bytes)
    }

    /**
     * Returns serialized standard BOC in base64 representation.
     *
     * @static
     * @param {Cell} cell - Root cell.
     * @param {BOCOptions} [options]
     * @return {string}
     */
    public static toBase64Standard (cell: Cell, options?: BOCOptions): string {
        return BOC.toBase64([ cell ], options)
    }

    /**
     * Returns serialized BOC in Fift HEX representation.
     *
     * @static
     * @param {Cell[]} cells - Root cells.
     * @param {BOCOptions} [options]
     * @return {string}
     */
    public static toFiftHex (cells: Cell[]): string {
        const fift = cells.map(cell => cell.print())

        return fift.join('\n')
    }

    /**
     * Returns serialized standard BOC in Fift HEX representation.
     *
     * @static
     * @param {Cell} cell - Root cell.
     * @param {BOCOptions} [options]
     * @return {string}
     */
    public static toFiftHexStandard (cell: Cell): string {
        return BOC.toFiftHex([ cell ])
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
    Hashmap,
    HashmapE,
    Slice,
    Builder
}
