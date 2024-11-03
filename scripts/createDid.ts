const { Resolver } = require('did-resolver');
import { getResolver } from "ethr-did-resolver";
const { ethers } = require("hardhat");
import { computePublicKey } from '@ethersproject/signing-key'
import { EthrDID } from 'ethr-did'



async function main() {
    const registryAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; //Account 0
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const publicKey = computePublicKey(privateKey, true);
    const uncompressedPublicKey = computePublicKey(privateKey, false);
    console.log("Public Key: "+publicKey);
    console.log("Private Key: "+ privateKey);

    // Set up DID resolver
    const didResolver = new Resolver(
        getResolver({
            rpcUrl: "http://127.0.0.1:8545",
            registry: registryAddress,
            chainId: 31337,
            provider
        })
    );

    const ethrDid = new EthrDID({ 
        identifier: wallet.address, 
        privateKey: privateKey, 
        provider, 
        chainNameOrId: 31337,
        registry: registryAddress});

    console.log("DID created:", ethrDid.did);

    // Add a signing delegate and resolve the DID
    /*
    Unfortunately, web3 providers are not directly able to sign data in a way that is compliant with the JWT ES256K 
    or the (unregistered) ES256K-R algorithms. This is a requirement for exchanging verifiable off-chain data, 
    so you will need to add a key pair as a delegate or as an attribute to be able to sign JWTs
    try {
        const { kp, txHash } = await ethrDid.createSigningDelegate(); // Adds a signing delegate valid for 1 day
        console.log("Created signing delegate keypair:", kp);
        console.log("Transaction hash for delegate creation:", txHash);

        // Resolve the DID Document
        const didDocument = await didResolver.resolve(ethrDid.did);
        console.log("Resolved DID Document:", JSON.stringify(didDocument, null, 2));
    } catch (error) {
        console.error("Error creating signing delegate or resolving DID:", error);
    }    */

}

main().catch(console.error);
