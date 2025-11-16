'use client';

import React, { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Buffer } from 'buffer';

// INTERNAL IMPORTS
import { NFTMarketplaceAddress, NFTMarketplaceABI } from './constants';

// Create context
export const NFTMarketplaceContext = createContext();

// --- FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(NFTMarketplaceAddress, NFTMarketplaceABI, signerOrProvider);

// --- CONNECTING WITH SMART CONTRACT
const connectingWithSmartContract = async () => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.log('Please install MetaMask');
      return null;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.error('Error connecting to contract:', error);
    return null;
  }
};

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = 'Discover, collect, and sell NFTs';
  const [currentAccount, setCurrentAccount] = useState('');

  // --- CHECK IF WALLET IS CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      if (typeof window === 'undefined' || !window.ethereum)
        return console.log('Please install MetaMask');

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log('No account found');
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  // --- CONNECT WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (typeof window === 'undefined' || !window.ethereum)
        return console.log('Please install MetaMask');

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length) setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // --- HANDLE ACCOUNT CHANGES
  useEffect(() => {
    setCurrentAccount('');
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0]);
        else setCurrentAccount('');
      });
    }
  }, []);

  // --- UPLOAD TO IPFS (Dynamic import + handled safely for Next.js)
  const uploadToIPFS = async (file) => {
    try {
      if (!file) {
        console.log('No file provided');
        return null;
      }

      // Import dynamically to prevent SSR bundling
      const { create } = await import('ipfs-http-client');

      const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
      const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;

      const auth =
        'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');

      const client = create({
        url: 'https://ipfs.infura.io:5001/api/v0',
        headers: { authorization: auth },
      });

      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      return null;
    }
  };

  // --- CREATE NFT FUNCTION
  // Lưu đầy đủ metadata: website, royalties, fileSize, category, properties
  const createNFT = async (
    name,
    price,
    image,
    description,
    router,
    website,
    royalties,
    fileSize,
    category,
    properties
  ) => {
    try {
      if (!name || !description || !price || !image) {
        console.log('Missing NFT data');
        return;
      }

      const data = JSON.stringify({
        name,
        description,
        image,
        website: website || '',
        royalties: royalties || '',
        fileSize: fileSize || '',
        category: category || '',
        properties: properties || '',
      });
      const metadataUrl = await uploadToIPFS(data);
      if (!metadataUrl) return console.log('Error uploading metadata');

      await createSale(metadataUrl, price, false, null);
      if (router && typeof router.push === 'function') router.push('/');
    } catch (error) {
      console.error('Error creating NFT:', error);
    }
  };

  // --- CREATE SALE FUNCTION
  const createSale = async (url, formInputPrice, isReselling = false, id = null) => {
    try {
      const price = ethers.parseEther(formInputPrice.toString());
      const contract = await connectingWithSmartContract();
      if (!contract) return console.log('Contract not available');

      const listingPrice = await contract.getListingPrice();
      const transaction = !isReselling
        ? await contract.createToken(url, price, { value: listingPrice.toString() })
        : await contract.reSellToken(id, price, { value: listingPrice.toString() });

      await transaction.wait();
      console.log('Transaction successful!');
    } catch (error) {
      console.error('Error creating sale:', error);
    }
  };

  // --- FETCH ALL NFTs
  const fetchNFTs = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'
      );
      const contract = fetchContract(provider);
      const data = await contract.fetchMarketItem();

      const items = await Promise.all(
        data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const { data: meta } = await axios.get(tokenURI);
          const price = ethers.formatEther(unformattedPrice);
          return { tokenId: Number(tokenId), seller, owner, price, ...meta };
        })
      );
      return items;
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  // --- FETCH MY NFT OR LISTED NFTS
  const fetchMyNFTOrListedNFTs = async (type) => {
    try {
      const contract = await connectingWithSmartContract();
      const data =
        type === 'fetchItemsListed'
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFTs();

      const items = await Promise.all(
        data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const { data: meta } = await axios.get(tokenURI);
          const price = ethers.formatEther(unformattedPrice);
          return { tokenId: Number(tokenId), seller, owner, price, ...meta };
        })
      );
      return items;
    } catch (error) {
      console.error('Error fetching my NFTs:', error);
    }
  };

  // --- BUY NFT FUNCTION
  const buyNFT = async (nft) => {
    try {
      const contract = await connectingWithSmartContract();
      const price = ethers.parseEther(nft.price.toString());
      const transaction = await contract.createMarketSale(nft.tokenId, { value: price });
      await transaction.wait();
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  };

  return (
    <NFTMarketplaceContext.Provider
      value={{
        titleData,
        currentAccount,
        connectWallet,
        checkIfWalletConnected,
        createNFT,
        uploadToIPFS,
        createSale,
        fetchNFTs,
        fetchMyNFTOrListedNFTs,
        buyNFT,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};