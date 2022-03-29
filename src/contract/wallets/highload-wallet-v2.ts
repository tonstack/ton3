import { Builder } from '../../boc/builder'
import { Cell, BOC } from '../../boc'
import { MsgTemplate } from '../msg-template'
import { Address } from '../../address'
import { hexToBytes } from '../../utils/helpers'
import { nacl } from '../../utils/crypto'
import { KeyPairStruct } from '../../wallet/mnemonic'

class HighloadWalletV2Contract {
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

        // TODO: check source code and pase the link into comment
        this.code = BOC.fromStandard('B5EE9C724101090100E5000114FF00F4A413F4BCF2C80B010201200203020148040501EAF28308D71820D31FD33FF823AA1F5320B9F263ED44D0D31FD33FD3FFF404D153608040F40E6FA131F2605173BAF2A207F901541087F910F2A302F404D1F8007F8E16218010F4786FA5209802D307D43001FB009132E201B3E65B8325A1C840348040F4438AE63101C8CB1F13CB3FCBFFF400C9ED54080004D03002012006070017BD9CE76A26869AF98EB85FFC0041BE5F976A268698F98E99FE9FF98FA0268A91040207A0737D098C92DBFC95DD1F140034208040F4966FA56C122094305303B9DE2093333601926C21E2B39F9E545A')

        const initStorage = new Builder()
            .storeUint(this.subWalletID, 32)
            .storeUint(0, 64)
            .storeBytes(keyPair.publicKey)
            .storeInt(0, 1) // false 1 i,
            .cell()

        this.stateInit = MsgTemplate.StateInit({ code: this.code, data: initStorage })
        this.address = new Address(`${this.workchain}:${this.stateInit.hash()}`)
    }

    public deployExtMsg (): Cell {
        const info = MsgTemplate.ExtInMsgInfo$10({ dest: this.address })

        const timeout: number = 65536
        const now: number = ~~(Date.now() / 1000)

        const queryId = ((now + timeout) << 32) - 1

        const initMsg = new Builder()
            .storeUint(this.subWalletID, 32)
            .storeUint(queryId, 64)
            .storeInt(0, 1) // false 1 i,
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

export { HighloadWalletV2Contract }
