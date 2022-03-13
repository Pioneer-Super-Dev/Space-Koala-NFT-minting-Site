// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  console.log(network.name);
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("NFT");
  const token = await Token.deploy("Space Koalas", "SPAKOA", "https://gateway.pinata.cloud/ipfs/QmR1dyLTKLVh3qHy7Sr2ZL3Jp9R3hBememL77sRTaiFPHn/");
  await token.deployed();

  console.log("Token address:", token.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const frontendContractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir);
  }
  fs.writeFileSync(
    frontendContractsDir + "/contract-address.json",
    JSON.stringify({ Token: token.address }, undefined, 2)
  );
  const TokenArtifact = artifacts.readArtifactSync("NFT");

  fs.writeFileSync(
    frontendContractsDir + "/NFT.json",
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
