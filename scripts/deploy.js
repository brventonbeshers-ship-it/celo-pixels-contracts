const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying PixelCanvasV2...");
  const Contract = await ethers.getContractFactory("PixelCanvasV2");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();
  console.log("PixelCanvasV2 deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
