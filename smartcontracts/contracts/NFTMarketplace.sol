// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 < 0.9.0;

// Internal import for nft openzeppelin
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage, ReentrancyGuard {
	uint256 private _tokenIds; // Total number of tokens ever created
	uint256 private _itemsSold; // Total number of items sold

	uint256 listingPrice = 0.0025 ether; // Listing price of the marketplace

	address payable owner;
	mapping(uint256 => MarketItem) private idMarketItem; // Mapping from tokenId to MarketItem details

	// Market item structure
	struct MarketItem {
		uint256 tokenId;
		address payable seller;
		address payable owner;
		uint256 price;
		bool sold;
	}

	event idMarketItemCreated(
		uint256 indexed tokenId,
		address seller,
		address owner,
		uint256 price,
		bool sold
	);

	event MarketItemSold(
		uint256 indexed tokenId,
		address seller,
		address buyer,
		uint256 price,
		bool sold
	);

	event MarketItemReselled(
		uint256 indexed tokenId,
		address seller,
		uint256 price
	);

	// Modifier to check if the caller is the owner of the marketplace
	modifier onlyOwner() {
		require(
			msg.sender == owner,
			"Only marketplace owner can change the listing price."
		);
		_;
	}

	constructor() ERC721("NFT Metaverse Token", "MYNFT") {
		owner = payable(msg.sender);
	}

	// UPDATE LISTING PRICE OF THE MARKETPLACE.
	function updateListingPrice(uint256 _listingPrice)
		public
		payable
		onlyOwner
	{
		listingPrice = _listingPrice;
	}

	// GET LISTING PRICE OF THE MARKETPLACE.
	function getListingPrice() public view returns (uint256) {
		return listingPrice;
	}

	// CREATE NFT TOKEN.
	function createToken(string memory tokenURI, uint256 price)
		public
		payable
		nonReentrant
		returns(uint256)
	{
		require(price > 0, "Price must be at least 1 wei");
		require(
			bytes(tokenURI).length > 0,
			"Token URI cannot be empty"
		);

		_tokenIds += 1;
		uint256 newTokenId = _tokenIds;

		// Mint the token
		_mint(msg.sender, newTokenId);
		// Set token URI (bind token id with the passed in tokenURI)
		_setTokenURI(newTokenId, tokenURI);
		createMarketItem(newTokenId, price);
		return newTokenId;
	}

	// CREATING MARKET ITEMS.
	function createMarketItem(uint256 tokenId, uint256 price) private {
		require(price > 0, "Price must be at least 1 wei");
		require(
			msg.value == listingPrice,
			"Price must be equal to listing price"
		);
		idMarketItem[tokenId] = MarketItem(
			tokenId,
			payable(msg.sender),
			payable(address(this)),
			price,
			false
		);
		// Transfer the ownership of the nft from the seller to the contract itself
		_transfer(msg.sender, address(this), tokenId);
		emit idMarketItemCreated(
			tokenId,
			msg.sender,
			address(this),
			price,
			false
		);
	}

	// FUNCTION FOR RESELL TOKEN.
	function reSellToken(uint256 tokenId, uint256 price) public payable nonReentrant {
		require(price > 0, "Price must be at least 1 wei");
		require(
			idMarketItem[tokenId].owner == msg.sender,
			"Only item owner can perform this operation"
		);
		require(
			idMarketItem[tokenId].sold == true,
			"Item must be purchased before reselling"
		);
		require(
			msg.value == listingPrice,
			"Price must be equal to listing price"
		);
		
		idMarketItem[tokenId].sold = false;
		idMarketItem[tokenId].price = price;
		idMarketItem[tokenId].seller = payable(msg.sender);
		idMarketItem[tokenId].owner = payable(address(this));
		
		// Only decrement if items were sold
		if (_itemsSold > 0) {
			_itemsSold -= 1;
		}

		// Transfer the ownership of the nft from the seller to the contract itself
		_transfer(msg.sender, address(this), tokenId);
		emit MarketItemReselled(tokenId, msg.sender, price);
	}

	// CREATE MARKETSALE.
	function createMarketSale(uint256 tokenId) public payable nonReentrant {
		uint256 price = idMarketItem[tokenId].price;
		address seller = idMarketItem[tokenId].seller;
		
		// Validate that the item exists and is available for sale
		require(price > 0, "Item does not exist");
		require(
			idMarketItem[tokenId].sold == false,
			"Item is already sold"
		);
		require(
			idMarketItem[tokenId].owner == address(this),
			"Item is not for sale"
		);
		require(
			msg.value == price,
			"Please submit the asking price in order to complete the purchase"
		);
		require(seller != address(0), "Invalid seller address");
		
		idMarketItem[tokenId].owner = payable(msg.sender);
		idMarketItem[tokenId].sold = true;
		idMarketItem[tokenId].seller = payable(address(0));
		_itemsSold += 1;
		
		// Transfer the ownership of the nft from the contract itself to the buyer
		_transfer(address(this), msg.sender, tokenId);
		
		// Payment logic:
		// - Listing price was paid when item was created and is in contract balance
		// - Owner receives: listingPrice (from contract balance) - marketplace fee
		// - Seller receives: full sale price (from buyer's payment)
		// Use call instead of transfer for better gas efficiency and error handling
		(bool ownerSuccess, ) = payable(owner).call{value: listingPrice}("");
		require(ownerSuccess, "Failed to transfer listing price to owner");
		
		(bool sellerSuccess, ) = payable(seller).call{value: msg.value}("");
		require(sellerSuccess, "Failed to transfer payment to seller");
		
		emit MarketItemSold(tokenId, seller, msg.sender, price, true);
	}

	// GETTING UNSOLD NFT DATA.
	function fetchMarketItem() public view returns (MarketItem[] memory) {
		uint256 itemCount = _tokenIds;
		uint256 currentIndex = 0;
		
		// First pass: count unsold items
		uint256 unsoldItemCount = 0;
		for (uint256 i = 0; i < itemCount; i++) {
			uint256 currentId = i + 1;
			if (
				idMarketItem[currentId].price > 0 &&
				idMarketItem[currentId].owner == address(this) &&
				idMarketItem[currentId].sold == false
			) {
				unsoldItemCount += 1;
			}
		}

		// Second pass: populate array
		MarketItem[] memory items = new MarketItem[](unsoldItemCount);
		for (uint256 i = 0; i < itemCount; i++) {
			uint256 currentId = i + 1;
			// Check if item exists and is available for sale
			if (
				idMarketItem[currentId].price > 0 &&
				idMarketItem[currentId].owner == address(this) &&
				idMarketItem[currentId].sold == false
			) {
				MarketItem storage currentItem = idMarketItem[currentId];
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items;
	}

	// PURCHASE ITEM.
	function fetchMyNFTs() public view returns (MarketItem[] memory) {
		uint256 totalItemCount = _tokenIds;
		uint256 itemCount = 0;
		uint256 currentIndex = 0;

		for (uint256 i = 0; i < totalItemCount; i++) {
			if (idMarketItem[i + 1].owner == msg.sender) {
				itemCount += 1;
			}
		}

		MarketItem[] memory items = new MarketItem[](itemCount);
		for (uint256 i = 0; i < totalItemCount; i++) {
			if (idMarketItem[i + 1].owner == msg.sender) {
				uint256 currentId = i + 1;
				MarketItem storage currentItem = idMarketItem[currentId];
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items;
	}

	// SINGLE USER ITEMS.
	function fetchItemsListed() public view returns (MarketItem[] memory) {
		uint256 totalItemCount = _tokenIds;
		uint256 itemCount = 0;
		uint256 currentIndex = 0;

		for (uint256 i = 0; i < totalItemCount; i++) {
			if (idMarketItem[i + 1].seller == msg.sender) {
				itemCount += 1;
			}
		}

		MarketItem[] memory items = new MarketItem[](itemCount);
		for (uint256 i = 0; i < totalItemCount; i++) {
			if (idMarketItem[i + 1].seller == msg.sender) {
				uint256 currentId = i + 1;
				MarketItem storage currentItem = idMarketItem[currentId];
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items;
	}

	// FETCH ALL TOKENS.
    function fetchAllTokens() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds;
        MarketItem[] memory items = new MarketItem[](totalItemCount);

        for (uint256 i = 1; i <= totalItemCount; i++) {
            items[i - 1] = idMarketItem[i];
        }
        return items;
    }
}