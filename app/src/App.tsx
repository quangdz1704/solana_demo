import React from 'react';
import './App.css';
import Connect2Phantom from './components/Connect2Phantom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana Examples</h1>
        <hr className="fullWidth" />

        <p>Hello there</p>
        <Connect2Phantom />

      </header>
    </div>
  );
}

export default App;






// import React, { useMemo } from "react";
// import { clusterApiUrl } from "@solana/web3.js";
// import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
// import {
//   ConnectionProvider,
//   WalletProvider,
// } from "@solana/wallet-adapter-react";
// import { CoinbaseWalletAdapter, PhantomWalletAdapter, SlopeWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";
// function App() {
//   // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'. Const network = WalletAdapterNetwork.Devnet;
//   // You can also provide a custom RPC endpoint.
//   const endpoint = useMemo(() => clusterApiUrl(network), [network]); console.log(endpoint);
//   //wallet connection Error handling
//   const walletConnectionErr = (error = WalletError) => {
//     console.log("Wallet Connection Error:", error);
//   };
//   const wallet = useMemo(() => [new PhantomWalletAdapter(), new CoinbaseWalletAdapter(), new SlopeWalletAdapter(), new
//     TorusWalletAdapter(), new SolflareWalletAdapter({ network })], [network]);
//   return (
//     <></>
//   );
// }
// export default App;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <div className="App">
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src="/vite.svg" className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://reactjs.org" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </div>
//   )
// }

// export default App


// import './App.css';
// import { useState } from 'react';
// import { Connection, PublicKey } from '@solana/web3.js';
// import {
//   Program, Provider, web3
// } from '@project-serum/anchor';
// import idl from './idl.json';

// import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
// import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
// import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// require('@solana/wallet-adapter-react-ui/styles.css');

// const wallets = [
//   /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
//   new PhantomWalletAdapter()
// ]

// const { SystemProgram, Keypair } = web3;
// /* create an account  */
// const baseAccount = Keypair.generate();
// const opts = {
//   preflightCommitment: "processed"
// }
// const programID = new PublicKey(idl.metadata.address);

// function App() {
//   const [value, setValue] = useState(null);
//   const wallet = useWallet();

//   async function getProvider() {
//     /* create the provider and return it to the caller */
//     /* network set to local network for now */
//     // const network = "http://127.0.0.1:8899";
//     const network = "https://api.devnet.solana.com";
//     const connection = new Connection(network, opts.preflightCommitment);

//     const provider = new Provider(
//       connection, wallet, opts.preflightCommitment,
//     );
//     return provider;
//   }

//   async function createCounter() {
//     const provider = await getProvider()
//     /* create the program interface combining the idl, program ID, and provider */
//     const program = new Program(idl, programID, provider);
//     try {
//       /* interact with the program via rpc */
//       await program.rpc.create({
//         accounts: {
//           baseAccount: baseAccount.publicKey,
//           user: provider.wallet.publicKey,
//           systemProgram: SystemProgram.programId,
//         },
//         signers: [baseAccount]
//       });

//       const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
//       console.log('account: ', account);
//       setValue(account.count.toString());
//     } catch (err) {
//       console.log("Transaction error: ", err);
//     }
//   }

//   async function increment() {
//     const provider = await getProvider();
//     const program = new Program(idl, programID, provider);
//     await program.rpc.increment({
//       accounts: {
//         baseAccount: baseAccount.publicKey
//       }
//     });

//     const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
//     console.log('account: ', account);
//     setValue(account.count.toString());
//   }

//   if (!wallet.connected) {
//     /* If the user's wallet is not connected, display connect wallet button. */
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
//         <WalletMultiButton />
//       </div>
//     )
//   } else {
//     return (
//       <div className="App">
//         <div>
//           {
//             !value && (<button onClick={createCounter}>Create counter</button>)
//           }
//           {
//             value && <button onClick={increment}>Increment counter</button>
//           }

//           {
//             value && value >= Number(0) ? (
//               <h2>{value}</h2>
//             ) : (
//               <h3>Please create the counter.</h3>
//             )
//           }
//         </div>
//       </div>
//     );
//   }
// }

// /* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
// const AppWithProvider = () => (
//   <ConnectionProvider endpoint="http://127.0.0.1:8899">
//     <WalletProvider wallets={wallets} autoConnect>
//       <WalletModalProvider>
//         <App />
//       </WalletModalProvider>
//     </WalletProvider>
//   </ConnectionProvider>
// )

// export default AppWithProvider;