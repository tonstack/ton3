import { crc16BytesBe } from './utils/crypto'
import {
    uint8toInt8,
    int8ToUint8,
    bytesToBase64,
    base64ToBytes,
    hexToBytes,
    bytesToHex,
    bytesCompare
} from './utils/helpers'

const FLAG_BOUNCEABLE = 0x11
const FLAG_NON_BOUNCEABLE = 0x51
const FLAG_TEST_ONLY = 0x80

export type AddressType = 'base64' | 'raw'

interface AddressTag {
    bounceable: boolean
    testOnly: boolean
}

interface AddressData extends AddressTag {
    workchain: number
    hash: Uint8Array
}

/**
 * Smart contract address
 *
 * @class Address
 */
class Address {
    private workchain: number

    private hash: Uint8Array

    private bounceable: boolean

    private testOnly: boolean

    /**
     * Creates an instance of {@link Address}
     * 
     * Next formats can be used as constructor argument:
     * - Raw
     * - Base64
     * - Bytes containing Workchain ID and hash part
     * - Address
     * 
     * @param {(string | Address | Uint8Array)} address
     * 
     * @example
     * ```ts
     * import { Address } from '@tonstack/tontools'
     * 
     * const bytes = new Uint8Array() // containing Workchain ID and address hash bytes
     * const address = new Address('kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny')
     * 
     * new Address('-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260')
     * new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')
     * new Address(bytes)
     * new Address(address)
     * ```
     */
    constructor (address: string | Address | Uint8Array) {
        const isAddress = Address.isAddress(address)
        const isEncoded = Address.isEncoded(address)
        const isRaw = Address.isRaw(address)
        const isBytes = Address.isBytes(address)
        let result: AddressData

        switch (true) {
            case isAddress:
                result = Address.parseAddress(address as Address)

                break
            case isEncoded:
                result = Address.parseEncoded(address as string)

                break
            case isRaw:
                result = Address.parseRaw(address as string)

                break
            case isBytes:
                result = Address.parseBytes(address as Uint8Array)

                break
            default:
                result = null

                break
        }

        if (result === null) {
            throw new Error('Can\'t parse address. Unknown type')
        }

        this.workchain = result.workchain
        this.hash = result.hash
        this.bounceable = result.bounceable
        this.testOnly = result.testOnly
    }

