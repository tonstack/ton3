import { Builder } from '../boc/builder'
import { Cell, BOC } from '../boc'
import { MsgTemplate } from './msg-template'
import { Address } from '../address'
import { hexToBytes } from '../utils/helpers'
import { nacl } from '../utils/crypto'
import { KeyPairStruct } from '../wallet/mnemonic'

class WalletContract {
    public workchain: number

    public subWalletID: number

    public keyPair: KeyPairStruct

    public code: Cell

    public stateInit: Cell

    public address: Address

    constructor (
        workchain: number,
        subWalletID: number,
        keyPair: KeyPairStruct
    ) {
        this.workchain = workchain
        this.subWalletID = subWalletID
        this.keyPair = keyPair

        this.code = BOC.fromStandard('B5EE9C724101010100710000DEFF0020DD2082014C97BA218201339CBAB19F71B0ED44D0D31FD31F31D70BFFE304E0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED5410BD6DAD')

        const initStorage = new Builder()
            .storeUint(0, 32)
            .storeUint(this.subWalletID, 32)
            .storeBytes(keyPair.publicKey)
            .cell()

        this.stateInit = MsgTemplate.StateInit({ code: this.code, data: initStorage })
        this.address = new Address(`${this.workchain}:${this.stateInit.hash()}`)
    }

    public deployExtMsg (): Cell {
        const info = MsgTemplate.ExtInMsgInfo$10({ dest: this.address })

        const initMsg = new Builder()
            .storeUint(this.subWalletID, 32)
            .storeInt(-1, 32) // valid until
            .storeUint(0, 32) // seqno
            .cell()

        const sing = nacl.sign.detached(hexToBytes(initMsg.hash()), this.keyPair.privateKey.full)

        const signedMsg = new Builder()
            .storeBytes(sing)
            .storeSlice(initMsg.parse())
            .cell()

        const msgx = MsgTemplate.MessageX({ info, init: this.stateInit, body: signedMsg })

        return msgx
    }
}

export { WalletContract }
