// Import required libraries
const { ethers } = require("ethers");
const { Resolver } = require("did-resolver");
const { getResolver } = require("ethr-did-resolver");
const EthrDID = require("ethr-did");

async function main() {
  // Local Hardhat network configuration
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  //did that needs to be resolved
  //const inputDID = "did:ethr:0x7a69:0x038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75"
  const inputDID = "did:ethr:0x7a69:0x02ba5734d8f7091719471e7f7ed6b9df170dc70cc661ca05e688601ad984f068b0"

  // Define the DID Registry address (assume it's deployed at this address on the local network)
  const registryAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // replace with actual address if different

  // Configure the Ethr DID Resolver
  const didResolver = new Resolver({
    ...getResolver({
      provider,           // ethers provider for the Hardhat network
      registry: registryAddress,
      chainId: 31337,      // Chain ID for Hardhat
      rpcUrl: "http://127.0.0.1:8545",
    }),
  });


  // Resolve the DID Document
  try {
    const didDocument = await didResolver.resolve(inputDID);
    console.log("Resolved DID Document:", JSON.stringify(didDocument, null, 2));
  } catch (error) {
    console.error("Error resolving DID:", error);
  }
}

// Run the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
