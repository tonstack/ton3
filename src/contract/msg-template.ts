import { Address } from 'address'
import { Coins } from '../coins'
import { Cell } from '../boc/cell'
import { Builder } from '../boc/builder'

class MsgTemplate {
    /**
     * Creates a new `CommonMsgInfo` with `ext_in_msg_info$10` prefix
     */
    public static ExtInMsgInfo$10 (
        dest: Address,
        src: Address = Address.NULL,
        importFee: Coins = new Coins(0)
    ): Cell {
        const builder = new Builder()
        const cell = builder
            .storeBits([ 1, 0 ]) // ext_in_msg_info$10 constructor
            .storeAddress(src)
            .storeAddress(dest)
            .storeCoins(importFee)
            .cell()

        return cell
    }

    /**
     *  Creates a new MessageX
     */
    public static MessageX (info: Cell, init: Cell | null, body: Cell | null): Cell {
        const builder = new Builder()

        builder.storeBits(info.bits)

        if (init) {
            builder.storeBit(1) // Maybe bit

            // -1 because we need at least 1 bit for the body
            if (builder.remainder - 1 >= init.bits.length) {
                builder.storeBit(0) // Either bit
                    .storeBits(init.bits)
            } else {
                builder.storeBit(0) // Either bit
                    .storeRef(init)
            }
        } else {
            builder.storeBit(0) // Maybe bit
        }

        if (body) {
            if (builder.remainder >= init.bits.length) {
                builder.storeBit(0) // Either bit
                    .storeBits(body.bits)
            } else {
                builder.storeBit(1) // Either bit
                    .storeRef(body)
            }
        } else {
            builder.storeBit(0) // minimum body bit
        }

        return builder.cell()
    }
}

export { MsgTemplate }
