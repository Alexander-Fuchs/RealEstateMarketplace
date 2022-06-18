// Test if a new solution can be added for contract - SolnSquareVerifier
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const SquareVerifier = artifacts.require('Verifier');

contract('TestSolnSquareVerifier', accounts => {

    beforeEach(async () => {
        this.proof = require("../../zokrates/code/square/proof.json");
        const verifierAddress = (await SquareVerifier.deployed()).address;
        this.contract = await SolnSquareVerifier.new(verifierAddress, { from: accounts[0] });
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('A new solution can be added', async () => {
        await this.contract.addSolution(accounts[0], 1);
        let events = await this.contract.getPastEvents('SolutionAdded');
        assert.equal(events.length, 1);
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('An ERC721 token can be minted', async () => {
        const tokenId = 1;
        await this.contract.mintNFT(tokenId, this.proof.proof, this.proof.inputs, { from: accounts[0] });
        let data = (await this.contract.getPastEvents('Transfer'))[0].returnValues;
        let totalSupply = await this.contract.totalSupply();
        assert.equal(data.tokenId, tokenId.toString());
        assert.equal(data.to, accounts[0]);
        assert.equal(totalSupply, 1);
    })
})