import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface VestingFields {
  round: string
  authorizer: PublicKey
  isPaused: boolean
  mintOfVestingToken: PublicKey
  totalVestedAmount: BN
  totalClaimedAmount: BN
  schedule: Array<BN>
  percents: Array<BN>
  denominator: BN
}

export interface VestingJSON {
  round: string
  authorizer: string
  isPaused: boolean
  mintOfVestingToken: string
  totalVestedAmount: string
  totalClaimedAmount: string
  schedule: Array<string>
  percents: Array<string>
  denominator: string
}

export class Vesting {
  readonly round: string
  readonly authorizer: PublicKey
  readonly isPaused: boolean
  readonly mintOfVestingToken: PublicKey
  readonly totalVestedAmount: BN
  readonly totalClaimedAmount: BN
  readonly schedule: Array<BN>
  readonly percents: Array<BN>
  readonly denominator: BN

  static readonly discriminator = Buffer.from([
    100, 149, 66, 138, 95, 200, 128, 241,
  ])

  static readonly layout = borsh.struct([
    borsh.str("round"),
    borsh.publicKey("authorizer"),
    borsh.bool("isPaused"),
    borsh.publicKey("mintOfVestingToken"),
    borsh.u64("totalVestedAmount"),
    borsh.u64("totalClaimedAmount"),
    borsh.vec(borsh.i64(), "schedule"),
    borsh.vec(borsh.u64(), "percents"),
    borsh.u64("denominator"),
  ])

  constructor(fields: VestingFields) {
    this.round = fields.round
    this.authorizer = fields.authorizer
    this.isPaused = fields.isPaused
    this.mintOfVestingToken = fields.mintOfVestingToken
    this.totalVestedAmount = fields.totalVestedAmount
    this.totalClaimedAmount = fields.totalClaimedAmount
    this.schedule = fields.schedule
    this.percents = fields.percents
    this.denominator = fields.denominator
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<Vesting | null> {
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
  ): Promise<Array<Vesting | null>> {
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

  static decode(data: Buffer): Vesting {
    if (!data.slice(0, 8).equals(Vesting.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Vesting.layout.decode(data.slice(8))

    return new Vesting({
      round: dec.round,
      authorizer: dec.authorizer,
      isPaused: dec.isPaused,
      mintOfVestingToken: dec.mintOfVestingToken,
      totalVestedAmount: dec.totalVestedAmount,
      totalClaimedAmount: dec.totalClaimedAmount,
      schedule: dec.schedule,
      percents: dec.percents,
      denominator: dec.denominator,
    })
  }

  toJSON(): VestingJSON {
    return {
      round: this.round,
      authorizer: this.authorizer.toString(),
      isPaused: this.isPaused,
      mintOfVestingToken: this.mintOfVestingToken.toString(),
      totalVestedAmount: this.totalVestedAmount.toString(),
      totalClaimedAmount: this.totalClaimedAmount.toString(),
      schedule: this.schedule.map((item) => item.toString()),
      percents: this.percents.map((item) => item.toString()),
      denominator: this.denominator.toString(),
    }
  }

  static fromJSON(obj: VestingJSON): Vesting {
    return new Vesting({
      round: obj.round,
      authorizer: new PublicKey(obj.authorizer),
      isPaused: obj.isPaused,
      mintOfVestingToken: new PublicKey(obj.mintOfVestingToken),
      totalVestedAmount: new BN(obj.totalVestedAmount),
      totalClaimedAmount: new BN(obj.totalClaimedAmount),
      schedule: obj.schedule.map((item) => new BN(item)),
      percents: obj.percents.map((item) => new BN(item)),
      denominator: new BN(obj.denominator),
    })
  }
}
