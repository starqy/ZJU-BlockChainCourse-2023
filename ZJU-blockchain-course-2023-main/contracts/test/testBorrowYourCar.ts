import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const BorrowYourCar = await ethers.getContractFactory("BorrowYourCar");
    const borrowYourCar = await BorrowYourCar.deploy("CarNFT","cNFT");
    console.log(`BorrowYourCar deployed to ${borrowYourCar.address}`);
    return { borrowYourCar, owner, otherAccount };
  }

  it("should increment the token counter and assign ownership", async function () {
    const { borrowYourCar ,owner} = await loadFixture(deployFixture);
    await borrowYourCar.mintCar();
    expect(await borrowYourCar.totalSupply()).to.equal(1);
  });

  it("Should return hello world", async function () {
      const { borrowYourCar } = await loadFixture(deployFixture);
      expect(await borrowYourCar.helloworld()).to.equal("hello world");
  });

});