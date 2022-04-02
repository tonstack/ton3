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

    describe('#loadRef(), #preloadRef()', () => {
        it('should load ref', () => {
            const ref = new Builder().cell()

            builder.storeRef(ref)

            const slice = builder.cell().parse()
            const result1 = slice.loadRef()
            const result2 = slice.refs.length

            expect(result1).to.eq(ref)
            expect(result2).to.eq(0)
        })

        it('should preload ref without splicing refs', () => {
            const ref = new Builder().cell()

            builder.storeRef(ref)

            const slice = builder.cell().parse()
            const result1 = slice.preloadRef()
            const result2 = slice.refs.length

            expect(result1).to.eq(ref)
            expect(result2).to.eq(1)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result1 = () => slice.loadRef()
            const result2 = () => slice.preloadRef()

            expect(result1).to.throw('Slice: refs overflow.')
            expect(result2).to.throw('Slice: refs overflow.')
        })
    })

    describe('#loadBit(), #preloadBit()', () => {
        it('should load bit', () => {
            builder.storeBit(1)

            const slice = builder.cell().parse()
            const result1 = slice.loadBit()
            const result2 = slice.bits.length

            expect(result1).to.eq(1)
            expect(result2).to.eq(0)
        })

        it('should preload bit without splicing bits', () => {
            builder.storeBit(1)

            const slice = builder.cell().parse()
            const result1 = slice.preloadBit()
            const result2 = slice.bits.length

            expect(result1).to.eq(1)
            expect(result2).to.eq(1)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result1 = () => slice.loadBit()
            const result2 = () => slice.preloadBit()

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadBits(), #preloadBits()', () => {
        it('should load bits', () => {
            builder.storeBits([ 0, 1 ])

            const slice = builder.cell().parse()
            const result1 = slice.loadBits(2)
            const result2 = slice.bits.length

            expect(result1).to.eql([ 0, 1 ])
            expect(result2).to.eq(0)
        })

        it('should preload bits without splicing bits', () => {
            builder.storeBits([ 0, 1 ])

            const slice = builder.cell().parse()
            const result1 = slice.preloadBits(2)
            const result2 = slice.bits.length

            expect(result1).to.eql([ 0, 1 ])
            expect(result2).to.eq(2)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result1 = () => slice.loadBits(2)
            const result2 = () => slice.loadBits(2)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadInt(), #preloadInt()', () => {
        it('should load negative int', () => {
            const int = -14

            builder.storeInt(int, 15)

            const slice = builder.cell().parse()
            const result1 = slice.loadInt(15)
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(0)
        })

        it('should load positive int', () => {
            const int = 14

            builder.storeInt(int, 15)

            const slice = builder.cell().parse()
            const result1 = slice.loadInt(15)
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(0)
        })

        it('should preload negative int without splicing bits', () => {
            const int = -14

            builder.storeInt(int, 15)

            const slice = builder.cell().parse()
            const result1 = slice.preloadInt(15)
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(15)
        })

        it('should preload positive int without splicing bits', () => {
            const int = 14

            builder.storeInt(int, 15)

            const slice = builder.cell().parse()
            const result1 = slice.preloadInt(15)
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(15)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result1 = () => slice.loadInt(15)
            const result2 = () => slice.preloadInt(15)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadUint(), #preloadUint()', () => {
        it('should load uint', () => {
            const uint = 14

            builder.storeUint(uint, 9)

            const slice = builder.cell().parse()
            const result1 = slice.loadUint(9)
            const result2 = slice.bits.length

            expect(result1).to.eq(uint)
            expect(result2).to.eq(0)
        })

        it('should preload uint without splicing bits', () => {
            const uint = 14

            builder.storeUint(uint, 9)

            const slice = builder.cell().parse()
            const result1 = slice.preloadUint(9)
            const result2 = slice.bits.length

            expect(result1).to.eq(uint)
            expect(result2).to.eq(9)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result1 = () => slice.loadUint(9)
            const result2 = () => slice.preloadUint(9)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadBytes(), #preloadBytes()', () => {
        it('should load bytes', () => {
            const bytes = new Uint8Array([ 255, 11, 12 ])

            builder.storeBytes(bytes)

            const slice = builder.cell().parse()
            const result1 = slice.loadBytes(bytes.byteLength * 8)
            const result2 = slice.bits.length

            expect(result1).to.eql(bytes)
            expect(result2).to.eq(0)
        })

        it('should preload bytes without splicing bits', () => {
            const bytes = new Uint8Array([ 255, 11, 12 ])

            builder.storeBytes(bytes)

            const slice = builder.cell().parse()
            const result1 = slice.preloadBytes(bytes.byteLength * 8)
            const result2 = slice.bits.length

            expect(result1).to.eql(bytes)
            expect(result2).to.eq(bytes.byteLength * 8)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result1 = () => slice.loadBytes(8)
            const result2 = () => slice.loadBytes(8)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadString(), #preloadString()', () => {
        it('should load string', () => {
            const string = 'Привет, мир!'

            builder.storeString(string)

            const slice = builder.cell().parse()
            const result1 = slice.loadString()
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
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(0)
        })

        it('should preload string without splicing bits', () => {
            const string = 'Привет, мир!'
            const size = stringToBytes(string).length * 8

            builder.storeString(string)

            const slice = builder.cell().parse()
            const result1 = slice.preloadString()
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(size)
        })

        it('should preload string with size without splicing bits', () => {
            const string = 'Привет, мир!'
            const size = stringToBytes(string).length * 8

            builder.storeString(string)

            const slice = builder.cell().parse()
            const result1 = slice.preloadString(size)
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(size)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result1 = () => slice.loadString()
            const result2 = () => slice.preloadString()

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadAddress(), #preloadAddress()', () => {
        it('should load Address', () => {
            const raw = '-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address = new Address(raw)

            builder.storeAddress(address)

            const slice = builder.cell().parse()
            const result1 = slice.loadAddress()
            const result2 = slice.bits.length

            expect(result1.toString('raw')).to.eq(raw)
            expect(result2).to.eq(0)
        })

        it('should load null Address with splicing bits', () => {
            builder.storeAddress(Address.NONE)

            const slice = builder.cell().parse()
            const result1 = slice.loadAddress()
            const result2 = slice.bits.length

            expect(result1).to.eq(Address.NONE)
            expect(result2).to.eq(0)
        })

        it('should preload Address without splicing bits', () => {
            const raw = '0:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address = new Address(raw)

            builder.storeAddress(address)

            const slice = builder.cell().parse()
            const result1 = slice.preloadAddress()
            const result2 = slice.bits.length

            expect(result1.toString('raw')).to.eq(raw)
            expect(result2).to.eq(2 + 1 + 8 + 256)
        })

        it('should preload null Address without splicing bits', () => {
            builder.storeAddress(Address.NONE)

            const slice = builder.cell().parse()
            const result1 = slice.preloadAddress()
            const result2 = slice.bits.length

            expect(result1).to.eq(Address.NONE)
            expect(result2).to.eq(2)
        })

        it('should throw error on incorrect Address flags', () => {
            builder.storeBits([ 1, 1 ])

            const slice = builder.cell().parse()
            const result1 = () => slice.loadAddress()
            const result2 = () => slice.preloadAddress()

            expect(result1).to.throw('Slice: bad address flag bits')
            expect(result2).to.throw('Slice: bad address flag bits')
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result1 = () => slice.loadAddress()
            const result2 = () => slice.preloadAddress()

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadCoins(), #preloadCoins()', () => {
        it('should load Coins', () => {
            const coins = new Coins('100.5')

            builder.storeCoins(coins)

            const slice = builder.cell().parse()
            const result1 = slice.loadCoins()
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(0)
        })

        it('should load zero Coins', () => {
            const coins = new Coins('0')

            builder.storeCoins(coins)

            const slice = builder.cell().parse()
            const result1 = slice.loadCoins()
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(0)
        })

        it('should preload Coins without splicing bits', () => {
            const coins = new Coins('100.5')
            const size = BigInt(coins.toNano()).toString(16).length

            builder.storeCoins(coins)

            const slice = builder.cell().parse()
            const result1 = slice.preloadCoins()
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(4 + (size * 4))
        })

        it('should preload zero Coins without splicing bits', () => {
            const coins = new Coins('0')

            builder.storeCoins(coins)

            const slice = builder.cell().parse()
            const result1 = slice.preloadCoins()
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(4)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().parse()
            const result1 = () => slice.loadCoins()
            const result2 = () => slice.loadCoins()

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })
})
