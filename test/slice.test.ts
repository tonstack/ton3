import sinon from 'sinon'
import { expect, should } from 'chai'
import { BoC } from '../src/boc'
import { Cell } from '../src/boc/cell'
import { Slice } from '../src/boc/slice'
import { stringToBytes } from '../src/utils/helpers'
import { Bit } from '../src/boc/bit-array'
import { Address } from '../src/address'
import { Coins } from '../src/coins'

describe('Slice', () => {
    let cell: Cell

    beforeEach(() => {
        cell = new Cell()
    })

    describe('#constructor()', () => {
        it('should create Slice from Cell', () => {
            const result = new Slice(cell)

            expect(result).to.be.instanceOf(Slice)
        })
    })

    describe('#skip()', () => {
        it('should skip bits', () => {
            cell.bits.writeBits([ 0, 0, 1, 1 ])

            const slice = new Slice(cell)
            const result = slice.skip(2).readBits(2)

            expect(result).to.eql([ 1, 1 ])
        })

        it('should throw error on overflow', () => {
            cell.bits.writeBits([ 0, 0, 1, 1 ])

            const slice = new Slice(cell)
            const result = () => slice.skip(6)

            expect(result).to.throw('Slice skip overflow')
        })
    })

    describe('#readRef()', () => {
        it('should read ref', () => {
            const ref = new Cell()

            cell.refs.push(ref)

            const slice = new Slice(cell)
            const result1 = slice.readRef()
            // @ts-ignore
            const result2 = slice.refs.length

            expect(result1).to.eq(ref)
            expect(result2).to.eq(0)
        })

        it('should read ref without splicing refs', () => {
            const ref = new Cell()

            cell.refs.push(ref)

            const slice = new Slice(cell)
            const result1 = slice.readRef(false)
            // @ts-ignore
            const result2 = slice.refs.length

            expect(result1).to.eq(ref)
            expect(result2).to.eq(1)
        })

        it('should throw error on overflow', () => {
            const slice = new Slice(cell)
            const result = () => slice.readRef()

            expect(result).to.throw('Slice refs overflow')
        })
    })

    describe('#readBit()', () => {
        it('should read bit', () => {
            cell.bits.writeBit(1)

            const slice = new Slice(cell)
            const result1 = slice.readBit()
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(1)
            expect(result2).to.eq(0)
        })

        it('should read bit without splicing bits', () => {
            cell.bits.writeBit(1)

            const slice = new Slice(cell)
            const result1 = slice.readBit(false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(1)
            expect(result2).to.eq(1)
        })

        it('should throw error on overflow', () => {
            const slice = new Slice(cell)
            const result = () => slice.readBit()

            expect(result).to.throw('Slice bits overflow')
        })
    })

    describe('#readBits()', () => {
        it('should read bits', () => {
            cell.bits.writeBits([ 0, 1 ])

            const slice = new Slice(cell)
            const result1 = slice.readBits(2)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eql([ 0, 1 ])
            expect(result2).to.eq(0)
        })

        it('should read bits without splicing bits', () => {
            cell.bits.writeBits([ 0, 1 ])

            const slice = new Slice(cell)
            const result1 = slice.readBits(2, false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eql([ 0, 1 ])
            expect(result2).to.eq(2)
        })

        it('should throw error on overflow', () => {
            const slice = new Slice(cell)
            const result = () => slice.readBits(2)

            expect(result).to.throw('Slice bits overflow')
        })
    })

    describe('#readInt()', () => {
        it('should read negative int', () => {
            const int = -14

            cell.bits.writeInt(int, 15)

            const slice = new Slice(cell)
            const result1 = slice.readInt(15)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(0)
        })

        it('should read positive int', () => {
            const int = 14

            cell.bits.writeInt(int, 15)

            const slice = new Slice(cell)
            const result1 = slice.readInt(15)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(0)
        })

        it('should read int without splicing bits', () => {
            const int = -14

            cell.bits.writeInt(int, 15)

            const slice = new Slice(cell)
            const result1 = slice.readInt(15, false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(15)
        })

        it('should throw error on overflow', () => {
            const slice = new Slice(cell)
            const result = () => slice.readInt(15)

            expect(result).to.throw('Slice bits overflow')
        })
    })

    describe('#readUint()', () => {
        it('should read uint', () => {
            const uint = 14

            cell.bits.writeUint(uint, 9)

            const slice = new Slice(cell)
            const result1 = slice.readUint(9)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(uint)
            expect(result2).to.eq(0)
        })

        it('should read uint without splicing bits', () => {
            const uint = 14

            cell.bits.writeUint(uint, 9)

            const slice = new Slice(cell)
            const result1 = slice.readUint(9, false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(uint)
            expect(result2).to.eq(9)
        })

        it('should throw error on overflow', () => {
            const slice = new Slice(cell)
            const result = () => slice.readUint(9)

            expect(result).to.throw('Slice bits overflow')
        })
    })

    describe('#readBytes()', () => {
        it('should read bytes', () => {
            const bytes = new Uint8Array([ 255, 11, 12 ])

            cell.bits.writeBytes(bytes)

            const slice = new Slice(cell)
            const result1 = slice.readBytes(bytes.byteLength * 8)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eql(bytes)
            expect(result2).to.eq(0)
        })

        it('should read bytes without splicing bits', () => {
            const bytes = new Uint8Array([ 255, 11, 12 ])

            cell.bits.writeBytes(bytes)

            const slice = new Slice(cell)
            const result1 = slice.readBytes(bytes.byteLength * 8, false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eql(bytes)
            expect(result2).to.eq(bytes.byteLength * 8)
        })

        it('should throw error on overflow', () => {
            const slice = new Slice(cell)
            const result = () => slice.readBytes(8)

            expect(result).to.throw('Slice bits overflow')
        })
    })

    describe('#readString()', () => {
        it('should read string', () => {
            const string = 'Привет, мир!'

            cell.bits.writeString(string)

            const slice = new Slice(cell)
            const result1 = slice.readString()
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(0)
        })

        it('should read string with size', () => {
            const string = 'Привет, мир!'
            const size = stringToBytes(string).length * 8

            cell.bits.writeString(string)

            const slice = new Slice(cell)
            const result1 = slice.readString(size)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(0)
        })

        it('should read string without splicing bits', () => {
            const string = 'Привет, мир!'
            const size = stringToBytes(string).length * 8

            cell.bits.writeString(string)

            const slice = new Slice(cell)
            const result1 = slice.readString(size, false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(size)
        })

        it('should throw error on overflow', () => {
            const slice = new Slice(cell)
            const result = () => slice.readString()

            expect(result).to.throw('Slice bits overflow')
        })
    })

    describe('#readAddress()', () => {
        it('should read Address', () => {
            const raw = '0:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address = new Address(raw)

            cell.bits.writeAddress(address)

            const slice = new Slice(cell)
            const result1 = slice.readAddress()
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1.toString('raw')).to.eq(raw)
            expect(result2).to.eq(0)
        })

        it('should read Address without splicing bits', () => {
            const raw = '0:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address = new Address(raw)

            cell.bits.writeAddress(address)

            const slice = new Slice(cell)
            const result1 = slice.readAddress(false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1.toString('raw')).to.eq(raw)
            expect(result2).to.eq(2 + 1 + 8 + 256)
        })

        it('should read null Address without splicing bits', () => {
            cell.bits.writeAddress(Address.NULL)

            const slice = new Slice(cell)
            const result1 = slice.readAddress(false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(Address.NULL)
            expect(result2).to.eq(2)
        })

        it('should throw error on incorrect Address flags', () => {
            cell.bits.writeBits([ 1, 1 ])

            const slice = new Slice(cell)
            const result = () => slice.readAddress()

            expect(result).to.throw('Bad address flag bits')
        })

        it('should throw error on overflow', () => {
            const slice = new Slice(cell)
            const result = () => slice.readAddress()

            expect(result).to.throw('Slice bits overflow')
        })
    })

    describe('#readCoins()', () => {
        it('should read Coins', () => {
            const coins = new Coins('100.5')

            cell.bits.writeCoins(coins)

            const slice = new Slice(cell)
            const result1 = slice.readCoins()
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(0)
        })

        it('should read Coins without splicing bits', () => {
            const coins = new Coins('100.5')
            const size = BigInt(coins.toNano()).toString(16).length

            cell.bits.writeCoins(coins)

            const slice = new Slice(cell)
            const result1 = slice.readCoins(false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(4 + (size * 4))
        })

        it('should read zero Coins', () => {
            const coins = new Coins('0')

            cell.bits.writeCoins(coins)

            const slice = new Slice(cell)
            const result1 = slice.readCoins()
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(0)
        })

        it('should read zero Coins without splicing bits', () => {
            const coins = new Coins('0')

            cell.bits.writeCoins(coins)

            const slice = new Slice(cell)
            const result1 = slice.readCoins(false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(4)
        })

        it('should throw error on overflow', () => {
            const slice = new Slice(cell)
            const result = () => slice.readCoins()

            expect(result).to.throw('Slice bits overflow')
        })
    })

    describe('#from()', () => {
        it('should create Slice from Cell', () => {
            const result = Slice.from(cell)

            expect(result).to.be.instanceOf(Slice)
        })
    })
})
