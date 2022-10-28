import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MintNftArgs {
  amount: BN
}

export interface MintNftAccounts {
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

export function mintNft(args: MintNftArgs, accounts: MintNftAccounts) {
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
  const identifier = Buffer.from([211, 57, 6, 167, 15, 219, 35, 251])
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
