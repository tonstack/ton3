import { Builder } from '../boc/builder'
import { Cell, BOC } from '../boc'
import { MsgTemplate } from './msg-template'
import { Address } from '../address'
import { hexToBytes } from '../utils/helpers'
import { nacl } from '../utils/crypto'

class WalletContract {
    public workchain: number

    public privateKey: Uint8Array

    public publicKey: Uint8Array

    public code: Cell

    public initStorage: Cell

    public stateInit: Cell

    public address: Address

    public subWalletID: number

    constructor (
        workchain: number,
        privateKey: Uint8Array,
        publicKey: Uint8Array,
        subWalletID: number
    ) {
        this.workchain = workchain
        this.privateKey = publicKey
        this.publicKey = publicKey
        this.subWalletID = subWalletID

        const codeCell = BOC.fromStandard('B5EE9C724101010100710000DEFF0020DD2082014C97BA218201339CBAB19F71B0ED44D0D31FD31F31D70BFFE304E0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED5410BD6DAD')
        this.code = new Builder().storeSlice(codeCell.parse()).cell()

        this.initStorage = new Builder()
            .storeUint(0, 32)
            .storeUint(this.subWalletID, 32)
            .storeBytes(publicKey)
            .cell()

        this.stateInit = MsgTemplate.StateInit({ code: this.code, data: this.initStorage })
        this.address = new Address(`${this.workchain}:${this.stateInit.hash()}`)
    }

    public deployExtMsg (): string {
        const info = MsgTemplate.ExtInMsgInfo$10({ dest: this.address })

        const date = new Date()
        const timestamp = Math.floor(date.getTime() / 1e3)

        const initMsg = new Builder()
            .storeUint(this.subWalletID, 32)
            .storeInt(timestamp + 120, 32) // valid until
            .storeUint(0, 32) // seqno
            .cell()

        const simKeyPair = nacl.sign.keyPair.fromSeed(this.privateKey)
        const sing = nacl.sign.detached(hexToBytes(initMsg.hash()), simKeyPair.secretKey)

        const signedMsg = new Builder()
            .storeBytes(sing)
            .storeSlice(initMsg.parse())
            .cell()

        const msgx = MsgTemplate.MessageX({ info, init: this.initStorage, body: signedMsg })

        return BOC.toHexStandard(msgx)
    }
}

export { WalletContract }
