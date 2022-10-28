import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface GrantFields {
  totalAmount: BN
  claimedAmount: BN
  bump: number
}

export interface GrantJSON {
  totalAmount: string
  claimedAmount: string
  bump: number
}

export class Grant {
  readonly totalAmount: BN
  readonly claimedAmount: BN
  readonly bump: number

  static readonly discriminator = Buffer.from([
    161, 166, 11, 205, 204, 135, 205, 54,
  ])

  static readonly layout = borsh.struct([
    borsh.u64("totalAmount"),
    borsh.u64("claimedAmount"),
    borsh.u8("bump"),
  ])

  constructor(fields: GrantFields) {
    this.totalAmount = fields.totalAmount
    this.claimedAmount = fields.claimedAmount
    this.bump = fields.bump
  }

  static async fetch(c: Connection, address: PublicKey): Promise<Grant | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<Grant | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): Grant {
    if (!data.slice(0, 8).equals(Grant.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Grant.layout.decode(data.slice(8))

    return new Grant({
      totalAmount: dec.totalAmount,
      claimedAmount: dec.claimedAmount,
      bump: dec.bump,
    })
  }

  toJSON(): GrantJSON {
    return {
      totalAmount: this.totalAmount.toString(),
      claimedAmount: this.claimedAmount.toString(),
      bump: this.bump,
    }
  }

  static fromJSON(obj: GrantJSON): Grant {
    return new Grant({
      totalAmount: new BN(obj.totalAmount),
      claimedAmount: new BN(obj.claimedAmount),
      bump: obj.bump,
    })
  }
}
