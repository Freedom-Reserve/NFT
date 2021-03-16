const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle} = require("hardhat");

const provider = waffle.provider;
//const signer = provider.getSigner();

const log1 = console.log;
const bigNum = (item) => BigNumber.from(item);
const base = bigNum(10).pow(18);
//amount1 = bigNum(1285).mul(base);

const SECONDS_IN_A_DAY = 86400;
//const one1 = constants.One;
//const bnOne = bigNum(one1)
//--------------------== 
const fromWeiE = (weiAmount, dp) => {
  try {
    return ethers.utils.formatUnits(weiAmount, parseInt(dp));
  } catch (err) {
    console.error("fromWeiE() failed:", err);
    return -1;
  }
}//input: BN or string, dp = 6 or 18 number, output: string

const toWeiE = (amount, dp) => {
  try {
    return ethers.utils.parseUnits(amount, parseInt(dp));
  } catch (err) {
    console.error("toWeiE() failed:", err);
    return -1;
  }
}//input: string, output: Bn

const fromWei = (weiAmount) => web3.utils.fromWei(weiAmount.toString(), "ether");

const toWei = (amount) => web3.utils.toWei(amount.toString(), "ether");

/*
  main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);_AddrCtrt
    process.exit(1);
  });
  */
let tokenPrice = 0.1;
describe("describe1", function () {
  let nftFR;
  let owner, user1, user2, user3, addrs;

  beforeEach(async function () {
    log1("\n------------------== beforeEach");
    const network = 'rinkeby';
    let proxyRegistryAddress = "";
    if (network === 'rinkeby') {
      proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
    } else if(network == 'mainnet') {
      proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
    }

    [owner, user1, user2, user3, ...addrs] = await ethers.getSigners();

    const factoryCreatureFR = await ethers.getContractFactory("Creature");
    nftFR = await factoryCreatureFR.deploy();
    await nftFR.deployed();
    expect(nftFR.address).to.properAddress;
    log1("NFT contract is deployed to:", nftFR.address);

    const factoryAssetBookNFT = await ethers.getContractFactory("AssetBookNFT");
    assetbook1 = await factoryAssetBookNFT.deploy(user1.address, nftFR.address);
    await assetbook1.deployed();
    expect(assetbook1.address).to.properAddress;
    log1("AssetBook1 contract is deployed to:", assetbook1.address);
    assetbook2 = await factoryAssetBookNFT.deploy(user2.address, nftFR.address);
    await assetbook2.deployed();
    expect(assetbook2.address).to.properAddress;
    log1("AssetBook2 contract is deployed to:", assetbook2.address);

    tokenPrice = 0.1;
    const factorySalesERC721 = await ethers.getContractFactory("SalesERC721");
    salesERC721 = await factorySalesERC721.deploy(owner.address,  nftFR.address, toWei(tokenPrice));
    await salesERC721.deployed();
    expect(salesERC721.address).to.properAddress;
    log1("salesERC721 contract is deployed to:", salesERC721.address);

    const factoryERC20Token = await ethers.getContractFactory("ERC20Token");
    erc20 = await factoryERC20Token.deploy("ERC20Token", "ERC20Token", 18);
    await erc20.deployed();
    expect(erc20.address).to.properAddress;
    log1("erc20 contract is deployed to:", erc20.address);
  });

  // describe("Deployment", function () {
  //   it("Should ...", async function () {});
  // });
  /**


   * 
   */

  describe("erc721", function () {
    it("erc721 for EOA", async function () {
      log1("erc721 tests starts here...");
      let balance0, balance1, balance2;
      let isOwner, bool1;
      log1("\n------------------== ");
      name1 = await nftFR.name();
      symbol1 = await nftFR.symbol();
      log1("name:", name1, ", symbol1:", symbol1);

      tokenURI_1 = await nftFR.tokenURI(1);
      log1("tokenURI_1:", tokenURI_1);
      tokenURI_9 = await nftFR.tokenURI(9);
      log1("tokenURI_9:", tokenURI_9);
      tokenURI_10 = await nftFR.tokenURI(10);
      log1("tokenURI_10:", tokenURI_10);

      balance1 = await nftFR.balanceOf(user1.address);
      log1("balance1:", balance1.toString());


      log1('\n---------== Mint tokens from 1 to 10');
      await nftFR.mintAll(user1.address);

      balance1 = await nftFR.balanceOf(user1.address);
      log1("balance1:", balance1.toString());

      const tokenIDs = Array.from({length: 10}, (_, i) => i + 1);
      // await asyncForEach(tokenIDs, async (item, index) => {
      //   log1("item:",item);
      //   await nftFR.mintTo(user1.address);
      // });

      await expect(
        nftFR.mintTo(user1.address)
      ).to.be.revertedWith("maxTokenId has been reached");
      log1("maxTokenId tested successful");

      await asyncForEach(tokenIDs, async (tokenID, index) => {
        doesItExist = await nftFR.exists(tokenID);
        log1("doesItExist("+tokenID+"):", doesItExist);
        expect(doesItExist).to.equal(true);

        ownerX = await nftFR.ownerOf(tokenID);
        isCorrectOwner = ownerX == user1.address;
        log1("isCorrectOwner:", isCorrectOwner);
        expect(isCorrectOwner).to.equal(true);
      });
      log1("All tokenId exist and all have correct owners");

      tokenID = 0;
      doesItExist = await nftFR.exists(tokenID);
      log1("doesItExist("+tokenID+"):", doesItExist);
      expect(doesItExist).to.equal(false);
      tokenID = 11;
      doesItExist = await nftFR.exists(tokenID);
      log1("doesItExist("+tokenID+"):", doesItExist);
      expect(doesItExist).to.equal(false);

      log1('--------------==Done');

      bools = await nftFR.checkOwner(user1.address);
      log1("checkOwner:", bools);


      balance2 = await nftFR.balanceOf(user2.address);
      log1("\nbalance2 before transferring:", balance2.toString());
      //log1( Object.keys(nftFR));
      await nftFR.connect(user1)['safeTransferFrom(address,address,uint256)'](user1.address, user2.address, 3);

      bools = await nftFR.checkOwner(user1.address);
      log1("bools:", bools);
      ownerX = await nftFR.ownerOf(3);
      log1("ownerX:", ownerX, ", isowner:", ownerX == user1.address);


      balance1 = await nftFR.balanceOf(user1.address);
      log1("balance1:", balance1.toString());
      balance2 = await nftFR.balanceOf(user2.address);
      log1("balance2:", balance2.toString());

      log1("\n user2 to approve user3 of token1");
      await nftFR.connect(user2).approve(user3.address,3);
      //function call to a non-contract account

      log1("\n user3 to transfer token1 from user2 to user1");
      await nftFR.connect(user3)['safeTransferFrom(address,address,uint256)'](user2.address, user1.address, 3);//function call to a non-contract account
      balance1 = await nftFR.balanceOf(user1.address);
      log1("balance1 after:", balance1.toString());

      ownerX = await nftFR.ownerOf(3);
      log1("ownerX:", ownerX, ", isowner:", ownerX == user1.address);

      //expect(rewardBalance1).to.equal(0);
    });//how to get list: _holderTokens ??
  });

  //return;
  describe("erc721", function () {
    it("erc721 for AssetBook", async function () {
      log1("erc721 for AssetBook tests starts here...");
      let balance0, balance1, balance2;
      let isOwner, bool1;
      log1("\n------------------== ");
      name1 = await nftFR.name();
      symbol1 = await nftFR.symbol();
      log1("name:", name1, ", symbol1:", symbol1);

      balance1 = await nftFR.balanceOf(assetbook1.address);
      log1("balance_assetbook1:", balance1.toString());


      log1('\n---------== Mint tokens from 1 to 10');
      await nftFR.mintAll(assetbook1.address);

      balance1 = await nftFR.balanceOf(assetbook1.address);
      log1("balance_assetbook1:", balance1.toString());

      const tokenIDs = Array.from({length: 10}, (_, i) => i + 1);

      await expect(
        nftFR.mintTo(assetbook1.address)
      ).to.be.revertedWith("maxTokenId has been reached");
      log1("maxTokenId tested successful");

      await asyncForEach(tokenIDs, async (tokenID, index) => {
        doesItExist = await nftFR.exists(tokenID);
        log1("doesItExist("+tokenID+"):", doesItExist);
        expect(doesItExist).to.equal(true);

        ownerX = await nftFR.ownerOf(tokenID);
        isCorrectOwner = ownerX == assetbook1.address;
        log1("isCorrectOwner:", isCorrectOwner);
        expect(isCorrectOwner).to.equal(true);
      });
      log1("All tokenId exist and all have correct owners");

      tokenID = 0;
      doesItExist = await nftFR.exists(tokenID);
      log1("doesItExist("+tokenID+"):", doesItExist);
      expect(doesItExist).to.equal(false);
      tokenID = 11;
      doesItExist = await nftFR.exists(tokenID);
      log1("doesItExist("+tokenID+"):", doesItExist);
      expect(doesItExist).to.equal(false);

      log1('--------------==Done');

      bools = await nftFR.checkOwner(assetbook1.address);
      log1("checkOwner:", bools);


      balance2 = await nftFR.balanceOf(user2.address);
      log1("\nbalance2 before transferring:", balance2.toString());
      //log1( Object.keys(assetbook1));
      await assetbook1.connect(user1)['safeTransferFrom(address,address,uint256)'](assetbook1.address, assetbook2.address, 3);

      bools = await nftFR.checkOwner(assetbook1.address);
      log1("bools:", bools);
      ownerX = await nftFR.ownerOf(3);
      log1("ownerX:", ownerX, ", isowner:", ownerX == assetbook2.address);

      balance1 = await nftFR.balanceOf(assetbook1.address);
      log1("balance_assetbook1:", balance1.toString());
      balance2 = await nftFR.balanceOf(assetbook2.address);
      log1("balance2:", balance2.toString());

      log1("\n assetbook2 to approve user3 of token");
      await assetbook2.connect(user2).approve(user3.address, 3);
      //function call to a non-contract account

      log1("\n user3 to transfer token from assetbook2 to assetbook1");
      await assetbook2.connect(user3)['safeTransferFrom(address,address,uint256)'](assetbook2.address, assetbook1.address, 3);//function call to a non-contract account
      balance1 = await nftFR.balanceOf(assetbook1.address);
      log1("balance_assetbook1 after:", balance1.toString());

      ownerX = await nftFR.ownerOf(3);
      log1("ownerX:", ownerX, ", isowner:", ownerX == assetbook1.address);

      //expect(rewardBalance1).to.equal(0);
    });//how to get list: _holderTokens ??
  });

  describe("erc721", function () {
    it("erc721 for AssetBook", async function () {
      log1("erc721 for AssetBook tests starts here...");
      let balance0, balance1, balance2;
      let isOwner, bool1;
      log1("\n------------------== ");
      name1 = await nftFR.name();
      symbol1 = await nftFR.symbol();
      log1("name:", name1, ", symbol1:", symbol1);

      log1("\n------------------== Test Sales Contract");
      log1("owner:", owner.address, "\nuser1:", user1.address, "\nuser2:", user2.address);
      balance0ETH = await provider.getBalance(owner.address);
      log1("balance0ETH:", fromWei(balance0ETH));
      balance1ETH = await provider.getBalance(user1.address);
      log1("balance1ETH:", fromWei(balance1ETH));
      balance2ETH = await provider.getBalance(user2.address);
      log1("balance2ETH:", fromWei(balance2ETH));

      tx = await user1.sendTransaction({
        to: user2.address,
        value: ethers.utils.parseEther("1.0")
      });
      log1("txHash:", tx.hash);
      balance0ETH = await provider.getBalance(owner.address);
      log1("balance0ETH:", fromWei(balance0ETH));
      balance1ETH = await provider.getBalance(user1.address);
      log1("balance1ETH:", fromWei(balance1ETH));
      balance2ETH = await provider.getBalance(user2.address);
      log1("balance2ETH:", fromWei(balance2ETH));

      balance1 = await nftFR.balanceOf(assetbook1.address);
      log1("balance_assetbook1:", balance1.toString());


      log1('\n---------== Mint tokens from 1 to 10');
      await nftFR.mintAll(salesERC721.address);

      balance1 = await nftFR.balanceOf(salesERC721.address);
      log1("balance_salesCtrt:", balance1.toString());

      const tokenIDs = Array.from({length: 10}, (_, i) => i + 1);
      await asyncForEach(tokenIDs, async (tokenID, index) => {
        doesItExist = await nftFR.exists(tokenID);
        log1("doesItExist("+tokenID+"):", doesItExist);
        expect(doesItExist).to.equal(true);

        ownerX = await nftFR.ownerOf(tokenID);
        isCorrectOwner = ownerX == salesERC721.address;
        log1("isCorrectOwner:", isCorrectOwner);
        expect(isCorrectOwner).to.equal(true);
      });
      log1("All tokenId exist and all have correct owners");
      log1('--------------==Done');

      bools = await nftFR.checkOwner(salesERC721.address);
      log1("checkOwner:", bools);
      //return;

      //-----------==
      priceInWeiETH = await salesERC721.priceInWeiETH();
      log1("\nSalesERC721 priceInWeiETH:", priceInWeiETH.toString(), fromWei(priceInWeiETH));


      log1("\n--------------== User1 buys token");
      balance1 = await nftFR.balanceOf(salesERC721.address);
      log1("salesERC721 balance:", balance1.toString());

      //user1 to buy token
      tokenID = 1;
      balance1 = await nftFR.balanceOf(user1.address);
      log1("balance1:", fromWei(balance1));

      ownerX = await nftFR.ownerOf(tokenID);
      isCorrectOwner = ownerX == salesERC721.address;
      log1("isCorrectOwner:", isCorrectOwner);

      let overrides = {
        value: toWei(tokenPrice)
      };
      tx = await salesERC721.connect(user1).buyNFTViaETH(tokenID, overrides);

      log1("tx:", tx);
      balance1 = await nftFR.balanceOf(user1.address);
      log1("balance1:", balance1.toString());

      balance1 = await nftFR.balanceOf(salesERC721.address);
      log1("balance_salesCtrt:", balance1.toString());

      ownerX = await nftFR.ownerOf(tokenID);
      isCorrectOwner = ownerX == user1.address;
      log1("isCorrectOwner:", isCorrectOwner);


      //-----------------------==
      log1("\n--------------== User2 buys token");
      balance1 = await nftFR.balanceOf(salesERC721.address);
      log1("salesERC721 balance:", balance1.toString());

      //user2 to buy token
      tokenID = 2;
      balance1 = await nftFR.balanceOf(user2.address);
      log1("balance1:", fromWei(balance1));

      ownerX = await nftFR.ownerOf(tokenID);
      isCorrectOwner = ownerX == salesERC721.address;
      log1("isCorrectOwner:", isCorrectOwner);

      overrides = {
        value: toWei(tokenPrice)
      };
      tx = await salesERC721.connect(user2).buyNFTViaETH(tokenID, overrides);

      log1("tx:", tx);
      balance1 = await nftFR.balanceOf(user2.address);
      log1("balance1:", balance1.toString());

      balance1 = await nftFR.balanceOf(salesERC721.address);
      log1("balance_salesCtrt:", balance1.toString());

      ownerX = await nftFR.ownerOf(tokenID);
      isCorrectOwner = ownerX == user2.address;
      log1("isCorrectOwner:", isCorrectOwner);


      log1("\n------------== send erc20 tokens to user3");
      amount = 5000;
      await erc20.transfer(user3.address, toWei(amount));
      balanceX = await erc20.balanceOf(user3.address);
      expect(balanceX).to.equal(toWei(amount));
      log1("balanceX:", fromWei(balanceX));


      log1("\n------------== set allowance by user3");
      allowance = 1000000;
      ownerBal = await erc20
        .connect(user3).approve(salesERC721.address, toWei(allowance));
      
      log1("\n------------== set priceInWeiToken");
      await salesERC721.setPriceInWeiToken(toWei(10));
      await salesERC721.setToken(erc20.address);
      log1("balanceX:", fromWei(balanceX));

      log1("\n------------== buyNFTViaERC20 by user3");
      tokenID = 3;
      tx = await salesERC721.connect(user3).buyNFTViaERC20(tokenID);
      balanceX = await erc20.balanceOf(user3.address);
      log1("balance3 erc20:", fromWei(balanceX));
      balance1 = await nftFR.balanceOf(user3.address);
      log1("balance3 NFT:", balance1.toString());

      balance1 = await nftFR.balanceOf(salesERC721.address);
      log1("balance_salesCtrt:", balance1.toString());

      ownerX = await nftFR.ownerOf(tokenID);
      isCorrectOwner = ownerX == user2.address;
      log1("isCorrectOwner:", isCorrectOwner);


      log1("\n----------------== WithdrawETH from contract");
      balanceSalesETH = await provider.getBalance(salesERC721.address);
      log1("balanceSalesETH:", fromWei(balanceSalesETH));

      balanceX = await erc20.balanceOf(salesERC721.address);
      log1("balance erc20@salesERC721:", fromWei(balanceX));
      balanceX = await erc20.balanceOf(owner.address);
      log1("balance erc20@owner:", fromWei(balanceX));

      balance0ETH = await provider.getBalance(owner.address);
      log1("balance0ETH:", fromWei(balance0ETH));

      amount1 = toWei(2*tokenPrice);
      await salesERC721.connect(owner).withdrawETH(owner.address, amount1);

      balanceSalesETH = await provider.getBalance(salesERC721.address);
      log1("\nbalanceSalesETH:",fromWei(balanceSalesETH));

      amount1 = 10;
      await salesERC721.connect(owner).withdrawERC20(owner.address, toWei(amount1));
      balanceX = await erc20.balanceOf(salesERC721.address);
      log1("balance erc20@salesERC721:", fromWei(balanceX));
      balanceX = await erc20.balanceOf(owner.address);
      log1("balance erc20@owner:", fromWei(balanceX));

      balance0ETH = await provider.getBalance(owner.address);
      log1("balance0ETH:", fromWei(balance0ETH));

      //----------------== 
    });
  });

  describe("yyy", function () {
    it("see  changes", async function () {});
  });

  /*
   */
});

