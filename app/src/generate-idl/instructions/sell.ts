import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SellArgs {
  saleLamports: BN
  amount: BN
}

export interface SellAccounts {
  mint: PublicKey
  ownerTokenAccount: PublicKey
  ownerAuthority: PublicKey
  buyerTokenAccount: PublicKey
  buyerAuthority: PublicKey
  rent: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("saleLamports"),
  borsh.u64("amount"),
])

export function sell(args: SellArgs, accounts: SellAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.mint, isSigner: false, isWritable: true },
    { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.ownerAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.buyerTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.buyerAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([51, 230, 133, 164, 1, 127, 131, 173])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      saleLamports: args.saleLamports,
      amount: args.amount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
