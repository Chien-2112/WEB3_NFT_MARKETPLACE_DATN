'use client';

import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';

// INTERNAL IMPORT.
import Style from './connectWallet.module.css';
import images from '../../../public/img';
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

const ConnectWallet = () => {
  const [activeBtn, setActiveBtn] = useState(1);
  const { currentAccount, connectWallet, checkIfWalletConnected } =
    useContext(NFTMarketplaceContext);

  const providerArray = [
    {
      provider: images.provider1,
      name: 'Metamask',
    },
    {
      provider: images.provider2,
      name: 'WalletConnect',
    },
    {
      provider: images.provider3,
      name: 'WalletLink',
    },
  ];

  useEffect(() => {
    if (checkIfWalletConnected) {
      checkIfWalletConnected();
    }
  }, [checkIfWalletConnected]);

  const handleConnect = async () => {
    if (connectWallet) {
      await connectWallet();
    }
  };

  const shortAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <div className={Style.connectWallet}>
      <div className={Style.connectWallet_box}>
        <h1>Connect your wallet</h1>
        <p className={Style.connectWallet_box_para}>
          Connect with one of our available wallet providers or create a new
          wallet
        </p>

        <div className={Style.connectWallet_box_provider}>
          {providerArray.map((el, i) => (
            <div
              className={`${Style.connectWallet_box_provider_item} ${
                activeBtn === i + 1 ? Style.active : ''
              }`}
              key={i + 1}
              onClick={() => setActiveBtn(i + 1)}
            >
              <Image
                src={el.provider}
                alt={el.name}
                width={50}
                height={50}
                className={Style.connectWallet_box_provider_item_img}
              />
              <p>{el.name}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={Style.connectWallet_button}
          onClick={handleConnect}
        >
          {currentAccount ? 'Wallet Connected' : 'Connect MetaMask'}
        </button>

        {currentAccount && (
          <p className={Style.connectWallet_address}>
            Connected: {shortAddress(currentAccount)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;