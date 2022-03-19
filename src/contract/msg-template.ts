import { Address } from 'address'
import { Coins } from '../coins'
import { Cell } from '../boc/cell'

class MsgTemplate {
    /**
     * Creates a new `CommonMsgInfo` with `ext_in_msg_info$10` prefix
     */
    public static ExtInMsgInfo$10 (
        dest: Address,
        src: Address = Address.NULL,
        importFee: Coins = new Coins(0)
    ): Cell {
        const cell = new Cell()

        cell.bits
            .writeBits([ 1, 0 ]) // ext_in_msg_info$10 constructor
            .writeAddress(src)
            .writeAddress(dest)
            .writeCoins(importFee)

        return cell
    }

    /**
     *  Creates a new MessageX
     */
    public static MessageX (info: Cell, init: Cell | null, body: Cell | null): Cell {
        const cell = new Cell()
        cell.bits.append(info.bits)

        if (init) {
            cell.bits.writeBit(1) // Maybe bit

            // -1 because we need at least 1 bit for the body
            if (cell.bits.remainder - 1 >= init.bits.length) {
                cell.bits.writeBit(0) // Either bit
                    .append(init.bits)
            } else {
                cell.bits.writeBit(0) // Either bit
                cell.refs.push(init)
            }
        } else {
            cell.bits.writeBit(0) // Maybe bit
        }

        if (body) {
            if (cell.bits.remainder >= init.bits.length) {
                cell.bits.writeBit(0) // Either bit
                    .append(body.bits)
            } else {
                cell.bits.writeBit(1) // Either bit
                cell.refs.push(body)
            }
        } else {
            cell.bits.writeBit(0) // minimum body bit
        }

        return cell
    }
}

export { MsgTemplate }
