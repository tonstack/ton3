import { expect } from 'chai'
import { Builder, Slice } from '../src/boc'
import { stringToBytes } from '../src/utils/helpers'
import { Address } from '../src/address'
import { Coins } from '../src/coins'

describe('Slice', () => {
    let builder: Builder

    beforeEach(() => {
        builder = new Builder()
    })

    describe('#constructor()', () => {
        it('should create Slice from Cell', () => {
            const cell = builder.cell()
            const result = cell.parse()

            expect(result).to.be.instanceOf(Slice)
        })
    })

    describe('#bits', () => {
        it('should get Slice bits', () => {
            const slice = builder.cell().parse()
            const result = slice.bits

            expect(result).to.eql([])
        })

        it('should throw error from changing attempt', () => {
            const slice = builder.cell().parse()
            // @ts-ignore
            const result = () => { slice.bits = [ 0, 1 ] }

            expect(result).to.throw('Cannot set property bits of #<Slice> which has only a getter')
        })
    })

    describe('#refs', () => {
        it('should get Slice refs', () => {
            const slice = builder.cell().parse()
            const result = slice.refs

            expect(result).to.eql([])
        })

        it('should throw error from changing attempt', () => {
            const slice = builder.cell().parse()
            // @ts-ignore
            const result = () => { slice.refs = [] }

            expect(result).to.throw('Cannot set property refs of #<Slice> which has only a getter')
        })
    })

    describe('#skip()', () => {
        it('should skip bits', () => {
            builder.storeBits([ 0, 0, 1, 1 ])

            const slice = builder.cell().parse()
            const result = slice.skip(2).loadBits(2)

            expect(result).to.eql([ 1, 1 ])
        })

        it('should throw error on overflow', () => {
            builder.storeBits([ 0, 0, 1, 1 ])

            const slice = builder.cell().parse()
            const result = () => slice.skip(6)

            expect(result).to.throw('Slice: skip bits overflow.')
        })
    })

    describe('#loadRef()', () => {
        it('should load ref', () => {
            const ref = new Builder().cell()

            builder.storeRef(ref)

            const slice = builder.cell().parse()
            const result1 = slice.loadRef()
            const result2 = slice.refs.length

            expect(result1).to.eq(ref)
            expect(result2).to.eq(0)
        })

        it('should load ref without splicing refs', () => {
            const ref = new Builder().cell()

            builder.storeRef(ref)

            const slice = builder.cell().parse()
            const result1 = slice.loadRef(false)
            // @ts-ignore
            const result2 = slice.refs.length

            expect(result1).to.eq(ref)
            expect(result2).to.eq(1)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result = () => slice.loadRef()

            expect(result).to.throw('Slice: refs overflow.')
        })
    })

    describe('#loadBit()', () => {
        it('should load bit', () => {
            builder.storeBit(1)

            const slice = builder.cell().parse()
            const result1 = slice.loadBit()
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(1)
            expect(result2).to.eq(0)
        })

        it('should load bit without splicing bits', () => {
            builder.storeBit(1)

            const slice = builder.cell().parse()
            const result1 = slice.loadBit(false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(1)
            expect(result2).to.eq(1)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result = () => slice.loadBit()

            expect(result).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadBits()', () => {
        it('should load bits', () => {
            builder.storeBits([ 0, 1 ])

            const slice = builder.cell().parse()
            const result1 = slice.loadBits(2)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eql([ 0, 1 ])
            expect(result2).to.eq(0)
        })

        it('should load bits without splicing bits', () => {
            builder.storeBits([ 0, 1 ])

            const slice = builder.cell().parse()
            const result1 = slice.loadBits(2, false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eql([ 0, 1 ])
            expect(result2).to.eq(2)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result = () => slice.loadBits(2)

            expect(result).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadInt()', () => {
        it('should load negative int', () => {
            const int = -14

            builder.storeInt(int, 15)

            const slice = builder.cell().parse()
            const result1 = slice.loadInt(15)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(0)
        })

        it('should load positive int', () => {
            const int = 14

            builder.storeInt(int, 15)

            const slice = builder.cell().parse()
            const result1 = slice.loadInt(15)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(0)
        })

        it('should load int without splicing bits', () => {
            const int = -14

            builder.storeInt(int, 15)

            const slice = builder.cell().parse()
            const result1 = slice.loadInt(15, false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(15)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result = () => slice.loadInt(15)

            expect(result).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadUint()', () => {
        it('should load uint', () => {
            const uint = 14

            builder.storeUint(uint, 9)

            const slice = builder.cell().parse()
            const result1 = slice.loadUint(9)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(uint)
            expect(result2).to.eq(0)
        })

        it('should load uint without splicing bits', () => {
            const uint = 14

            builder.storeUint(uint, 9)

            const slice = builder.cell().parse()
            const result1 = slice.loadUint(9, false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(uint)
            expect(result2).to.eq(9)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result = () => slice.loadUint(9)

            expect(result).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadBytes()', () => {
        it('should load bytes', () => {
            const bytes = new Uint8Array([ 255, 11, 12 ])

            builder.storeBytes(bytes)

            const slice = builder.cell().parse()
            const result1 = slice.loadBytes(bytes.byteLength * 8)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eql(bytes)
            expect(result2).to.eq(0)
        })

        it('should load bytes without splicing bits', () => {
            const bytes = new Uint8Array([ 255, 11, 12 ])

            builder.storeBytes(bytes)

            const slice = builder.cell().parse()
            const result1 = slice.loadBytes(bytes.byteLength * 8, false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eql(bytes)
            expect(result2).to.eq(bytes.byteLength * 8)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result = () => slice.loadBytes(8)

            expect(result).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadString()', () => {
        it('should load string', () => {
            const string = 'Привет, мир!'

            builder.storeString(string)

            const slice = builder.cell().parse()
            const result1 = slice.loadString()
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(0)
        })

        it('should load string with size', () => {
            const string = 'Привет, мир!'
            const size = stringToBytes(string).length * 8

            builder.storeString(string)

            const slice = builder.cell().parse()
            const result1 = slice.loadString(size)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(0)
        })

        it('should load string without splicing bits', () => {
            const string = 'Привет, мир!'
            const size = stringToBytes(string).length * 8

            builder.storeString(string)

            const slice = builder.cell().parse()
            const result1 = slice.loadString(size, false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(size)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result = () => slice.loadString()

            expect(result).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadAddress()', () => {
        it('should load Address', () => {
            const raw = '-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address = new Address(raw)

            builder.storeAddress(address)

            const slice = builder.cell().parse()
            const result1 = slice.loadAddress()
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1.toString('raw')).to.eq(raw)
            expect(result2).to.eq(0)
        })

        it('should load Address without splicing bits', () => {
            const raw = '0:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address = new Address(raw)

            builder.storeAddress(address)

            const slice = builder.cell().parse()
            const result1 = slice.loadAddress(false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1.toString('raw')).to.eq(raw)
            expect(result2).to.eq(2 + 1 + 8 + 256)
        })

        it('should load null Address with splicing bits', () => {
            builder.storeAddress(Address.NULL)

            const slice = builder.cell().parse()
            const result1 = slice.loadAddress()
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(Address.NULL)
            expect(result2).to.eq(0)
        })

        it('should load null Address without splicing bits', () => {
            builder.storeAddress(Address.NULL)

            const slice = builder.cell().parse()
            const result1 = slice.loadAddress(false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1).to.eq(Address.NULL)
            expect(result2).to.eq(2)
        })

        it('should throw error on incorrect Address flags', () => {
            builder.storeBits([ 1, 1 ])

            const slice = builder.cell().parse()
            const result = () => slice.loadAddress()

            expect(result).to.throw('Slice: bad address flag bits')
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result = () => slice.loadAddress()

            expect(result).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadCoins()', () => {
        it('should load Coins', () => {
            const coins = new Coins('100.5')

            builder.storeCoins(coins)

            const slice = builder.cell().parse()
            const result1 = slice.loadCoins()
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(0)
        })

        it('should load Coins without splicing bits', () => {
            const coins = new Coins('100.5')
            const size = BigInt(coins.toNano()).toString(16).length

            builder.storeCoins(coins)

            const slice = builder.cell().parse()
            const result1 = slice.loadCoins(false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(4 + (size * 4))
        })

        it('should load zero Coins', () => {
            const coins = new Coins('0')

            builder.storeCoins(coins)

            const slice = builder.cell().parse()
            const result1 = slice.loadCoins()
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(0)
        })

        it('should load zero Coins without splicing bits', () => {
            const coins = new Coins('0')

            builder.storeCoins(coins)

            const slice = builder.cell().parse()
            const result1 = slice.loadCoins(false)
            // @ts-ignore
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(4)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result = () => slice.loadCoins()

            expect(result).to.throw('Slice: bits overflow.')
        })
    })
})
