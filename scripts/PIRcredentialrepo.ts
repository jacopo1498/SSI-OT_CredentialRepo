import { EthrDID } from 'ethr-did'
import { Issuer } from 'did-jwt-vc'
import { Resolver } from 'did-resolver'
import getResolver from 'ethr-did-resolver'
import { JwtCredentialPayload, createVerifiableCredentialJwt, verifyCredential } from 'did-jwt-vc'
import { StoreKey } from './senderClass';

//this is just to show things in the terminal in a nicer way
const Color = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    
    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    FgGray: "\x1b[90m",
    
    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
    BgGray: "\x1b[100m",
  }
  
  function colorString(color:string, msg:string) {
    return `${color}${msg}${Color.Reset}`;
  }
  
  function colorLog(color:string, ...args: any[]) {
    console.log(...args.map(
     (it) => typeof it === "string" ? colorString(color, it) : it
    ));
  }

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

/* this is the credential repository example / "hot wallets" */

const vcPayload: JwtCredentialPayload = {
    sub: 'did:ethr:0x7a69:0x02ba5734d8f7091719471e7f7ed6b9df170dc70cc661ca05e688601ad984f068b0',
    iat: Math.floor(Date.now() / 1000), // Current time in seconds
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: {
      }
    }
  };


//prepari la vc con la roba base (metadata, header ,ecc...) poi aggiungi gli attributi che ti servono dopo
vcPayload['vc']['credentialSubject']['nome']="pincopanco-encryptato";
vcPayload['vc']['credentialSubject']['cognome']="pencopunco-encryptato";

/* 0-choose an ID and a key for a VC to use (store binding ID-VC name)
   1-take my VC and encrypt them, append ID to recognize them later
   2-give server encrypted VC with an ID  
   3-server extract ID (wich has no meaning for him)
   4-START OF OT, server presents ID's to choose
   5-i recognize an ID and choose the index appropriately (receiver does not know this)
   6-throught OT i receive the desired VC and i decrypt it whith the corresponding key
   */

//ID of VC: combination of iss, sub, iat (issuanceDate) -> hash? (+salt just in case)



async function main() {
    const savedVC = new StoreKey;
    const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer);
    console.log(vcJwt);
    const EncVC =savedVC.storeVC(vcJwt,"test1");
    console.log(colorString(Color.FgCyan, "encrypted VC:"));
    console.log(colorString(Color.FgCyan, EncVC!.toString('utf-8')));
    const verifiedCredential= await verifyCredential(vcJwt, Res,{});
    console.log(verifiedCredential)
};

main().catch(console.error);
