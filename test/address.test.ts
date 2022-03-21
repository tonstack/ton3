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
            const address = new Address(base64unsafe)
            const result = address.toString('base64', false)

            expect(result).to.equal(base64unsafe)
        })

        it('should create Address from url-safe base64', () => {
            const base64 = 'kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny'
            const address = new Address(base64)
            const result = address.toString('base64', true)

            expect(result).to.equal(base64)
        })

        it('should create Address from raw address', () => {
            const raw = '-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address = new Address(raw)
            const result = address.toString('raw')

            expect(result).to.equal(raw)
        })

        it('should create Address from 33 length bytes', () => {
            const raw = '0:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const temp = new Address(raw)
            const hash = Array.from(temp.hash)
            const worhchain = [ 0 ]
            const bytes = new Uint8Array(worhchain.concat(hash))
            const address = new Address(bytes)
            const result = address.toString('raw')

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
        it('should set and get workchain', () => {
            address.workchain = 0

            expect(address.workchain).to.equal(0)

            address.workchain = -1

            expect(address.workchain).to.equal(-1)
        })

        it('should throw error from bad input data', () => {
            const result = () => { address.workchain = -99999999 }

            expect(result).to.throw('Address: workchain must be int8.')

            // @ts-ignore
            const result2 = () => { address.workchain = 'bad_input' }

            expect(result2).to.throw('Address: workchain must be int8.')
        })
    })

    describe('#bounceable', () => {
        it('should set and get bounceable flag', () => {
            address.bounceable = false

            expect(address.bounceable).to.equal(false)

            address.bounceable = true

            expect(address.bounceable).to.equal(true)
        })

        it('should throw error from bad input data', () => {
            // @ts-ignore
            const result = () => { address.bounceable = 1 }

            expect(result).to.throw('Address: bounceable flag must be a boolean.')

            // @ts-ignore
            const result2 = () => { address.bounceable = 'bad_input' }

            expect(result2).to.throw('Address: bounceable flag must be a boolean.')
        })
    })

    describe('#testOnly', () => {
        it('should set and get testOnly flag', () => {
            address.testOnly = false

            expect(address.testOnly).to.equal(false)

            address.testOnly = true

            expect(address.testOnly).to.equal(true)
        })

        it('should throw error from bad input data', () => {
            // @ts-ignore
            const result = () => { address.testOnly = 1 }

            expect(result).to.throw('Address: testOnly flag must be a boolean.')

            // @ts-ignore
            const result2 = () => { address.testOnly = 'bad_input' }

            expect(result2).to.throw('Address: testOnly flag must be a boolean.')
        })
    })

    describe('#toString()', () => {
        it('should return non url-safe base64 address with non bounceable and non testOnly tag', () => {
            address.bounceable = false
            address.testOnly = false

            const result = address.toString('base64', false)

            expect(result).to.equal('Uf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYG+9')
        })

        it('should return url-safe base64 address by default', () => {
            const result = address.toString()
            address.bounceable = true
            address.testOnly = true

            expect(result).to.equal('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')
        })

        it('should return url-safe base64 address', () => {
            const result = address.toString('base64', true)

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
