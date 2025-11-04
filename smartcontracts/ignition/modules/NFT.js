const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NFTModule", (m) => {
  const nftMarketplace = m.contract("NFTMarketplace");

  return { nftMarketplace };
});
