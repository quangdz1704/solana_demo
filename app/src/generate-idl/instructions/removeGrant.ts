import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RemoveGrantArgs {
  user: PublicKey
}

export interface RemoveGrantAccounts {
  authorizer: PublicKey
  vestingAccount: PublicKey
  grant: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.publicKey("user")])

export function removeGrant(
  args: RemoveGrantArgs,
  accounts: RemoveGrantAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authorizer, isSigner: true, isWritable: true },
    { pubkey: accounts.vestingAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.grant, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([180, 108, 213, 18, 243, 24, 141, 142])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      user: args.user,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
