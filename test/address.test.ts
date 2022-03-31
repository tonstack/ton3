import { expect } from 'chai'
import { Address } from '../src/address'

describe('Address', () => {
    let address: Address

    beforeEach(() => {
        address = new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')
    })

    describe('#constructor()', () => {
        it('should create Address from another Address', () => {
            const raw = '0:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address1 = new Address(raw)
            const address2 = new Address(address1)
            const result = address2.toString('raw')

            expect(result).to.equal(raw)
        })

        it('should create Address from non url-safe base64', () => {
            const base64unsafe = 'kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny'
            const address1 = new Address(base64unsafe)
            const result = address1.toString('base64', { urlSafe: false })

            expect(result).to.equal(base64unsafe)
        })

        it('should create Address from url-safe base64', () => {
            const base64 = 'kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny'
            const address1 = new Address(base64)
            const result = address1.toString('base64', { urlSafe: true })

            expect(result).to.equal(base64)
        })

        it('should create Address from raw address', () => {
            const raw = '-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address1 = new Address(raw)
            const result = address1.toString('raw')

            expect(result).to.equal(raw)
        })

        it('should throw error from bad input data', () => {
            const result1 = () => new Address('bad_input')
            const result2 = () => new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYInz')
            const result3 = () => new Address('ov_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYMg3')

            expect(result1).to.throw('Address: can\'t parse address. Unknown type.')
            expect(result2).to.throw('Address: can\'t parse address. Wrong hashsum.')
            expect(result3).to.throw('Address: bad address tag.')
        })
    })

    describe('#hash', () => {
        it('should get address hash', () => {
            const result = address.hash

            expect(result.length).to.equal(32)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { address.hash = new Uint8Array() }

            expect(result).to.throw('Cannot set property hash of [object Object] which has only a getter')
        })
    })

    describe('#workchain', () => {
        it('should get address workchain', () => {
            const result = address.workchain

            expect(result).to.equal(-1)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { address.workchain = 0 }

            expect(result).to.throw('Cannot set property workchain of [object Object] which has only a getter')
        })
    })

    describe('#bounceable', () => {
        it('should get address bounceable flag', () => {
            const result = address.bounceable

            expect(result).to.equal(true)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { address.bounceable = false }

            expect(result).to.throw('Cannot set property bounceable of [object Object] which has only a getter')
        })
    })

    describe('#testOnly', () => {
        it('should get address testOnly flag', () => {
            const result = address.testOnly

            expect(result).to.equal(true)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { address.testOnly = false }

            expect(result).to.throw('Cannot set property testOnly of [object Object] which has only a getter')
        })
    })

    describe('#toString()', () => {
        it('should return non url-safe base64 address in workchain 0 with non bounceable and non testOnly flags', () => {
            const result = address.toString('base64', {
                workchain: 0,
                bounceable: false,
                testOnly: false,
                urlSafe: false
            })

            expect(result).to.equal('UQD8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYJD1')
        })

        it('should return url-safe base64 address by default', () => {
            const result = address.toString()

            expect(result).to.equal('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')
        })

        it('should return url-safe base64 address', () => {
            const result = address.toString('base64', { urlSafe: true })

            expect(result).to.equal('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')
        })

        it('should return raw address', () => {
            const result = address.toString('raw')

            expect(result).to.equal('-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260')
        })
    })

    describe('#isValid()', () => {
        it('should validate base64 non url-safe address', () => {
            const result = Address.isValid('kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny')

            expect(result).to.equal(true)
        })

        it('should validate base64 url-safe address', () => {
            const result = Address.isValid('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')

            expect(result).to.equal(true)
        })

        it('should validate base64 raw address', () => {
            const result = Address.isValid('-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260')

            expect(result).to.equal(true)
        })

        it('should invalidate bad address', () => {
            const result = Address.isValid('bad_address')

            expect(result).to.equal(false)
        })
    })
})
