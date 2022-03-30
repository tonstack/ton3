import { KeyPairStruct } from '../../wallet/mnemonic'
import { Cell } from '../../boc'
import { Address } from '../../address'

class Wallet {
    protected workchain: number

    protected _subWalletID: number

    protected _keyPair: KeyPairStruct

    protected _code: Cell

    protected _stateInit: Cell

    protected _address: Address

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
}

export { Wallet }
