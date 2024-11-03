import { EthrDID } from 'ethr-did'
import { Issuer } from 'did-jwt-vc'
import { JwtCredentialPayload, createVerifiableCredentialJwt } from 'did-jwt-vc'

const issuer = new EthrDID({
  identifier: "did:ethr:0x7a69:0x038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75",
  privateKey: 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
}) as Issuer

var x = Date.now() / 1000;


const vcPayload: JwtCredentialPayload = {
    sub: 'did:ethr:0x7a69:0x02ba5734d8f7091719471e7f7ed6b9df170dc70cc661ca05e688601ad984f068b0',
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: {
        degree: {
          type: 'Degree',
          name: 'testdegree'
        }
      }
    }
  };


(async () => {
    const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer);
    console.log(vcJwt);
})();

