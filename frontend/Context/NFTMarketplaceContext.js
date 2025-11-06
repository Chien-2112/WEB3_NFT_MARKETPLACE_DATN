'use client';

import React, { useState, useEffect, useContext } from 'react';
import { ethers } from "ethers";
import axios from "axios";

// INTERNAL IMPORT.
import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./constants";

// --- FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) => 
	new ethers.Contract(
		NFTMarketplaceAddress,
		NFTMarketplaceABI,
		signerOrProvider
	);

// --- CONNECTING WITH SMART CONTRACT.
const connectingWithSmartContract = async() => {
	try {
		if(typeof window === 'undefined' || !window.ethereum) {
			console.log("Install MetaMask");
			return null;
		}
		const provider = new ethers.BrowserProvider(window.ethereum);
		const signer = await provider.getSigner();
		const contract = fetchContract(signer);
		return contract;
	} catch(error) {
		console.log("Something went wrong while connecting with contract", error);
		return null;
	}
}

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = (({children}) => {
	const titleData = "Discover, collect, and sell NFTs";

	// -------- USESTATE
	const [currentAccount, setCurrentAccount] = useState("");

	// --- CHECK IF WALLET IS CONNECTED
	const checkIfWalletConnected = async() => {
		try {
			if(typeof window === 'undefined' || !window.ethereum) {
				return console.log("Install MetaMask");
			}
			const accounts = await window.ethereum.request({ 
				method: "eth_accounts"
			});

			if(accounts.length) {
				setCurrentAccount(accounts[0]);
			} else {
				console.log("No Account Found");
			}
		} catch(error) {
			console.log("Something wrong while connecting to wallet", error);
		}
	}

	useEffect(() => {
		checkIfWalletConnected()
	}, []);

	// --- CONNECT WALLET FUNCTION
	const connectWallet = async() => {
		try {
			if(typeof window === 'undefined' || !window.ethereum) {
				console.log("Install MetaMask");
				return null;
			}
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			if(accounts.length) {
				setCurrentAccount(accounts[0]);
			}
		} catch(error) {
			console.log("Error while connecting to wallet", error);
		}
	}

	// UPLOAD TO IPFS FUNCTION.
	const uploadToIPFS = async (file) => {
		if (typeof window === 'undefined') {
			return null;
		}
		try {
			const { create } = await import("ipfs-http-client");
			const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });
			
			if (!file) {
				console.log("No file provided");
				return null;
			}
			
			const added = await client.add(file);
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;
			return url;
		} catch (error) {
			console.error("Error uploading to IPFS:", error);
			return null;
		}
	};

	// CREATE NFT FUNCTION.
	const createNFT = async(formInput, fileUrl, router) => {
		try {
			const { name, description, price } = formInput;
			if(!name || !description || !price || !fileUrl) {
				console.log("Data is Missing");
				return;
			}
			
			// Create metadata JSON
			const data = JSON.stringify({ name, description, image: fileUrl });
			
			// Upload metadata to IPFS
			const metadataUrl = await uploadToIPFS(data);
			if(!metadataUrl) {
				console.log("Error uploading metadata to IPFS");
				return;
			}
			
			// Create sale with metadata URL
			await createSale(metadataUrl, price, false, null);

			if(router && typeof router.push === 'function') {
				router.push("/");
			}
		} catch(error) {
			console.log("Error while creating NFT", error);
		}
	}

	// --- createSale FUNCTION.
	const createSale = async(url, formInputPrice, isReselling = false, id = null) => {
		try {
			// ethers v6 uses parseEther instead of utils.parseUnits
			const price = ethers.parseEther(formInputPrice.toString());
			const contract = await connectingWithSmartContract();
			
			if(!contract) {
				console.log("Contract not available");
				return;
			}
			
			const listingPrice = await contract.getListingPrice();

			const transaction = !isReselling 
				? await contract.createToken(url, price, {
					value: listingPrice.toString(),
				}) 
				: await contract.reSellToken(id, url, price, {
					value: listingPrice.toString(),
				});

			await transaction.wait();
			console.log("Transaction successful!");
		} catch(error) {
			console.log("Error while creating sale", error);
		}
	}

	// --- FETCH NFTS FUNCTION.
	const fetchNFTs = async() => {
		try {
			const provider = new ethers.providers.JsonRpcProvider();
			const contract = fetchContract(provider);

			const data = await contract.fetchMarketItem();

			const items = await Promise.all(
				data.map(async({ tokenId, seller, owner, price: unformattedPrice }) => {
					const tokenURI = await contract.tokeURI(tokenId);

					const {
						data: { image, name, description },
					} = await axios.get(tokenURI);
					const price = ethers.utils.formatUnits(
						unformattedPrice.toString(),
						"ether"
					);

					return {
						price,
						tokenId: tokenId.toNumber(),
						seller, 
						owner,
						image,
						name,
						description,
						tokenURI,
					}
				})
			)
			return items;
		} catch(error) {
			console.log("Error while fetching NFTs");
		}
	}

	// --- FETCHING MY NFT OR LISTED NFTs.
	const fetchMyNFTOrListedNFTs = async(type) => {
		try {
			const contract = await connectingWithSmartContract();

			const data = type === "fetchItemsListed" 
				? await contract.fetchItemsListed() 
				: await contract.fetchMyNFT();
			
			const items = await Promise.all(
				data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
					const tokenURI = await contract.tokenURI(tokenId);
					const {
						data: {image, name, description},
					} = await axios.get(tokenURI);
				})
			)
		} catch(error) {
			console.log("Error while fetching listed NFTs");
		}
	}

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
			}}
		>
			{children}
		</NFTMarketplaceContext.Provider>
	);
});