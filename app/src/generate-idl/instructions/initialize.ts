import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeArgs {
  round: string
  schedule: Array<BN>
  percents: Array<BN>
  denominator: BN
}

export interface InitializeAccounts {
  initializer: PublicKey
  mintOfVestingToken: PublicKey
  locker: PublicKey
  vestingAccount: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.str("round"),
  borsh.vec(borsh.i64(), "schedule"),
  borsh.vec(borsh.u64(), "percents"),
  borsh.u64("denominator"),
])

export function initialize(args: InitializeArgs, accounts: InitializeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.initializer, isSigner: true, isWritable: true },
    { pubkey: accounts.mintOfVestingToken, isSigner: false, isWritable: false },
    { pubkey: accounts.locker, isSigner: false, isWritable: true },
    { pubkey: accounts.vestingAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      round: args.round,
      schedule: args.schedule,
      percents: args.percents,
      denominator: args.denominator,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
