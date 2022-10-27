import React from "react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react"; // Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");
const WalletContainer = () => {
  const { connection } = useConnection();
  console.log("connection >>", connection);
  const wallet = useWallet();
  console.log("wallet >>", wallet);
  return (
    <div className="container has-background-grey-dark">
      <div className="row">
        <div className="col-md-12">
          <h1 className="text-center"> solana phantom wallet</h1> <WalletMultiButton className="wallet-btn-connect">
            connect wallet
          </WalletMultiButton>
          <>
            {wallet.connected && (
              <WalletDisconnectButton>disconnect
                wallet</WalletDisconnectButton>
            )}
          </>
        </div>
      </div>
    </div>
  );
};
export default WalletContainer;