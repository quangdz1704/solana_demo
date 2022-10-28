import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface WithdrawLockerAccounts {
  authorizer: PublicKey
  vestingAccount: PublicKey
  locker: PublicKey
  tokenReceiver: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
}

export function withdrawLocker(accounts: WithdrawLockerAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authorizer, isSigner: true, isWritable: true },
    { pubkey: accounts.vestingAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.locker, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenReceiver, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([72, 145, 235, 166, 31, 194, 1, 93])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