const sequentialRun = async (array) => {
  log1('\ninside sequentialRun()... going to get each of inputArray');

  await asyncForEach(array, async (item, index) => {
    log1(item);
    const result = await func1(xyz);
  });
  log1('--------------==Done');
  log1('SequentialRun() has been completed.\nAll input array elements have been cycled through');
}

async function asyncForEach(array, callback) {
  log1(`\n------------------==asyncForEach:\n ${array}`);
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const timeTravelDecRewardRate = async (rewardsCtrt, dayX) => {
  log1("\n--------== time forward 1 day. Day " + dayX);
  await timeTravel(SECONDS_IN_A_DAY * 1);
  rewardToNotify = 0;
  log1("calling notifyRewardAmount() with new reward = ", rewardToNotify);
  await rewardsCtrt.notifyRewardAmount(toWei(rewardToNotify));

  dataRaw = await rewardsCtrt.getData1();
  log1("blockTimestamp:", dataRaw[0].toString());
  log1("periodFinish:  ", dataRaw[1].toString());
  log1("rewardRate:    ", dataRaw[2].toString(), " => ", fromWei(dataRaw[2]));
};

/**
      var val = 37.435345;
      decimals = countDecimals(val);
      log1("decimals:", decimals)
 */
const countDecimals = (value) => {
  if (Math.floor(value) !== value)
    return value.toString().split(".")[1].length || 0;
  return 0;
};

function moveDecimalToLeft(n, firstM) {
  var l = n.toString().length - firstM;
  var v = n / Math.pow(10, l);
  log1("l:", l, ", v:", v);
  return v;
}

const jsonrpc = "2.0";
const id = 0; //31337
const makeRPC = async (method, params = []) =>
  await network.provider.request({ id, jsonrpc, method, params });
//web3.currentProvider.makeRPC({ id, jsonrpc, method, params })
const timeTravel = async (seconds) => {
  await makeRPC("evm_increaseTime", [seconds]);
  await makeRPC("evm_mine");
}; //module.exports = timeTravel
/**
-await network.provider.request({
  method: "evm_increaseTime",
  params: []
})
 */