    /**
     * Get raw or base64 representation of {@link Address}
     * 
     * @param {AddressType} [type="base64"] - Can be "base64" or "raw"
     * @param {boolean} [urlSafe=true] - Url-safe representation (only works for base64)
     * 
     * @example
     * ```ts
     * import { Address } from '@tonstack/tontools'
     * 
     * const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
     * const address = new Address(raw)
     *     .setBounceableFlag(true)
     *     .setTestOnlyFlag(true)
     * 
     * console.log(address.toString('base64')) // kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny
     * console.log(address.toString('base64', false)) // kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny
     * console.log(address.toString('raw')) // -1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260
     * ```
     * 
     * @returns {string}
     */
    public toString (type: AddressType = 'base64', urlSafe = true): string {
        const { workchain, bounceable, testOnly } = this

        if (type === 'raw') {
            return `${workchain}:${bytesToHex(this.hash)}`.toUpperCase()
        }

        const tag = Address.encodeTag({ bounceable, testOnly })
        const address = [ tag, int8ToUint8(workchain) ].concat(Array.from(this.hash))
        const hashsum = crc16BytesBe(address)
        const addressWithHashsum = address.concat(Array.from(hashsum))
        const base64 = bytesToBase64(addressWithHashsum)

        return urlSafe
            ? base64.replaceAll(/\//g, '_').replaceAll(/\+/g, '-')
            : base64.replaceAll(/_/g, '/').replaceAll(/-/g, '+')
    }

    /**
     * Set int8 as Workchain ID
     *
     * @param {number} value
     * 
     * @example
     * ```ts
     * import { Address } from '@tonstack/tontools'
     * 
     * const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
     * const address = new Address(raw)
     * 
     * address.setWorkchain(0)
     * ```
     * 
     * @return {this}
     */
    public setWorkchain (value: number): this {
        if (typeof value !== 'number' || value < -128 || value >= 128) {
            throw new Error('Workchain ID must be int8')
        }

        this.workchain = value

        return this
    }

    /**
     * If the transaction has been aborted, and the inbound message has its bounceable flag set to true, 
     * then it is "bounced" by automatically generating an outbound message (with the bounce flag clear) to its original sender
     *
     * @param {boolean} value
     * 
     * @example
     * ```ts
     * import { Address } from '@tonstack/tontools'
     * 
     * const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
     * const address = new Address(raw)
     * 
     * address.setBounceableFlag(true)
     * ```
     * 
     * @return {this}
     */
    public setBounceableFlag (value: boolean): this {
        if (typeof value !== 'boolean') {
            throw new Error('Bounceable flag must be a boolean')
        }

        this.bounceable = value

        return this
    }

    /**
     * Set if address should not be accepted by software running in the production network
     *
     * @param {boolean} value
     * 
     * @example
     * ```ts
     * import { Address } from '@tonstack/tontools'
     * 
     * const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
     * const address = new Address(raw)
     * 
     * address.setTestOnlyFlag(true)
     * ```
     * 
     * @return {this}
     */
    public setTestOnlyFlag (value: boolean): this {
        if (typeof value !== 'boolean') {
            throw new Error('TestOnly flag must be a boolean')
        }

        this.testOnly = value

        return this
    }

    /**
     * Returns address hash as Uint8Array with 32 bytes length
     * 
     * @example
     * ```ts
     * import { Address } from '@tonstack/tontools'
     * 
     * const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
     * const address = new Address(raw)
     * 
     * console.log(address.getHash())
     * // Uint8Array(32) [
     * //     252, 185,  26,  58,  56,  22, 208, 247,
     * //     184, 194, 199,  97,   8, 184, 169, 188,
     * //     90, 107, 122,  85, 189, 121, 248, 171,
     * //     16,  28,  82, 219,  41,  35,  34,  96
     * // ]
     * ```
     * 
     * @return {Uint8Array}
     */
    public getHash (): Uint8Array {
        return this.hash
    }

    /**
     * Returns workchain as int8
     * 
     * @example
     * ```ts
     * import { Address } from '@tonstack/tontools'
     * 
     * const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
     * const address = new Address(raw)
     * 
     * console.log(address.getWorkchain()) // -1
     * ```
     * 
     * @return {number}
     */
    public getWorkchain (): number {
        return this.workchain
    }

    /**
     * Returns value of bounceable flag
     * 
     * @example
     * import { Address } from '@tonstack/tontools'
     * 
     * const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
     * const address = new Address(raw)
     * 
     * console.log(address.isBounceable()) // false
     * ```
     * 
     * @return {boolean}
     */
    public isBounceable (): boolean {
        return this.bounceable
    }

    /**
     * Return value of test only flag
     * 
     * @example
     * ```ts
     * import { Address } from '@tonstack/tontools'
     * 
     * const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
     * const address = new Address(raw)
     * 
     * console.log(address.isTestOnly()) // false
     * ```
     * 
     * @return {boolean}
     */
    public isTestOnly (): boolean {
        return this.testOnly
    }

    /**
     * Helper method for writing null addresses to {@link BitArray}
     *
     * @static
     */
    public static readonly NULL = null

    private static isAddress (address: any): boolean {
        return address instanceof Address
    }

    private static isEncoded (address: any): boolean {
        const re = /^([a-zA-Z0-9_-]{48}|[a-zA-Z0-9\/\+]{48})$/

        return typeof address === 'string' && re.test(address)
    }

    private static isRaw (address: any): boolean {
        const re = /^-?[0-9]:[a-zA-Z0-9]{64}$/

        return typeof address === 'string' && re.test(address)
    }

    private static isBytes (address: any): boolean {
        return ArrayBuffer.isView(address) && address.byteLength === 33 
    }

    public static isValid (address: any): boolean {
        try {
            new Address(address)

            return true
        } catch (e) {
            return false
        }
    }

    private static parseAddress (value: Address): AddressData {
        const workchain = value.workchain
        const hash = new Uint8Array(value.hash)
        const bounceable = value.isBounceable()
        const testOnly = value.isTestOnly()

        return {
            bounceable,
            testOnly,
            workchain,
            hash
        }
    }

    private static parseEncoded (value: string): AddressData {
        const bytes = base64ToBytes(value)
        const data = Array.from(bytes)
        const address = data.splice(0, 34)
        const hashsum = data.splice(0, 2)
        const crc = crc16BytesBe(address)

        if (!bytesCompare(crc, hashsum)) {
            throw new Error('Can\'t parse address. Wrong hashsum.')
        }

        const tag = address.shift()
        const workchain = uint8toInt8(address.shift())
        const hash = new Uint8Array(address.splice(0, 32))
        const { bounceable, testOnly } = Address.decodeTag(tag)

        return {
            bounceable,
            testOnly,
            workchain,
            hash
        }
    }

    private static parseRaw (value: string): AddressData {
        const data = value.split(':')
        const workchain = parseInt(data[0], 10)
        const hash = hexToBytes(data[1])
        const bounceable = false
        const testOnly = false

        return {
            bounceable,
            testOnly,
            workchain,
            hash
        }
    }

    private static parseBytes (value: Uint8Array): AddressData {
        const data = Array.from(value)
        const workchain = uint8toInt8(data.shift())
        const hash = new Uint8Array(data.splice(0, 32))
        const bounceable = false
        const testOnly = false

        return {
            bounceable,
            testOnly,
            workchain,
            hash
        }
    }

    private static encodeTag (options: AddressTag): number {
        const { bounceable, testOnly } = options
        const tag = bounceable ? FLAG_BOUNCEABLE : FLAG_NON_BOUNCEABLE

        return testOnly ? (tag | FLAG_TEST_ONLY) : tag
    }

    private static decodeTag (tag: number): AddressTag {
        const testOnly = (tag & FLAG_TEST_ONLY) !== 0
    
        if (testOnly) {
            tag = tag ^ FLAG_TEST_ONLY
        }
    
        if (![ FLAG_BOUNCEABLE, FLAG_NON_BOUNCEABLE ].includes(tag)) {
            throw new Error('Bad address tag')
        }
    
        const bounceable = tag === FLAG_BOUNCEABLE
    
        return {
            bounceable,
            testOnly
        }
    }
}

export { Address }
