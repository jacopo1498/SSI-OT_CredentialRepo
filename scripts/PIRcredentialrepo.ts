import { EthrDID } from 'ethr-did'
import { Issuer } from 'did-jwt-vc'
import { Resolver } from 'did-resolver'
import getResolver from 'ethr-did-resolver'
import { JwtCredentialPayload, createVerifiableCredentialJwt, verifyCredential } from 'did-jwt-vc'
import { StoreKey } from './RECEIVERClass';
import { StoreEncVC } from './SENDERClass';

//this is necessary for ot... basically simulates communication with a dummy socket curtesy of wyatt-howe
var IO = require('./io-example.js');

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


//setting up stuff needed for the decentralized identity
const issuer = new EthrDID({
  identifier: "did:ethr:0x7a69:0x038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75",
  privateKey: 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
}) as Issuer

//second issuer as example (different issuer->different usecase for VC)
const issuer2 = new EthrDID({
    identifier: "did:ethr:0x7a69:0x039d9031e97dd78ff8c15aa86939de9b1e791066a0224e331bc962a2099a7b1f04",
    privateKey: '5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
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
  
vcPayload['vc']['credentialSubject']['nome']="pincopanco-encryptato";
vcPayload['vc']['credentialSubject']['cognome']="pencopunco-encryptato";

const vcPayload2: JwtCredentialPayload = {
    sub: 'did:ethr:0x7a69:0x02ba5734d8f7091719471e7f7ed6b9df170dc70cc661ca05e688601ad984f068b0',
    iat: Math.floor(Date.now() / 1000), // Current time in seconds
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: {
      }
    }
  };
  
vcPayload2['vc']['credentialSubject']['Degree']="Bachelor";
vcPayload2['vc']['credentialSubject']['Mnumber']="019283";

const vcPayload3: JwtCredentialPayload = {
    sub: 'did:ethr:0x7a69:0x02ba5734d8f7091719471e7f7ed6b9df170dc70cc661ca05e688601ad984f068b0',
    iat: Math.floor(Date.now() / 1000), // Current time in seconds
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: {
      }
    }
  };

vcPayload3['vc']['credentialSubject']['TaxNumber']="2142414291659129721";
vcPayload3['vc']['credentialSubject']['TaxBrachet']="5A";


/* 0-choose an ID and a key for a VC to use (store binding ID-VC name)
   1-take my VC and encrypt them, append ID to recognize them later
   2-give server encrypted VC with an ID  
   3-server extract ID (wich has no meaning for him)
   4-START OF OT, server presents ID's to choose
   5-i recognize an ID and choose the index appropriately (receiver does not know this)
   6-throught OT i receive the desired VC and i decrypt it whith the corresponding key

    SENDER (CRED REPO)     <---------->     RECEIVER (USER)

   */

//ID of VC: combination of iss, sub, iat (issuanceDate) -> hash (+salt just in case)



async function main() {
    const savedVCK_receiver = new StoreKey;
    const savedEVC_sender = new StoreEncVC;
    const N = 3;
    const op_id = '1in3ot';  

    //RECEIVER IS CYAN
    //SENDER IS PURPLE

    //user part
    //user encripts all the vc and keeps track of the matching between ID - key - name
    const vcJwt0 = await createVerifiableCredentialJwt(vcPayload, issuer);
    const vcJwt1 = await createVerifiableCredentialJwt(vcPayload2, issuer2);
    const vcJwt2 = await createVerifiableCredentialJwt(vcPayload3, issuer);
    console.log(vcJwt0);
    const verifiedCredential0= await verifyCredential(vcJwt0, Res,{});
    console.log(verifiedCredential0)
    console.log(vcJwt1);
    const verifiedCredential1= await verifyCredential(vcJwt1, Res,{});
    console.log(verifiedCredential1)
    console.log(vcJwt2);
    const verifiedCredential2= await verifyCredential(vcJwt2, Res,{});
    console.log(verifiedCredential2)

    const EncVC0 =savedVCK_receiver.storeVCkey(vcJwt0,"test-identità dig");
    const EncVC1 =savedVCK_receiver.storeVCkey(vcJwt1,"test-università");
    const EncVC2 =savedVCK_receiver.storeVCkey(vcJwt2,"test-tasse");

    if(!EncVC0 || !EncVC1 || !EncVC2){
        console.error("error in encrypting VC")
    }
    console.log(colorString(Color.FgWhite, "encrypted VC:"));
    console.log(colorString(Color.FgCyan, EncVC0!.toString('utf-8')));
    console.log(colorString(Color.FgWhite, "encrypted VC:"));
    console.log(colorString(Color.FgCyan, EncVC1!.toString('utf-8')));
    console.log(colorString(Color.FgWhite, "encrypted VC:"));
    console.log(colorString(Color.FgCyan, EncVC2!.toString('utf-8')));



    //cred rep part
    //the repo saves the encripted vc it recievs indexing them on the id appended to the evc
    if(!savedEVC_sender.storeEVC(EncVC0!) || !savedEVC_sender.storeEVC(EncVC1!) || !savedEVC_sender.storeEVC(EncVC2!)){
        console.error("error in storing the Enc VC");
    }

    console.log(colorString(Color.FgWhite, "stored vc in the cred rep:"));
    const ids = savedEVC_sender.listAllIds();
    for (let i = 0; i < ids.length; i++) {
        console.log(colorString(Color.FgMagenta,ids[i]));
    }

    //now OT starts, sender (cred repo) must not know wich id the sender chooses
    //sender reads the vc stored int he repo and receiver chooses the one he whants
    console.log(colorString(Color.FgWhite, "receiver reads avaliable vc:"));
    for (let i = 0; i < ids.length; i++) {
        console.log(colorString(Color.FgCyan,ids[i]));
        console.log(colorString(Color.FgCyan,savedVCK_receiver.getNameVC(ids[i])!));
    }

    //now receiver chooses the desired vc let's say 3
    const sender_choice = 1;
    let rec_vc = "";
    console.log(colorString(Color.FgCyan, "\nI choose secret n. " + (sender_choice)));
    
    //OT starts
    const OT = require('1-out-of-n')(IO);

    await OT.then(async function (OT: any) {

        /*
         *  The sender (cred repo) calls:
         */
        OT.send( savedEVC_sender.listAllEncryptedVCs(), N, op_id);
        console.log(colorString(Color.FgMagenta,"Sender sends:"));
        console.log(savedEVC_sender.listAllEncryptedVCs());
        console.log(colorString(Color.FgMagenta,"to receiver"));

        /*
         *  The receiver (holder) calls:
         */
        await OT.receive(sender_choice - 1, N, op_id).then(async (receivedData: Uint8Array) => {
            // Convert Uint8Array to Buffer
            const encryptedVCBuffer = Buffer.from(receivedData);
        
            // Now `encryptedVCBuffer` is a Buffer and can be used with decryption functions
            console.log(colorString(Color.FgCyan,"Secret #"+sender_choice+" as a Buffer:")); 
            console.log(encryptedVCBuffer);

            // Proceed with decryption
            const decryptedVC = savedVCK_receiver.decryptVC(encryptedVCBuffer); 
            console.log(colorString(Color.FgCyan,"Decrypted VC:"+decryptedVC?.vc)); 
            rec_vc = decryptedVC?.vc!;
            const verifiedCredentialrec = await verifyCredential(rec_vc, Res, {});
            console.log("Verified Credential:", verifiedCredentialrec);
        });
      });


};

main().catch(console.error);
