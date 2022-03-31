import { Builder } from '../../boc/builder'
import { Cell, BOC } from '../../boc'
import { MsgTemplate } from '../msg-template'
import { Address } from '../../address'
import { KeyPairStruct } from '../../wallet/mnemonic'
import { Wallet, WalletTransfer } from './wallet'

class WalletV3Contract extends Wallet {
    constructor (
        workchain: number,
        subWalletID: number,
        keyPair: KeyPairStruct
    ) {
        super()
        this.errors = { transfersOverflow: 'transfersOverflow: WalletV3 transfers must be <= 4' }

        this.workchain = workchain
        this._subWalletID = subWalletID
        this._keyPair = keyPair
        this._transfers = []

        // TODO: check source code and pase the link into comment
        this._code = BOC.fromStandard('B5EE9C724101010100710000DEFF0020DD2082014C97BA218201339CBAB19F71B0ED44D0D31FD31F31D70BFFE304E0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED5410BD6DAD')

        this._stateInit = MsgTemplate.StateInit({
            code: this._code,
            data: new Builder() // init storage
                .storeUint(0, 32)
                .storeUint(this._subWalletID, 32)
                .storeBytes(keyPair.publicKey)
                .cell()
        })

        this._address = new Address(`${this.workchain}:${this._stateInit.hash()}`)
    }

    public addTransfers (transfers: WalletTransfer[]): void {
        if ((this._transfers.length + transfers.length) > 4) {
            throw new Error(this.errors.transfersOverflow)
        }
        transfers.forEach((t) => { this._transfers.push(t) })
    }

    private sigMessageB (validUntil: number, seqno: number): Builder {
        const msg = new Builder()

        msg.storeUint(this._subWalletID, 32)

        if (validUntil < 0) {
            msg.storeInt(-1, 32)
        } else {
            msg.storeUint(validUntil, 32)
        }

        msg.storeUint(seqno, 32)

        return msg
    }

    public static simpleTextMsg (text: string): Cell {
        return new Builder().storeUint(0, 32).storeString(text).cell()
    }

    public sendTransfersExtMsg (
        seqno: number,
        timeout: number = 60,
        cleanUp: boolean = true
    ): Cell {
        const msg = new Builder()
            .storeUint(this._subWalletID, 32)
            .storeUint(~~(Date.now() / 1000) + timeout, 32) // valid until
            .storeUint(seqno, 32)

        this._transfers.forEach((t) => {
            msg.storeUint(t.mode, 8)
            msg.storeRef(MsgTemplate.MessageX({
                info: MsgTemplate.IntMsgInfo$0({
                    bounce: t.destination.bounceable,
                    src: Address.NONE,
                    dest: t.destination,
                    value: t.amount
                }),
                body: t.body
            }))
        })

        if (cleanUp) { this.cleanUpTransfers() }

        return MsgTemplate.MessageX({
            info: MsgTemplate.ExtInMsgInfo$10({ dest: this._address }),
            init: this._stateInit,
            body: this.addSign(msg.cell())
        })
    }

    public deployExtMsg (): Cell {
        return MsgTemplate.MessageX({
            info: MsgTemplate.ExtInMsgInfo$10({ dest: this._address }),
            init: this._stateInit,
            body: this.addSign(
                new Builder()
                    .storeUint(this._subWalletID, 32)
                    .storeInt(-1, 32) // valid until
                    .storeUint(0, 32) // seqno
                    .cell()
            )
        })
    }
}

export { WalletV3Contract }
