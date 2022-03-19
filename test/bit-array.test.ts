import { expect } from 'chai'
import { Bit, BitArray } from '../src/boc/bit-array'

describe('BitArray bit manipulation tests', () => {
    it('should write bits as writeBit', () => {
        const myCell: BitArray = new BitArray()
        const bits: Bit[] = [ 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1 ]

        for (let i = 0; i < bits.length; i += 1) {
            myCell.writeBit(bits[i])
        }

        expect(myCell.getBits())
            .to
            .eql(bits)
    })

    it('should bits overflow as writeBit', () => {
        const myCell: BitArray = new BitArray()
        const bits: Bit[] = new Array(1023 + 1).fill(0)

        for (let i = 0; i < bits.length; i += 1) {
            try {
                myCell.writeBit(bits[i])
            } catch (e) {
                expect(e.message)
                    .to
                    .equal("BitArray overflow. Can't add new bits.")
            }
        }
    })

    it('should write bits as writeBitArray', () => {
        const myCell: BitArray = new BitArray()
        const bits: Bit[] = [ 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1 ]

        myCell.writeBits(bits)

        expect(myCell.getBits())
            .to
            .eql(bits)
    })

    it('should bits overflow as writeBitArray', () => {
        const myCell: BitArray = new BitArray()
        const bits: Bit[] = new Array(1023 + 1).fill(0)

        try {
            myCell.writeBits(bits)
        } catch (e) {
            expect(e.message)
                .to
                .equal("BitArray overflow. Can't add new bits.")
        }
    })
})
