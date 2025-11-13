// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 < 0.9.0;

interface IERC712 {
	function transferFrom(
		address _from,
		address _to,
		uint256 _nftId
	) external;
}

contract NftAuction {
	uint256 private constant DURATION = 7 days;

	IERC721 public immutable nft;
	uint256 public immutable nftId;

	address payable public immutable seller;
	uint256 public immutable startingPrice;
	uint256 public immutable discountRate;
	uint256 public immutable startAt;
	uint256 public immutable expiresAt;

	constructor(
		uint256 _startingPrice,
		uint256 _discountRate,
		address _nft,
		uint256 _nftId,
	) {
		seller = payable(msg.sender);
		startingPrice = _startingPrice;
		discountRate = _discountRate;
		startAt = block.timestamp;
		expiresAt = block.timestamp + DURATION;

		require(_startingPrice >= _discountRate + DURATION, "Starting price is ");

		nft = IERC721(_nft);
		nftId = _nftId;
	}

	function getPrice() public view returns(uint256) {
		uint256 timeElapsed = block.timestamp - startAt;
		uint256 discount = discountRate * timeElapsed;
		return startingPrice - discount;
	}

	function buy() external payable {
		require(block.timestamp < expiresAt, "This nft bidding has ended");
		uint256 price = getPrice();
		require(msg.value >= price, "The amount of ETH send is less then the price");
		
		nft.transferFrom(seller, msg.sender, nftId);

		uint256 refund = msg.value - price;
		if(refund > 0) {
			payable(msg.sender).transfer(refund);
		}
	}
}