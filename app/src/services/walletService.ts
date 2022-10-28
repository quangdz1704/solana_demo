import * as anchor from '@project-serum/anchor';
import { createBurnInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import type { AnchorWallet } from '@solana/wallet-adapter-react';
import {
  ConfirmOptions,
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';
import vestingidl from '../idl.json';
import { GRANT_PDA_SEED, LOCKER_PDA_SEED, VESTING_PDA_SEED } from '../constants/solana';
import type { PhantomProvider } from '../interfaces/PhantomProvider';

interface PDAParam {
  key: anchor.web3.PublicKey;
  bump: number;
}

const vestingIdl = vestingidl as anchor.Idl

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new anchor.web3.PublicKey('');

export default class WalletService {
  connection: Connection;
  anchorWallet: AnchorWallet | undefined;
  publicKey: PublicKey | undefined;
  signatures: Array<Uint8Array> | undefined;

  constructor(props: any) {
    this.connection = props?.connection;
  }

  getProvider = ({
    connection,
    anchorWallet,
  }: {
    connection: Connection;
    anchorWallet: AnchorWallet;
  }): PhantomProvider | anchor.AnchorProvider | undefined => {
    return new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions());
  };

  getVestingPDA = async (program: { programId: PublicKey }, mint: { toBuffer: () => any }, round: string) => {
    const [pda, bump] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode(VESTING_PDA_SEED), mint.toBuffer(), anchor.utils.bytes.utf8.encode(round)],
      program.programId,
    );

    return {
      key: pda,
      bump: bump,
    };
  };

  getLockerPDA = async (program: { programId: PublicKey }, mint: { toBuffer: () => any }, round: string) => {
    const [pda, bump] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode(LOCKER_PDA_SEED), mint.toBuffer(), anchor.utils.bytes.utf8.encode(round)],
      program.programId,
    );

    return {
      key: pda,
      bump: bump,
    };
  };

  getGrantPDA = async (
    program: any,
    vestingAccount: anchor.web3.PublicKey,
    user: anchor.web3.PublicKey,
  ): Promise<PDAParam> => {
    const [pda, bump] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode(GRANT_PDA_SEED), vestingAccount.toBuffer(), user.toBuffer()],
      program.programId,
    );

    return {
      key: pda,
      bump: bump,
    };
  };

  getBalance = async ({ publicKey }: { publicKey: PublicKey }) => {
    const balance = await this.connection.getBalance(publicKey);
    return balance;
  };

  getSigners(signerOrMultisig: Signer | PublicKey, multiSigners: Signer[]): [PublicKey, Signer[]] {
    return signerOrMultisig instanceof PublicKey
      ? [signerOrMultisig, multiSigners]
      : [signerOrMultisig.publicKey, [signerOrMultisig]];
  }

  getTokenWallet = async (
    wallet: anchor.web3.PublicKey,
    programId: Uint8Array | Buffer,
    mint: anchor.web3.PublicKey,
  ) => {
    return (
      await anchor.web3.PublicKey.findProgramAddress(
        [wallet.toBuffer(), programId, mint.toBuffer()],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      )
    )[0];
  };

  getDataState = async (
    anchorWallet: anchor.Wallet,
    programId: anchor.web3.PublicKey,
    connection: anchor.web3.Connection,
  ): Promise<any> => {
    const provider = anchor.getProvider();
    const program = new anchor.Program(vestingIdl, vestingIdl.metadata.address, provider);

    // const state: any = await program.account.vesting.fetch(programId);
    const state = program.account.vesting.programId;
    const claimVesting = program.methods?.claimVesting;

    const grant = state;
    const vesting = state;

    return {
      grant,
      vesting,
    };
  };

  getSignMessage = async ({ message }: { message: string }) => {
    const signMessage = new TextEncoder().encode(message);
    return signMessage;
  };

  async burnSqlToken(
    connection: Connection,
    payer: Signer,
    account: PublicKey,
    mint: PublicKey,
    owner: Signer | PublicKey,
    amount: number | bigint,
    multiSigners: Signer[] = [],
    confirmOptions?: ConfirmOptions,
    programId = TOKEN_PROGRAM_ID,
  ): Promise<TransactionSignature> {
    const [ownerPublicKey, signers] = this.getSigners(owner, multiSigners);

    const transaction = new Transaction().add(
      createBurnInstruction(account, mint, ownerPublicKey, amount, multiSigners, programId),
    );

    return await sendAndConfirmTransaction(connection, transaction, [payer, ...signers], confirmOptions);
  }
}

/**
 * List of function on @solana spl/token
 *
 * @param amountToUiAmount - Amount as a string using mint-prescribed decimals / @return Ui Amount generated
 * @param approve - Approve a delegate to transfer up to a maximum number of tokens from an account / @return Signature of the confirmed transaction
 * @param approveChecked - Approve a delegate to transfer up to a maximum number of tokens from an account, asserting the token mint and decimals / @return Signature of the confirmed transaction
 * @param burn - Burn tokens from an account / @return Signature of the confirmed transaction
 * @param burnChecked - Burn tokens from an account, asserting the token mint and decimals / @return Signature of the confirmed transaction
 * @param closeAccount  - Close a token account / @return Signature of the confirmed transaction
 * @param createAccount - Create and initialize a new token account / @return Address of the new token account
 * @param createAssociatedTokenAccount - Create and initialize a new associated token account / @return Address of the new associated token account
 * @param createMint - Create and initialize a new mint / @return Address of the new mint
 * @param createMultisig - Create and initialize a new multisig / @return Address of the new multisig
 * @param createNativeMint - Create native mint
 * @param createWrappedNativeAccount - Create, initialize, and fund a new wrapped native SOL account / @return Address of the new wrapped native SOL account
 * @param freezeAccount - Freeze a token account / @return Signature of the confirmed transaction
 * @param getOrCreateAssociatedTokenAccount - Retrieve the associated token account, or create it if it doesn't exist / @return Address of the new associated token account
 * @param mintTo - Mint tokens to an account / @return Signature of the confirmed transaction
 * @param mintToChecked - Mint tokens to an account, asserting the token mint and decimals / @return Signature of the confirmed transaction
 * @param revoke - Revoke approval for the transfer of tokens from an account / @return Signature of the confirmed transaction
 * @param setAuthority - Assign a new authority to the account / @return Signature of the confirmed transaction
 * @param syncNative - Sync the balance of a native SPL token account to the underlying system account's lamports / @return Signature of the confirmed transaction
 * @param thawAccount - Thaw (unfreeze) a token account / @return Signature of the confirmed transaction
 * @param transfer - Transfer tokens from one account to another / @return Signature of the confirmed transaction
 * @param transferChecked - Transfer tokens from one account to another, asserting the token mint and decimals / @return Signature of the confirmed transaction
 * @param uiAmountToAmount - Amount as a string using mint-prescribed decimals / @return Ui Amount generated
 *
 * @return Signature of the confirmed transaction
 */
