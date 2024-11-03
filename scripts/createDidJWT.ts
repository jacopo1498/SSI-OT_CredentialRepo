const { Resolver } = require('did-resolver');
import getResolver from 'ethr-did-resolver'
const didJWT = require('did-jwt');
const { ethers } = require("hardhat");
import { computePublicKey } from '@ethersproject/signing-key'
import { EthrDID } from 'ethr-did'
import { createJWT, verifyJWT } from "did-jwt";


async function main() {
    const registryAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    //const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; //Account 0
    const privateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; //Account 0
    const wallet = new ethers.Wallet(privateKey, provider);
    const chainId = 31337;

    const publicKey = computePublicKey(privateKey, true);
    const uncompressedPublicKey = computePublicKey(privateKey, false);
    console.log("Public Key: "+publicKey);
    console.log("Private Key: "+privateKey);
    const identifier = `did:ethr:${chainId}:${publicKey}`;
    //const signer = provider.getSigner(0); //for this experiment i am using account #0
    const signer = provider.getSigner(1); //for this experiment i am using account #0
    let signJ=didJWT.ES256KSigner(Buffer.from(privateKey.slice(2), 'hex'),false);

    // Set up DID resolver
    const ethrDidResolver = getResolver.getResolver(
        {
            rpcUrl: "http://127.0.0.1:8545",
            registry: registryAddress,
            chainId: chainId,
            provider
        }
    );
    const didResolver = new Resolver(ethrDidResolver)

    const ethrDid = new EthrDID({ 
        txSigner: signer,
        //privateKey : privateKey,
        signer: signJ,
        identifier: identifier,
        registry: registryAddress,
        chainNameOrId: chainId,
        alg: 'ES256K',
        provider});

    console.log("DID created:", ethrDid.did);

}
    
    main().catch(console.error);
    
