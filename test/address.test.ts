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
            const hash = Array.from(temp.getHash())
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

            expect(result1).to.throw('Can\'t parse address. Unknown type')
            expect(result2).to.throw('Can\'t parse address. Wrong hashsum.')
            expect(result3).to.throw('Bad address tag')
        })
    })

    describe('#toString()', () => {
        it('should return non url-safe base64 address with non bounceable tag', () => {
            const result = address.setBounceableFlag(false).toString('base64', false)

            expect(result).to.equal('0f/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYNQ3')
        })

        it('should return url-safe base64 address by default', () => {
            const result = address.toString()

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

    describe('#setWorkchain()', () => {
        it('should set workchain', () => {
            const workchain = 0
            const result = address.setWorkchain(workchain).getWorkchain()

            expect(result).to.equal(workchain)

            const workchain2 = -1
            const result2 = address.setWorkchain(workchain2).getWorkchain()

            expect(result2).to.equal(workchain2)
        })

        it('should throw error from bad input data', () => {
            const result = () => address.setWorkchain(-99999999)

            expect(result).to.throw('Workchain ID must be int8')

            // @ts-ignore
            const result2 = () => address.setWorkchain('bad_input')

            expect(result2).to.throw('Workchain ID must be int8')
        })
    })

    describe('#setBounceableFlag()', () => {
        it('should set bounceable flag', () => {
            const flag = false
            const result = address.setBounceableFlag(flag).isBounceable()

            expect(result).to.equal(flag)

            const flag2 = true
            const result2 = address.setBounceableFlag(flag2).isBounceable()

            expect(result2).to.equal(flag2)
        })

        it('should throw error from bad input data', () => {
            // @ts-ignore
            const result = () => address.setBounceableFlag('bad_data')

            expect(result).to.throw('Bounceable flag must be a boolean')
        })
    })

    describe('#setTestOnlyFlag()', () => {
        it('should set test only flag', () => {
            const flag = false
            const result = address.setTestOnlyFlag(flag).isTestOnly()

            expect(result).to.equal(flag)

            const flag2 = true
            const result2 = address.setTestOnlyFlag(flag2).isTestOnly()

            expect(result2).to.equal(flag2)
        })

        it('should throw error from bad input data', () => {
            // @ts-ignore
            const result = () => address.setTestOnlyFlag('bad_data')

            expect(result).to.throw('TestOnly flag must be a boolean')
        })
    })

    describe('#getHash()', () => {
        it('should get address hash', () => {
            const result = Array.from(address.getHash())

            expect(result.length).to.equal(32)
        })
    })

    describe('#getWorkchain()', () => {
        it('should get address workchain', () => {
            const workchain = 10
            const result = address.setWorkchain(workchain).getWorkchain()

            expect(result).to.equal(workchain)
        })
    })

    describe('#isBounceable()', () => {
        it('should show if address is bounceable', () => {
            const flag = false
            const result = address.setBounceableFlag(flag).isBounceable()

            expect(result).to.equal(flag)
        })
    })

    describe('#isTestOnly()', () => {
        it('should show if address is test only', () => {
            const flag = false
            const result = address.setTestOnlyFlag(flag).isTestOnly()

            expect(result).to.equal(flag)
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
