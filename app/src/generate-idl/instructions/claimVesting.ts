import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ClaimVestingAccounts {
  user: PublicKey
  vestingAccount: PublicKey
  grant: PublicKey
  locker: PublicKey
  tokenReceiver: PublicKey
  mintOfVestingToken: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
}

export function claimVesting(accounts: ClaimVestingAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.vestingAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.grant, isSigner: false, isWritable: true },
    { pubkey: accounts.locker, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenReceiver, isSigner: false, isWritable: true },
    { pubkey: accounts.mintOfVestingToken, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([134, 160, 202, 203, 151, 219, 16, 125])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
