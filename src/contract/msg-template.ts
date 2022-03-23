import { Address } from '../address'
import { Coins } from '../coins'
import { Cell } from '../boc/cell'
import { Builder } from '../boc/builder'

interface ExtInMsgInfo$10Options {
    src?: Address | null
    dest?: Address
    importFee?: Coins
}

interface MessageXOptions {
    info: Cell
    init?: Cell
    body?: Cell
}

interface StateInitOptions {
    code: Cell,
    data?: Cell
}

class MsgTemplate {
    /**
     * Creates a new `CommonMsgInfo` with `ext_in_msg_info$10` prefix
     */
    public static ExtInMsgInfo$10 (options: ExtInMsgInfo$10Options): Cell {
        const { src = null, dest = null, importFee = new Coins(0) } = options

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
     * Creates a new simple StateInit without split_depth, special and library
     */
    public static StateInit (options: StateInitOptions): Cell {
        const { code = options.code, data } = options
        const builder = new Builder()

        builder.storeBits([ 0, 0, 1 ]) // split_depth: 0, special: 0, code: 1
        builder.storeRef(code)

        if (data) {
            builder.storeBit(1) // data: 1
            builder.storeRef(data)
        } else {
            builder.storeBit(0) // data: 0
        }

        builder.storeBit(0) // library: null (0 bit)

        return builder.cell()
    }

    /**
     *  Creates a new MessageX
     */
    public static MessageX (options: MessageXOptions): Cell {
        const { info = options.info, init, body } = options

        const builder = new Builder()
        builder.storeSlice(info.parse())

        if (init) {
            builder.storeBit(1)

            // -1 because we need at least 1 bit for the body
            if (builder.remainder - 1 >= init.bits.length) {
                builder.storeBit(0).storeSlice(init.parse())
            } else {
                builder.storeBit(1).storeRef(init)
            }
        } else {
            builder.storeBit(0)
        }

        if (body) {
            if (builder.remainder >= body.bits.length) {
                builder.storeBit(0).storeSlice(body.parse())
            } else {
                builder.storeBit(1).storeRef(body)
            }
        } else {
            builder.storeBit(0)
        }

        return builder.cell()
    }
}

export { MsgTemplate }
