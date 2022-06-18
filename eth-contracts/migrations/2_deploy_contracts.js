// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var ERC721MintableComplete = artifacts.require("ERC721MintableComplete");

module.exports = async function(deployer, network, accounts) {
  // await deployer.deploy(ERC721MintableComplete);
  await deployer.deploy(SquareVerifier);
  await deployer.deploy(SolnSquareVerifier, SquareVerifier.address);
};
