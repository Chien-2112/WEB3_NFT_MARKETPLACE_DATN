const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let nftMarketplace;
  let owner, addr1, addr2, addr3;
  // Khai báo biến
  let LISTING_PRICE;
  let TOKEN_PRICE;
  let HIGHER_PRICE;

  beforeEach(async function () {
    // Gán giá trị cho các biến ở đây
    // Tại thời điểm này, ethers đã được định nghĩa
    LISTING_PRICE = ethers.utils.parseEther("0.0025");
    TOKEN_PRICE = ethers.utils.parseEther("1");
    HIGHER_PRICE = ethers.utils.parseEther("2");
    
    // Lấy các signer
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Triển khai hợp đồng
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();
  });

  // --- Deployment ---
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      await expect(nftMarketplace.connect(addr1).updateListingPrice(LISTING_PRICE))
        .to.be.revertedWith("Only marketplace owner can change the listing price.");
    });

    it("Should set correct listing price", async function () {
      expect(await nftMarketplace.getListingPrice()).to.equal(LISTING_PRICE);
    });

    it("Should have correct name and symbol", async function () {
      expect(await nftMarketplace.name()).to.equal("NFT Metaverse Token");
      expect(await nftMarketplace.symbol()).to.equal("MYNFT");
    });
  });

  // --- Listing Price Management ---
  describe("Listing Price Management", function () {
    it("Should allow owner to update listing price", async function () {
      const newPrice = ethers.utils.parseEther("0.005");
      await nftMarketplace.updateListingPrice(newPrice);
      expect(await nftMarketplace.getListingPrice()).to.equal(newPrice);
    });

    it("Should not allow non-owner to update listing price", async function () {
      const newPrice = ethers.utils.parseEther("0.005");
      await expect(nftMarketplace.connect(addr1).updateListingPrice(newPrice))
        .to.be.revertedWith("Only marketplace owner can change the listing price.");
    });
  });

  // --- Token Creation and Listing ---
  describe("Token Creation and Listing", function () {
    it("Should create token and list on marketplace", async function () {
      const tokenURI = "https://example.com/token/1";

      await expect(nftMarketplace.connect(addr1).createToken(
        tokenURI,
        TOKEN_PRICE,
        { value: LISTING_PRICE }
      ))
        .to.emit(nftMarketplace, 'MarketItemCreated')
        .withArgs(1, addr1.address, nftMarketplace.address, TOKEN_PRICE, false);

      // Kiểm tra token URI và quyền sở hữu
      expect(await nftMarketplace.tokenURI(1)).to.equal(tokenURI);
      expect(await nftMarketplace.ownerOf(1)).to.equal(nftMarketplace.address);
    });

    it("Should fail if listing price is incorrect", async function () {
      const tokenURI = "https://example.com/token/1";
      const wrongPrice = ethers.utils.parseEther("0.001");

      await expect(nftMarketplace.connect(addr1).createToken(
        tokenURI,
        TOKEN_PRICE,
        { value: wrongPrice }
      )).to.be.revertedWith("Price must be equal to listing price");
    });

    it("Should fail if price is zero", async function () {
      const tokenURI = "https://example.com/token/1";

      await expect(nftMarketplace.connect(addr1).createToken(
        tokenURI,
        0,
        { value: LISTING_PRICE }
      )).to.be.revertedWith("Price must be at least 1 wei");
    });
  });

  // --- Market Sales ---
  describe("Market Sales", function () {
    beforeEach(async function () {
      await nftMarketplace.connect(addr1).createToken(
        "https://example.com/token/1",
        TOKEN_PRICE,
        { value: LISTING_PRICE }
      );
    });

    it("Should allow buying an NFT", async function () {
      const sellerBalanceBefore = await ethers.provider.getBalance(addr1.address);
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

      await expect(nftMarketplace.connect(addr2).createMarketSale(1, {
        value: TOKEN_PRICE
      }))
        .to.emit(nftMarketplace, 'MarketItemSold')
        .withArgs(1, addr2.address, true);

      expect(await nftMarketplace.ownerOf(1)).to.equal(addr2.address);

      const sellerBalanceAfter = await ethers.provider.getBalance(addr1.address);
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

      expect(sellerBalanceAfter).to.be.closeTo(sellerBalanceBefore.add(TOKEN_PRICE), ethers.utils.parseEther("0.001"));
      expect(ownerBalanceAfter).to.be.closeTo(ownerBalanceBefore.add(LISTING_PRICE), ethers.utils.parseEther("0.001"));
    });

    it("Should fail if incorrect payment amount", async function () {
      const wrongAmount = ethers.utils.parseEther("0.5");

      await expect(nftMarketplace.connect(addr2).createMarketSale(1, {
        value: wrongAmount
      })).to.be.revertedWith("Please submit the asking price in order to complete the purchase");
    });

    it("Should fail buying non-existent token", async function () {
      await expect(nftMarketplace.connect(addr2).createMarketSale(999, {
        value: TOKEN_PRICE
      })).to.be.revertedWith("Item with this ID does not exist");
    });
  });

  // --- Reselling ---
  describe("Reselling", function () {
    beforeEach(async function () {
      await nftMarketplace.connect(addr1).createToken(
        "https://example.com/token/1",
        TOKEN_PRICE,
        { value: LISTING_PRICE }
      );
      await nftMarketplace.connect(addr2).createMarketSale(1, {
        value: TOKEN_PRICE
      });
    });

    it("Should allow token owner to resell", async function () {
      await expect(nftMarketplace.connect(addr2).reSellToken(1, HIGHER_PRICE, {
        value: LISTING_PRICE
      }))
        .to.emit(nftMarketplace, 'MarketItemReselled')
        .withArgs(1, addr2.address, HIGHER_PRICE);

      expect(await nftMarketplace.ownerOf(1)).to.equal(nftMarketplace.address);
    });

    it("Should fail if not token owner tries to resell", async function () {
      await expect(nftMarketplace.connect(addr3).reSellToken(1, HIGHER_PRICE, {
        value: LISTING_PRICE
      })).to.be.revertedWith("Only item owner can perform this operation");
    });

    it("Should fail if incorrect listing price for resell", async function () {
      const wrongPrice = ethers.utils.parseEther("0.001");
      await expect(nftMarketplace.connect(addr2).reSellToken(1, HIGHER_PRICE, {
        value: wrongPrice
      })).to.be.revertedWith("Price must be equal to listing price");
    });
  });

  // --- Fetch Functions ---
  describe("Fetch Functions", function () {
    beforeEach(async function () {
      // Tạo nhiều tokens với các trạng thái khác nhau
      await nftMarketplace.connect(addr1).createToken(
        "https://example.com/token/1",
        TOKEN_PRICE,
        { value: LISTING_PRICE }
      );
      await nftMarketplace.connect(addr1).createToken(
        "https://example.com/token/2",
        TOKEN_PRICE,
        { value: LISTING_PRICE }
      );
      await nftMarketplace.connect(addr2).createToken(
        "https://example.com/token/3",
        HIGHER_PRICE,
        { value: LISTING_PRICE }
      );

      await nftMarketplace.connect(addr2).createMarketSale(1, {
        value: TOKEN_PRICE
      });
    });

    it("Should fetch unsold market items", async function () {
      const items = await nftMarketplace.fetchMarketItem();
      expect(items.length).to.equal(2);

      expect(items[0].tokenId).to.equal(2);
      expect(items[0].seller).to.equal(addr1.address);
      expect(items[0].owner).to.equal(nftMarketplace.address);
      expect(items[0].sold).to.equal(false);

      expect(items[1].tokenId).to.equal(3);
      expect(items[1].seller).to.equal(addr2.address);
      expect(items[1].owner).to.equal(nftMarketplace.address);
      expect(items[1].sold).to.equal(false);
    });

    it("Should fetch user's owned NFTs", async function () {
      const addr2Items = await nftMarketplace.connect(addr2).fetchMyNFTs();
      expect(addr2Items.length).to.equal(1);
      expect(addr2Items[0].tokenId).to.equal(1);
      expect(addr2Items[0].owner).to.equal(addr2.address);
      expect(addr2Items[0].sold).to.equal(true);
    });

    it("Should fetch user's listed items", async function () {
      const addr1Listed = await nftMarketplace.connect(addr1).fetchItemsListed();
      expect(addr1Listed.length).to.equal(1);
      expect(addr1Listed[0].tokenId).to.equal(2);
      expect(addr1Listed[0].seller).to.equal(addr1.address);

      const addr2Listed = await nftMarketplace.connect(addr2).fetchItemsListed();
      expect(addr2Listed.length).to.equal(1);
      expect(addr2Listed[0].tokenId).to.equal(3);
      expect(addr2Listed[0].seller).to.equal(addr2.address);
    });

    it("Should fetch all tokens", async function () {
      const allTokens = await nftMarketplace.fetchAllTokens();
      expect(allTokens.length).to.equal(3);

      for (let i = 0; i < 3; i++) {
        expect(allTokens[i].tokenId).to.equal(i + 1);
      }
    });
  });

  // --- Complex Scenarios ---
  describe("Complex Scenarios", function () {
    it("Should handle multiple sales and resales correctly", async function () {
      await nftMarketplace.connect(addr1).createToken(
        "https://example.com/token/1",
        TOKEN_PRICE,
        { value: LISTING_PRICE }
      );

      await nftMarketplace.connect(addr2).createMarketSale(1, {
        value: TOKEN_PRICE
      });

      expect(await nftMarketplace.ownerOf(1)).to.equal(addr2.address);

      await nftMarketplace.connect(addr2).reSellToken(1, HIGHER_PRICE, {
        value: LISTING_PRICE
      });

      expect(await nftMarketplace.ownerOf(1)).to.equal(nftMarketplace.address);

      await nftMarketplace.connect(addr3).createMarketSale(1, {
        value: HIGHER_PRICE
      });

      expect(await nftMarketplace.ownerOf(1)).to.equal(addr3.address);

      const addr3Items = await nftMarketplace.connect(addr3).fetchMyNFTs();
      expect(addr3Items.length).to.equal(1);
      expect(addr3Items[0].tokenId).to.equal(1);
    });

    it("Should handle multiple users creating and trading tokens", async function () {
      for (let i = 1; i <= 5; i++) {
        const signer = i <= 2 ? addr1 : i <= 4 ? addr2 : addr3;
        await nftMarketplace.connect(signer).createToken(
          `https://example.com/token/${i}`,
          TOKEN_PRICE,
          { value: LISTING_PRICE }
        );
      }

      const marketItems = await nftMarketplace.fetchMarketItem();
      expect(marketItems.length).to.equal(5);

      await nftMarketplace.connect(addr2).createMarketSale(1, { value: TOKEN_PRICE });
      await nftMarketplace.connect(addr3).createMarketSale(2, { value: TOKEN_PRICE });

      const updatedMarketItems = await nftMarketplace.fetchMarketItem();
      expect(updatedMarketItems.length).to.equal(3);

      const addr2Owned = await nftMarketplace.connect(addr2).fetchMyNFTs();
      const addr3Owned = await nftMarketplace.connect(addr3).fetchMyNFTs();

      expect(addr2Owned.length).to.equal(1);
      expect(addr3Owned.length).to.equal(1);
    });
  });

  // --- Edge Cases ---
  describe("Edge Cases", function () {
    it("Should return empty arrays for users with no tokens", async function () {
      const myNFTs = await nftMarketplace.connect(addr1).fetchMyNFTs();
      const listedItems = await nftMarketplace.connect(addr1).fetchItemsListed();

      expect(myNFTs.length).to.equal(0);
      expect(listedItems.length).to.equal(0);
    });

    it("Should handle zero token state correctly", async function () {
      const marketItems = await nftMarketplace.fetchMarketItem();
      const allTokens = await nftMarketplace.fetchAllTokens();

      expect(marketItems.length).to.equal(0);
      expect(allTokens.length).to.equal(0);
    });

    it("Should prevent buying already sold items", async function () {
      await nftMarketplace.connect(addr1).createToken(
        "https://example.com/token/1",
        TOKEN_PRICE,
        { value: LISTING_PRICE }
      );

      await nftMarketplace.connect(addr2).createMarketSale(1, {
        value: TOKEN_PRICE
      });

      await expect(nftMarketplace.connect(addr3).createMarketSale(1, {
        value: TOKEN_PRICE
      })).to.be.revertedWith("Item is already sold");
    });
  });
});