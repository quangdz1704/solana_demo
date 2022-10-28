import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateVestingArgs {
  schedule: Array<BN>
  percents: Array<BN>
  denominator: BN
  isPaused: boolean
}

export interface UpdateVestingAccounts {
  authorizer: PublicKey
  vestingAccount: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.vec(borsh.i64(), "schedule"),
  borsh.vec(borsh.u64(), "percents"),
  borsh.u64("denominator"),
  borsh.bool("isPaused"),
])

export function updateVesting(
  args: UpdateVestingArgs,
  accounts: UpdateVestingAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authorizer, isSigner: true, isWritable: true },
    { pubkey: accounts.vestingAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([219, 58, 102, 253, 162, 84, 142, 191])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      schedule: args.schedule,
      percents: args.percents,
      denominator: args.denominator,
      isPaused: args.isPaused,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
