import './App.css';
import { PropsWithChildren, useState } from 'react';
import { Commitment, Connection, PublicKey, clusterApiUrl, SystemProgram, Keypair } from '@solana/web3.js';
import { Program, AnchorProvider, Provider, Idl } from '@project-serum/anchor';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, Coin98WalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider, AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton, useWalletModal } from '@solana/wallet-adapter-react-ui';
import idl from './idl.json';

import '@solana/wallet-adapter-react-ui/styles.css';

// const programID = new PublicKey(IDL.metadata.address);

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
const App = () => {
  const IDL: Idl = idl as Idl
  const wallets = [
    /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
    new PhantomWalletAdapter(),
    new Coin98WalletAdapter(),
  ]

  // const baseAccount = Keypair.generate();
  const opts = {
    preflightCommitment: "finalized" as Commitment // "processed"
  }

  const network = clusterApiUrl(WalletAdapterNetwork.Devnet);

  // const anchorWallet = useAnchorWallet() as AnchorWallet
  // async function getProvider() {
  //   const connection = new Connection(network, opts.preflightCommitment);

  //   const provider = new AnchorProvider(
  //     connection, anchorWallet, AnchorProvider.defaultOptions(),
  //   );
  //   return provider;
  // }

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

const AppContent = () => {
  const { publicKey, connected, disconnect } = useWallet();
  if (!connected) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div className="App">

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
          <WalletMultiButton />
        </div>
        <br />
        <button style={{ color: '#fff', backgroundColor: '#111' }} type='button' onClick={disconnect}>
          DISCONNECT
        </button>
      </div>
    );
  }
}

const App2 = () => {
  const { publicKey, connected, disconnect } = useWallet();

  return <>
    {connected ? (
      <>
        <p>Account: {publicKey?.toBase58()}</p>
        <button type='button' onClick={disconnect}>Disconnect</button>
        <button>Sign</button>
      </>
    ) : (
      <ButtonConnectWallet />
    )}
  </>
}

const ButtonConnectWallet = () => {
  const { setVisible } = useWalletModal();

  const handleWalletClick = () => {
    // console.log('wallet2', useWallet());
    setVisible(true);
  }
  return <>
    <div>
      <button onClick={handleWalletClick}>Connect</button>
    </div>
  </>
}

export default App;
