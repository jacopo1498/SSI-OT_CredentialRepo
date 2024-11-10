import { ethers } from 'hardhat'

//this script deploys the DIDregistry on the hardhat network
async function main() {
     // We get the contract to deploy
    const RegistryContract = await ethers.getContractFactory('EthereumDIDRegistry')
    const contractInstance = await RegistryContract.deploy()

    // Wait for the deployment transaction to be mined
    // Check if deploymentTransaction is not null before calling wait()
    if (contractInstance.deploymentTransaction() !== null) {
        await contractInstance.deploymentTransaction()!.wait(); 
    } else {
        throw new Error("Deployment transaction error");
    }

    console.log('RegistryContract deployed to:', contractInstance.target)
  }
  
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  