import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AddGrantArgs {
  user: PublicKey
  amount: BN
}

export interface AddGrantAccounts {
  authorizer: PublicKey
  vestingAccount: PublicKey
  grant: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.publicKey("user"),
  borsh.u64("amount"),
])

export function addGrant(args: AddGrantArgs, accounts: AddGrantAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authorizer, isSigner: true, isWritable: true },
    { pubkey: accounts.vestingAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.grant, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([89, 14, 253, 21, 96, 207, 236, 110])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      user: args.user,
      amount: args.amount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
