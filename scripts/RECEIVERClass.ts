
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
 
export class StoreKey {
    private store: Map<string, { key: Buffer, name: string }>;

    constructor() {
        this.store = new Map();
    }
    //THIS ASSUMES VC HAVE BEEN VERIFIED
    private extractVCFields(vcJwt: string): { iss: string; sub: string; iat: number } | null {
        try {
            // Decode the JWT without verifying, since we only want to read its payload
            const decoded = jwt.decode(vcJwt, { complete: true });
            
            if (decoded && typeof decoded === 'object') {
                const { iss, sub, iat } = decoded.payload as { iss: string; sub: string; iat: number };
                return { iss, sub, iat };
            }
            return null;
        } catch (error) {
            console.error("Failed to decode JWT:", error);
            return null;
        }
    }

    // Generates a unique ID based on `iss`, `sub`, and `iat` with a random salt
    private generateVCID(vcJwt: string): string|undefined{
        const fields = this.extractVCFields(vcJwt);
        if (!fields) {
            console.error("Failed to extract fields.");
            return;
        }
        // Generate a random salt
        const salt = crypto.randomBytes(16).toString('hex');
        // Concatenate iss, sub, iat, and salt
        const baseString = `${fields.iss}${fields.sub}${fields.iat}${salt}`;
        // Hash the combined string with SHA-256
        const id = crypto.createHash('sha256').update(baseString).digest('hex');
        return id;
        //return also salt? do i want to be able to reconstruct the VCid?
    }

    // Encrypts the VC using AES and a specified key
    private encryptVC(vc: string, key: Buffer, id: string): Buffer {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        const encryptedData = Buffer.concat([
            cipher.update(vc),
            cipher.final(),
        ]);
        // Convert hex ID to a UTF-8 string (or directly to UTF-8 buffer if preferred)
        const idBufferHex = Buffer.from(id, 'hex');  // First, hex to buffer

        // Concatenate IV, encrypted data, and fixed-size ID code
        return Buffer.concat([iv, encryptedData, idBufferHex]);
    }

    // Stores the encrypted VC key with a unique ID as the index
    public storeVCkey(vc: string,customName: string){
        const id = this.generateVCID(vc);
        console.log("SAVED ID "+ id);
        if (!id){
            console.error("error in the generation of the ID");
            return;
        }
        // Generate a 256-bit encryption key
        const key = crypto.randomBytes(32);
        const encryptedVC = this.encryptVC(vc, key, id);
        this.store.set(id, {key:key, name:customName});  // Store encrypted VC key using generated ID
        return encryptedVC;
    }

    // Retrieves the encrypted VC from storage
    private retrieveVCdata(id: string){
        return this.store.get(id);
    }

    // Decrypts the VC using AES with a specified key and extracts the fixed-size ID code
    public decryptVC(encryptedData: Buffer){
        const iv = encryptedData.subarray(0, 16);  // Extract IV from the first 16 bytes
        const encryptedVC = encryptedData.subarray(16, -32);  // Extract encrypted data portion
        const idCodeBuffer = encryptedData.subarray(-32);  // Extract the last 32 bytes as ID code
        const vcdata = (this.retrieveVCdata(idCodeBuffer.toString('hex')));
        if (!vcdata){
            console.error("error in the retrival of the key");
            return;
        }
        const decipher = crypto.createDecipheriv('aes-256-cbc', vcdata.key, iv);

        const decryptedVC = Buffer.concat([
            decipher.update(encryptedVC),
            decipher.final(),
        ]);

        const id = idCodeBuffer.toString('utf-8').replace(/\0/g, '');  // Convert ID buffer to string, trim padding

        return {
            vc: decryptedVC.toString(),
            id: id
        };
    }
    // Returns the name of the verified credentials given the id (to be used with )
    public getNameVC(id: string){
        const vcdata = this.retrieveVCdata(id);
        if (!vcdata){
            console.error("error in the retrival of the key");
            return;
        }
        return vcdata.name;
    }
}
