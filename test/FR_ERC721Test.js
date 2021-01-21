const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { exists } = require("fs");
const { ethers } = require("hardhat");

const log1 = console.log;
const bigNum = (item) => BigNumber.from(item);
const base = bigNum(10).pow(18);
//amount1 = bigNum(1285).mul(base);

const SECONDS_IN_A_DAY = 86400;
//const one1 = constants.One;
//const bnOne = bigNum(one1)
const fromWei = (weiAmount) => {
  weiAmountBn = BigNumber.from(weiAmount);
  return web3.utils.fromWei(weiAmountBn.toString(), "ether");
};
const toWei = (amount) => {
  amount = BigNumber.from(amount);
  return (weiAmount = web3.utils.toWei(amount.toString(), "ether"));
};
/*
  main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
  */
describe("describe1", function () {
  let nftFR;
  let owner, user1, user2, user3, addrs;

  beforeEach(async function () {
    const factoryCreatureFR = await ethers.getContractFactory("Creature");
    [owner, user1, user2, user3, ...addrs] = await ethers.getSigners();

    const network = 'rinkeby';
    let proxyRegistryAddress = "";
    if (network === 'rinkeby') {
      proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
    } else if(network == 'mainnet') {
      proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
    }

    nftFR = await factoryCreatureFR.deploy();
    await nftFR.deployed();
    expect(nftFR.address).to.properAddress;
    log1("token contract is deployed to:", nftFR.address);

    // log1("\n--------------== send rwTokens to RewardsCtrt");

    // ownerRwTokenBalance = await nftFR.balanceOf(owner.address);
    // log1("ownerRwTokenBalance:", fromWei(ownerRwTokenBalance));

    // weiAmount = toWei(80000000);
    // await nftFR.transfer(rewardsCtrt.address, weiAmount);
  });

  // describe("Deployment", function () {
  //   it("Should ...", async function () {});
  // });
  /**
      await expect(
        rewardsCtrt.connect(user1).setRewardDistribution(user1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
      log1("security tested successful")

   * 
   */

  describe("erc721", function () {
    it("see erc721", async function () {
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
      log1("balance1 before:", balance1.toString());


      log1('\n---------== Mint tokens from 1 to 10');
      const tokenIDs = Array.from({length: 10}, (_, i) => i + 1);
      await asyncForEach(tokenIDs, async (item, index) => {
        console.log("item:",item);
        await nftFR.mintTo(user1.address);
      });
      console.log('--------------==Done');
    
      balance1 = await nftFR.balanceOf(user1.address);
      log1("balance1 after:", balance1.toString());

      ownerX = await nftFR.ownerOf(1);
      log1("ownerX:", ownerX, ", isToken1 his?:", ownerX == user1.address);
      ownerX = await nftFR.ownerOf(3);
      log1("ownerX:", ownerX, ", isToken3 his?:", ownerX == user1.address);

      bools = await nftFR.checkTokens(user1.address);
      log1("bools:", bools);


      balance2 = await nftFR.balanceOf(user2.address);
      log1("\nbalance2 before transferring:", balance2.toString());

      await nftFR.connect(user1).transferFrom(user1.address, user2.address, 3);//function call to a non-contract account

      bools = await nftFR.checkTokens(user1.address);
      log1("bools:", bools);


      balance1 = await nftFR.balanceOf(user1.address);
      log1("balance1:", balance1.toString());
      balance2 = await nftFR.balanceOf(user2.address);
      log1("balance2:", balance2.toString());

      log1("\n user2 to approve user3 of token1");
      await nftFR.connect(user2).approve(user3.address,3);
      //function call to a non-contract account

      log1("\n user3 to transfer token1 from user2 to user1");
      await nftFR.connect(user3).transferFrom(user2.address, user1.address, 3);//function call to a non-contract account
      balance1 = await nftFR.balanceOf(user1.address);
      log1("balance1 after:", balance1.toString());

      ownerX = await nftFR.ownerOf(1);
      log1("ownerX:", ownerX, ", isUser1:", ownerX == user1.address);


      //expect(rewardBalance1).to.equal(0);
    });//how to get list: _holderTokens ??
  });

  describe("yyy", function () {
    it("see  changes", async function () {});
  });

  /*
   */
});

const sequentialRun = async (array) => {
  console.log('\ninside sequentialRun()... going to get each of inputArray');

  await asyncForEach(array, async (item, index) => {
    console.log(item);
    const result = await func1(xyz);
  });
  console.log('--------------==Done');
  console.log('SequentialRun() has been completed.\nAll input array elements have been cycled through');
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
