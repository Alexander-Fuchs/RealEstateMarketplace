const ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1, { from: account_one });
            await this.contract.mint(account_two, 2, { from: account_one });
        })

        it('should return total supply', async function () {
            const total = await this.contract.totalSupply({ from: account_one });
            assert.equal(total.toNumber(), 2, "total supply not matched");
        })

        it('should get token balance', async function () {
            const tokenBalance = await this.contract.balanceOf(account_two);
            assert.equal(tokenBalance.toNumber(), 1, "token balance not matched");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            const tokenUri = await this.contract.tokenURI.call(1, { from: account_one });
            assert.equal(
                tokenUri,
                "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
                "TokenUri is not valid"
            );
        })

        it('should transfer token from one owner to another', async function () {
            try {
                await this.contract.transferFrom(account_one, account_two, 1, { from: account_one });
            } catch (error) {
                console.log('ERROR', error.toString());
            }
            const newOwner = await this.contract.ownerOf(1, { from: account_two });
            assert.equal(newOwner, account_two, "Transfer process failed");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            let reverted = false;
            try {
                await this.contract.mint(account_two, 6, { from: account_two });
            } catch (error) {
                reverted = true;
            }
            assert.equal(reverted, true, "Address is not contract owner");
        })

        it('should return contract owner', async function () {
            let contractOwner = await this.contract.getOwner.call({ from: account_one });
            assert.equal(contractOwner, account_one, "Contract owner doesn't match");
        })
    });
})