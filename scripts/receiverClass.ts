
import * as crypto from 'crypto';
 
export class StoreEncVC {
    private store: Map<string,Buffer>;

    constructor() {
        this.store = new Map();
    }

    private extractid(encryptedData: Buffer): string|undefined{
        const idCodeBuffer = encryptedData.subarray(-32);  // Extract the last 32 bytes as ID code
        const iddata = idCodeBuffer.toString('utf-8');
        if (!iddata){
            console.error("error in the retrival of the id");
            return;
        }
        return iddata;
    }

    // Stores the encrypted VC with a unique ID as the index
    public storeEVC(Evc: Buffer){
        const id = this.extractid(Evc);
        if (!id){
            console.error("error in the generation of the ID");
            return false;
        }
        this.store.set(id, Evc);  // Store encrypted VC using generated ID
        return true;
    }

    // The underlying Map object in JavaScript (and TypeScript) 
    //preserves the order of key-value pairs based on the order of insertion.

    //list all IDs
    public listAllIds(): string[] {
        return Array.from(this.store.keys());
    }

    //list all encrypted VCs
    public listAllEncryptedVCs(): Buffer[] {
        return Array.from(this.store.values());
    }

}
