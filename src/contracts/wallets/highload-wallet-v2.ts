import { Builder } from '../../boc/builder'
import { Cell, BOC } from '../../boc'
import { MsgTemplate } from '../msg-template'
import { Address } from '../../address'
import { KeyPairStruct } from '../../wallet/mnemonic'
import { Wallet, WalletTransfer } from './wallet'
import { HashmapE } from '../../boc/hashmap'

class HighloadWalletV2Contract extends Wallet {
    constructor (
        workchain: number,
        subWalletID: number,
        keyPair: KeyPairStruct
    ) {
        super()
        this.errors = { transfersOverflow: 'transfersOverflow: HighloadWalletV2 transfers must be <= 100' }

        this.workchain = workchain
        this._subWalletID = subWalletID
        this._keyPair = keyPair
        this._transfers = []

        this._code = BOC.fromStandard('B5EE9C724101090100E5000114FF00F4A413F4BCF2C80B010201200203020148040501EAF28308D71820D31FD33FF823AA1F5320B9F263ED44D0D31FD33FD3FFF404D153608040F40E6FA131F2605173BAF2A207F901541087F910F2A302F404D1F8007F8E16218010F4786FA5209802D307D43001FB009132E201B3E65B8325A1C840348040F4438AE63101C8CB1F13CB3FCBFFF400C9ED54080004D03002012006070017BD9CE76A26869AF98EB85FFC0041BE5F976A268698F98E99FE9FF98FA0268A91040207A0737D098C92DBFC95DD1F140034208040F4966FA56C122094305303B9DE2093333601926C21E2B39F9E545A')

        const initStorage = new Builder()
            .storeUint(this.subWalletID, 32) //     stored_subwallet
            .storeUint(0, 64) //                    last_cleaned
            .storeBytes(keyPair.publicKey) //       public_key
            .storeDict(new HashmapE()) //           old_queries
            .cell()

        this._stateInit = MsgTemplate.StateInit({ code: this.code, data: initStorage })
        this._address = new Address(`${this.workchain}:${this._stateInit.hash()}`)
    }

    private static genQueryId (timeout: number): bigint {
        const now: number = ~~(Date.now() / 1000)
        return (BigInt((now + timeout)) << 32n) - 1n
    }

    public addTransfers (transfers: WalletTransfer[]): void {
        // Sending more than 100 messages from Highload Wallet V2
        // may result in magical circumstances
        if ((this._transfers.length + transfers.length) > 100) {
            throw new Error(this.errors.transfersOverflow)
        }
        transfers.forEach((t) => { this._transfers.push(t) })
    }

    public sendTransfersExtMsg (timeout: number = 60, cleanUp: boolean = true): Cell {
        const serializers = {
            key: (k: number): Bit[] => new Builder().storeInt(k, 16).bits,
            value: (v: WalletTransfer): Cell => new Builder()
                .storeUint(v.mode, 8) // send mode
                .storeRef(MsgTemplate.MessageX({
                    info: MsgTemplate.IntMsgInfo$0({
                        bounce: v.destination.bounceable,
                        src: Address.NONE,
                        dest: v.destination,
                        value: v.amount
                    }),
                    body: v.body
                })).cell()
        }

        const dict = new HashmapE<number, WalletTransfer>({ serializers })
        this._transfers.forEach((transfer, i) => { dict.set(i, transfer) })
        if (cleanUp) { this.cleanUpTransfers() }

        return MsgTemplate.MessageX({
            info: MsgTemplate.ExtInMsgInfo$10({ dest: this._address }),
            body: this.addSign(new Builder()
                .storeUint(this.subWalletID, 32)
                .storeUint(HighloadWalletV2Contract.genQueryId(timeout), 64)
                .storeDict(dict)
                .cell())
        })
    }

    public deployExtMsg (): Cell {
        return MsgTemplate.MessageX({
            info: MsgTemplate.ExtInMsgInfo$10({ dest: this._address }),
            init: this._stateInit,
            body: this.addSign(
                new Builder()
                    .storeUint(this.subWalletID, 32) // subwallet_id
                    .storeUint(HighloadWalletV2Contract.genQueryId(2 ** 16), 64) // query_id
                    .storeDict(new HashmapE())
                    .cell()
            )
        })
    }
}

export { HighloadWalletV2Contract }
