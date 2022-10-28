import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateNftArgs {
  metadataTitle: string
  metadataSymbol: string
  metadataUri: string
  amount: BN
}

export interface CreateNftAccounts {
  metadata: PublicKey
  mint: PublicKey
  tokenAccount: PublicKey
  mintAuthority: PublicKey
  rent: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
  tokenMetadataProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.str("metadataTitle"),
  borsh.str("metadataSymbol"),
  borsh.str("metadataUri"),
  borsh.u64("amount"),
])

export function createNft(args: CreateNftArgs, accounts: CreateNftAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.mintAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: accounts.tokenMetadataProgram,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([231, 119, 61, 97, 217, 46, 142, 109])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      metadataTitle: args.metadataTitle,
      metadataSymbol: args.metadataSymbol,
      metadataUri: args.metadataUri,
      amount: args.amount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
