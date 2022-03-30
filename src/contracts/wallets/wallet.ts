import { Coins } from 'coins'
import { KeyPairStruct } from '../../wallet/mnemonic'
import { Builder, Cell } from '../../boc'
import { Address } from '../../address'
import { hexToBytes } from '../../utils/helpers'
import { nacl } from '../../utils/crypto'

interface WalletTransfer {
    destination: Address
    amount: Coins
    body: Cell
    mode: number
}

class Wallet {
    protected errors: { [errorName: string]: string }

    protected workchain: number

    protected _subWalletID: number

    protected _keyPair: KeyPairStruct

    protected _code: Cell

    protected _stateInit: Cell

    protected _address: Address

    protected _transfers: WalletTransfer[]

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

    public get transfers (): WalletTransfer[] {
        return this._transfers
    }
    // -------------------------------

    public cleanUpTransfers (): void {
        this._transfers = []
    }

    protected signMsg (cell: Cell): Uint8Array {
        return nacl.sign.detached(
            hexToBytes(cell.hash()),
            this._keyPair.privateKey.full
        )
    }

    protected addSign (msg: Cell): Cell {
        return new Builder()
            .storeBytes(this.signMsg(msg))
            .storeSlice(msg.parse())
            .cell()
    }
}

export { Wallet, WalletTransfer }
