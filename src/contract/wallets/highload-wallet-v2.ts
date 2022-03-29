import { Bit, Builder } from '../../boc/builder'
import { Cell, BOC } from '../../boc'
import { MsgTemplate } from '../msg-template'
import { Address } from '../../address'
import { hexToBytes } from '../../utils/helpers'
import { nacl } from '../../utils/crypto'
import { KeyPairStruct } from '../../wallet/mnemonic'
import { Coins } from '../../coins'
import { Hashmap } from '../../boc/hashmap'

interface HighloadWalletV2Transfer {
    destination: Address
    comment: string
    amount: Coins
    mode: number
}

class HighloadWalletV2Contract {
    private workchain: number

    private _subWalletID: number

    private _keyPair: KeyPairStruct

    private _code: Cell

    private _stateInit: Cell

    private _address: Address

    private _transfers: HighloadWalletV2Transfer[]

    constructor (
        workchain: number,
        subWalletID: number,
        keyPair: KeyPairStruct
    ) {
        this.workchain = workchain
        this._subWalletID = subWalletID
        this._keyPair = keyPair
        this._transfers = []

        this._code = BOC.fromStandard('B5EE9C724101090100E5000114FF00F4A413F4BCF2C80B010201200203020148040501EAF28308D71820D31FD33FF823AA1F5320B9F263ED44D0D31FD33FD3FFF404D153608040F40E6FA131F2605173BAF2A207F901541087F910F2A302F404D1F8007F8E16218010F4786FA5209802D307D43001FB009132E201B3E65B8325A1C840348040F4438AE63101C8CB1F13CB3FCBFFF400C9ED54080004D03002012006070017BD9CE76A26869AF98EB85FFC0041BE5F976A268698F98E99FE9FF98FA0268A91040207A0737D098C92DBFC95DD1F140034208040F4966FA56C122094305303B9DE2093333601926C21E2B39F9E545A')

        const initStorage = new Builder()
            .storeInt(this.subWalletID, 32)
            .storeUint(0, 64)
            .storeBytes(keyPair.publicKey)
            .storeInt(0, 1) // false 1 i,
            .cell()

        this._stateInit = MsgTemplate.StateInit({ code: this.code, data: initStorage })
        this._address = new Address(`${this.workchain}:${this._stateInit.hash()}`)
    }

    // --------- get methods ---------
    public get subWalletID (): number {
        return this._subWalletID
    }

    public get keyPair (): KeyPairStruct {
        return this._keyPair
    }

    public get code (): Cell {
        return this._code
    }

    public get stateInit (): Cell {
        return this._stateInit
    }

    public get address (): Address {
        return this._address
    }

    public get transfers (): HighloadWalletV2Transfer[] {
        return this._transfers
    }
    // -------------------------------

    public addTransfer (transfer: HighloadWalletV2Transfer): void {
        this._transfers.push(transfer)
    }

    public addTransfers (transfers: HighloadWalletV2Transfer[]): void {
        transfers.forEach((t) => {
            this.addTransfer(t)
        })
    }

    private static genQueryId (timeout: number): bigint {
        const now: number = ~~(Date.now() / 1000)
        return (BigInt((now + timeout)) << 32n) - 1n
    }

    public sendTransfersExtMsg (timeout: number = 60): Cell {
        const serializers = {
            key: (k: number): Bit[] => new Builder().storeUint(k, 16).bits,
            value: (v: HighloadWalletV2Transfer): Cell => {
                const info = new Builder()
                    .storeUint(v.mode, 8)
                    .storeRef(MsgTemplate.IntMsgInfo$0({
                        bounce: v.destination.bounceable,
                        src: Address.NULL,
                        dest: v.destination,
                        value: v.amount
                    })).cell()

                const body = new Builder().storeUint(0, 32).storeString(v.comment).cell()

                return MsgTemplate.MessageX({ info, body })
            }
        }

        const hashmap = new Hashmap<number, HighloadWalletV2Transfer>({ serializers })

        this._transfers.forEach((transfer, i) => {
            hashmap.set(i, transfer)
        })

        const queryId = HighloadWalletV2Contract.genQueryId(timeout)

        const msg = new Builder()
            .storeInt(this._subWalletID, 32)
            .storeUint(queryId, 64)
            .storeBit(1) // hme_root$1
            .storeRef(hashmap.cell())
            .cell()

        const sing = nacl.sign.detached(hexToBytes(msg.hash()), this.keyPair.privateKey.full)

        const signedMsg = new Builder().storeBytes(sing).storeSlice(msg.parse()).cell()

        const info = MsgTemplate.ExtInMsgInfo$10({ dest: this._address })
        const msgx = MsgTemplate.MessageX({ info, body: signedMsg })

        return msgx
    }

    public deployExtMsg (): Cell {
        const info = MsgTemplate.ExtInMsgInfo$10({ dest: this._address })

        const queryId = HighloadWalletV2Contract.genQueryId(65536)

        const initMsg = new Builder()
            .storeInt(this.subWalletID, 32)
            .storeUint(queryId, 64)
            .storeInt(0, 1) // false 1 i,
            .cell()

        const sing = nacl.sign.detached(hexToBytes(initMsg.hash()), this.keyPair.privateKey.full)

        const signedMsg = new Builder()
            .storeBytes(sing)
            .storeSlice(initMsg.parse())
            .cell()

        const msgx = MsgTemplate.MessageX({ info, init: this._stateInit, body: signedMsg })

        return msgx
    }
}

export { HighloadWalletV2Contract, HighloadWalletV2Transfer }
