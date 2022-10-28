import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MintTokenArgs {
  amount: BN
}

export interface MintTokenAccounts {
  mint: PublicKey
  tokenAccount: PublicKey
  tokenAccountAuthority: PublicKey
  mintAuthority: PublicKey
  rent: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
}

export const layout = borsh.struct([borsh.u64("amount")])

export function mintToken(args: MintTokenArgs, accounts: MintTokenAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.mint, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAccount, isSigner: false, isWritable: true },
    {
      pubkey: accounts.tokenAccountAuthority,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.mintAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([172, 137, 183, 14, 207, 110, 234, 56])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amount: args.amount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
