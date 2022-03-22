import { expect } from 'chai'
import { TextEncoder } from 'util'
import { Cell, Builder, Bit } from '../src/boc'
import { bytesToBits } from '../src/utils/helpers'
import { Address } from '../src/address'
import { Coins } from '../src/coins'

describe('Builder', () => {
    let builder: Builder

    beforeEach(() => {
        builder = new Builder(1023)
    })

    describe('#constructor()', () => {
        it('should create Builder', () => {
            const result = new Builder()

            expect(result).to.be.instanceOf(Builder)
        })

        it('should create Builder of fixed size', () => {
            const result = new Builder(2)

            expect(result).to.be.instanceOf(Builder)
            expect(result.size).to.eq(2)
        })
    })

    describe('#size', () => {
        it('should get Builder size', () => {
            const result = builder.size

            expect(result).to.eq(1023)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { builder.size = 22 }

            expect(result).to.throw('Cannot set property size of #<Builder> which has only a getter')
        })
    })

    describe('#bits', () => {
        it('should get Builder bits', () => {
            const result = builder.bits

            expect(result).to.eql([])
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { builder.bits = [ 0, 1 ] }

            expect(result).to.throw('Cannot set property bits of #<Builder> which has only a getter')
        })
    })

    describe('#bytes', () => {
        it('should get Builder bytes', () => {
            const result = builder.bytes

            expect(result).to.eql(new Uint8Array())
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { builder.bytes = new Uint8Array() }

            expect(result).to.throw('Cannot set property bytes of #<Builder> which has only a getter')
        })
    })

    describe('#refs', () => {
        it('should get Builder refs', () => {
            const result = builder.refs

            expect(result).to.eql([])
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { builder.refs = [] }

            expect(result).to.throw('Cannot set property refs of #<Builder> which has only a getter')
        })
    })

    describe('#remainder', () => {
        it('should get Builder remainder', () => {
            const result = builder.remainder

            expect(result).to.eq(1023)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { builder.remainder = 0 }

            expect(result).to.throw('Cannot set property remainder of #<Builder> which has only a getter')
        })
    })


    describe('#storeSlice()', () => {
        it('should store Slice', () => {
            const ref = new Builder().cell()
            const slice = new Builder()
                .storeBits([ 0, 1 ])
                .storeRef(ref)
                .cell()
                .parse()

            builder.storeSlice(slice)

            expect(builder.bits).to.eql([ 0, 1 ])
            expect(builder.refs.length).to.eq(1)
        })

        it('should throw error on overflow bits', () => {
            const builder = new Builder(3).storeBits([ 0, 1 ])
            const slice = new Builder()
                .storeBits([ 0, 1 ])
                .cell()
                .parse()

            const result = () => builder.storeSlice(slice)

            expect(result).to.throw('Builder: bits overflow. Can\'t add 2 bits. Only 1 bits left.')
        })

        it('should throw error on overflow refs', () => {
            const ref = new Builder().cell()

            builder.storeRef(ref)
                .storeRef(ref)
                .storeRef(ref)

            const slice = new Builder()
                .storeRef(ref)
                .storeRef(ref)
                .cell()
                .parse()

            const result = () => builder.storeSlice(slice)

            expect(result).to.throw('Builder: refs overflow. Can\'t add 2 refs. Only 1 refs left.')
        })
    })

    describe('#storeRef()', () => {
        it('should store ref', () => {
            const ref = new Builder().cell()
            const result = builder.storeRef(ref)

            expect(result.refs[0]).to.eq(ref)
            expect(result.refs.length).to.eq(1)
        })

        it('should throw error on overflow', () => {
            const ref = new Builder().cell()

            builder.storeRef(ref)
                .storeRef(ref)
                .storeRef(ref)
                .storeRef(ref)

            const result = () => builder.storeRef(ref)

            expect(result).to.throw('Builder: refs overflow. Can\'t add 1 refs. Only 0 refs left.')
        })
    })

    describe('#storeBit()', () => {
        it('should store bit', () => {
            const result = builder.storeBit(1)

            expect(result.bits[0]).to.eq(1)
            expect(result.bits.length).to.eq(1)
        })

        it('should throw error on bad data', () => {
            // @ts-ignore
            const result1 = () => builder.storeBit("1")
            // @ts-ignore
            const result2 = () => builder.storeBit(-1)
            // @ts-ignore
            const result3 = () => builder.storeBit(null)

            expect(result1).to.throw('Builder: can\'t store bit, because it\'s type not Number or value doesn\'t equals 0 nor 1.')
            expect(result2).to.throw('Builder: can\'t store bit, because it\'s type not Number or value doesn\'t equals 0 nor 1.')
            expect(result3).to.throw('Builder: can\'t store bit, because it\'s type not Number or value doesn\'t equals 0 nor 1.')
        })

        it('should throw error on overflow', () => {
            const builder = new Builder(1).storeBit(1)
            const result = () => builder.storeBit(1)

            expect(result).to.throw('Builder: bits overflow. Can\'t add 1 bits. Only 0 bits left.')
        })
    })

    describe('#storeBits()', () => {
        it('should store bits', () => {
            const bits = [ 1, 0, 1, 0 ] as Bit[]
            const result = builder.storeBits(bits)

            expect(result.bits).to.eql(bits)
            expect(result.bits.length).to.eq(4)
        })

        it('should throw error on overflow', () => {
            const builder = new Builder(4).storeBits([ 1, 0, 1, 0 ])
            const result = () => builder.storeBits([ 1, 0 ])

            expect(result).to.throw('Builder: bits overflow. Can\'t add 2 bits. Only 0 bits left.')
        })
    })

    describe('#storeInt()', () => {
        it('should store negative int', () => {
            const int = -14
            const bits = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0 ]
            const result = builder.storeInt(int, bits.length)

            expect(result.bits).to.eql(bits)
            expect(result.bits.length).to.eq(bits.length)
        })

        it('should store positive int', () => {
            const int = 14
            const bits = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0 ]
            const result = builder.storeInt(int, bits.length)

            expect(result.bits).to.eql(bits)
            expect(result.bits.length).to.eq(bits.length)
        })

        it('should throw error on overflow', () => {
            const result = () => builder.storeInt(14, 1)

            expect(result).to.throw('Builder: can\'t store an Int, because its value allocates more space than provided.')
        })
    })

    describe('#storeUint()', () => {
        it('should store uint', () => {
            const uint = 14
            const bits = [ 0, 0, 0, 0, 0, 1, 1, 1, 0 ]
            const result = builder.storeUint(uint, bits.length)

            expect(result.bits).to.eql(bits)
            expect(result.bits.length).to.eq(bits.length)
        })

        it('should throw error on overflow', () => {
            const result = () => builder.storeUint(14, 1)

            expect(result).to.throw('Builder: can\'t store an UInt, because its value allocates more space than provided.')
        })
    })

    describe('#storeBytes()', () => {
        it('should store bytes', () => {
            const bytes = new Uint8Array([ 255, 11, 12 ])
            const result = builder.storeBytes(bytes)

            expect(result.bytes).to.eql(bytes)
            expect(result.bytes.length).to.eq(bytes.length)
        })
    })

    describe('#storeString()', () => {
        it('should store string', () => {
            const string = 'Привет, мир!'
            const result = builder.storeString(string)
            const encoded = new TextEncoder().encode(string)

            expect(result.bytes).to.eql(encoded)
        })
    })

    describe('#storeAddress()', () => {
        it('should store Address', () => {
            const raw = '0:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address = new Address(raw)
            const result = builder.storeAddress(address)

            expect(result.bits).to.eql([ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...bytesToBits(address.hash) ])
        })

        it('should store null Address', () => {
            const result = builder.storeAddress(Address.NULL)

            expect(result.bits).to.eql([ 0, 0 ])
            expect(result.bits.length).to.eq(2)
        })
    })

    describe('#storeCoins()', () => {
        it('should store Coins', () => {
            const coins = new Coins('100.5')
            const result = builder.storeCoins(coins)
                .cell()
                .parse()
                .loadCoins()

            expect(result.toString()).to.eql(coins.toString())
        })

        it('should store zero Coins', () => {
            const coins = new Coins('0')
            const result = builder.storeCoins(coins)

            expect(result.bits).to.eql([ 0, 0, 0, 0 ])
            expect(result.bits.length).to.eq(4)
        })

        it('should throw error on negative Coins value', () => {
            const coins = new Coins('-100.5')
            const result = () => builder.storeCoins(coins)

            expect(result).to.throw('Builder: coins value can\'t be negative.')
        })
    })

    describe('#clone()', () => {
        it('should clone Builder', () => {
            const ref = new Builder().cell()
            const builder = new Builder(6).storeBits([ 0, 1, 0, 1 ]).storeRef(ref)
            const result = builder.clone()

            expect(result.size).to.eq(builder.size)
            expect(result.bits).to.eql(builder.bits)
            expect(result.bits.length).to.eq(builder.bits.length)
            expect(result.refs).to.eql(builder.refs)
            expect(result.refs.length).to.eq(builder.refs.length)
            

            builder.storeBits([ 0, 1 ])
                .storeRef(ref)

            expect(result.bits).to.not.eql(builder.bits)
            expect(result.bits.length).to.not.eq(builder.bits.length)
            expect(result.refs).to.not.eql(builder.refs)
            expect(result.refs.length).to.not.eq(builder.refs.length)
        })
    })

    describe('#augmentBits()', () => {
        it('should augment bits', () => {
            const bits = [ 1, 0, 1, 0, 1, 0, 1, 0, 1 ] as Bit[]
            const result1 = Builder.augmentBits(bits)
            const result2 = Builder.augmentBits(bits, 8)
            const result3= Builder.augmentBits(bits, 4)

            expect(result1).to.eql([ ...bits, ...[ 1, 0, 0, 0, 0, 0, 0 ] ])
            expect(result2).to.eql([ ...bits, ...[ 1, 0, 0, 0, 0, 0, 0 ] ])
            expect(result3).to.eql([ ...bits, ...[ 1, 0, 0 ] ])
        })

        it('should not augment bits', () => {
            const bits1 = [ 1, 0, 1, 0, 1, 0, 1, 0 ] as Bit[]
            const bits2 = [ 1, 0, 1, 0 ] as Bit[]
            const result1 = Builder.augmentBits(bits1, 8)
            const result2 = Builder.augmentBits(bits2, 4)

            expect(result1).to.eql(bits1)
            expect(result2).to.eql(bits2)
        })
    })

    describe('#rollbackBits()', () => {
        it('should rollback bits', () => {
            const bits = [ 0, 1, 1, 0, 0, 0, 0, 0 ] as Bit[]
            const result = Builder.rollbackBits(bits)

            expect(result).to.eql([ 0, 1 ])
        })

        it('should throw error on incorrectly augmented bits', () => {
            const bits = [ 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] as Bit[]
            const result = () => Builder.rollbackBits(bits)

            expect(result).to.throw('Builder: incorrectly augmented bits.')
        })
    })

    describe('#cell()', () => {
        it('should build Cell', () => {
            const ref = new Builder().cell()
            const result = new Builder()
                .storeBits([ 1, 0 ])
                .storeRef(ref)
                .cell()

            expect(result).to.be.instanceOf(Cell)
            expect(result.bits).to.eql([ 1, 0 ])
            expect(result.refs).to.eql([ ref ])
        })
    })
})
