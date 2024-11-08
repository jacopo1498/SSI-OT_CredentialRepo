import { EthrDID } from 'ethr-did'
import { Issuer } from 'did-jwt-vc'
import { Resolver } from 'did-resolver'
import getResolver from 'ethr-did-resolver'
import { JwtCredentialPayload, createVerifiableCredentialJwt, verifyCredential } from 'did-jwt-vc'

const issuer = new EthrDID({
  identifier: "did:ethr:0x7a69:0x038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75",
  privateKey: 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
}) as Issuer

const registryAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const chainId = 31337;

// Set up  resolver
const vcResolver = getResolver.getResolver(
    {
        rpcUrl: "http://127.0.0.1:8545",
        registry: registryAddress,
        chainId: chainId,
        provider
    }
);
const Res = new Resolver(vcResolver)


const vcPayload: JwtCredentialPayload = {
    sub: 'did:ethr:0x7a69:0x02ba5734d8f7091719471e7f7ed6b9df170dc70cc661ca05e688601ad984f068b0',
    iat: Math.floor(Date.now() / 1000), // Current time in seconds
    vc: {
      '@context': ["https://www.w3.org/ns/credentials/v2"],
      type: ['VerifiableCredential', 'IdentityCard - like'],
      credentialSubject: {
      }
    }
  };


//prepari la vc con la roba base (metadata, header ,ecc...) poi aggiungi gli attributi che ti servono dopo
vcPayload['vc']['credentialSubject']['nome']="pincopanco";
vcPayload['vc']['credentialSubject']['cognome']="pencopunco";


(async () => {
    const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer);
    console.log(vcJwt);
    const verifiedCredential= await verifyCredential(vcJwt, Res,{});
    console.log(verifiedCredential)
})();

