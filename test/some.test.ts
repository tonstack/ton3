import { expect } from 'chai'
import { Address } from '../src/address'
import { BOC, Builder } from '../src/boc'
import { MsgTemplate } from '../src/contract/msg-template'
import { nacl } from '../src/utils/crypto'
import { bytesToHex, hexToBytes } from '../src/utils/helpers'
import { KeyPair } from '../src/wallet/keypair'

describe('Some', () => {
    it('some test', () => {
        const walletCodeCell = BOC.fromStandard('B5EE9C724101010100620000C0FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED543FBE6EE0')

        const keyPair = new KeyPair('', [
            'gown', 'forest', 'thrive',
            'business', 'ivory', 'news',
            'dinner', 'alcohol', 'item',
            'swim', 'grunt', 'almost',
            'candy', 'dry', 'give',
            'release', 'six', 'excuse',
            'egg', 'vague', 'brisk',
            'poem', 'vicious', 'canoe'
        ])

        // console.log(`keyPair: ${bytesToHex(keyPair.privateKey)}`)
        // console.log(`keyPair: ${bytesToHex(keyPair.publicKey)}`)

        const subwallet: number = 0
        const initStorage = new Builder()
            .storeUint(0, 32) // seqno
            .storeUint(subwallet, 32) // subwallet id
            .storeBytes(keyPair.publicKey)
            .cell()
        console.log(`initStorage hash: ${initStorage.hash()}`)
        const stateInit = MsgTemplate.StateInit({ code: walletCodeCell, data: initStorage })
        console.log(`stateInit hash: ${stateInit.hash()}`)
        const address = new Address(`${0}:${stateInit.hash()}`)

        console.log(`DEBUG: ${address.toString('base64', true)}`)
        address.bounceable = true
        console.log(`DEBUG: ${address.toString('base64', true)}`)

        const info = MsgTemplate.ExtInMsgInfo$10({ dest: address })

        const initMsg = new Builder().storeUint(subwallet, 32)

        for (let i = 0; i < 32; i += 1) {
            initMsg.storeBit(1)
        }

        const initMsgCell = initMsg.storeUint(0, 32).cell()
        console.log(`initMsg hash: ${initMsgCell.hash()}`)

        const naclKeyPair = nacl.sign.keyPair.fromSeed(keyPair.privateKey)
        const sing = nacl.sign.detached(hexToBytes(initMsgCell.hash()), naclKeyPair.secretKey)
        console.log(`sing: ${bytesToHex(sing)}`)
        const signedMsg = new Builder()
            .storeBytes(sing)
            .storeSlice(initMsgCell.parse())
            .cell()

        console.log(`signedMsg hash ${signedMsg.hash()}`)
        const msgx = MsgTemplate.MessageX({ info, init: initStorage, body: signedMsg })
        console.log(BOC.toHexStandard(msgx))
        // const codeCell = BOC.fromStandard('B5EE9C7241010501002B00010EFF00F80088FB04010114FF00F4A413F4BCF2C80B0202016203040004D0300011A0171D04200EB79A2B278F6836')

        // const initStorage = new Builder()
        //     .storeUint(134, 32) // random huita
        //     .cell()

        // const stateInit = MsgTemplate.StateInit({ code: codeCell, data: initStorage })
        // const address = new Address(`${0}:${stateInit.hash()}`)

        // const info = MsgTemplate.ExtInMsgInfo$10({ dest: address })

        // const msgx = MsgTemplate.MessageX({ info, init: stateInit, body: null })

        expect(1).to.equal(1)
    })
})
