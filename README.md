# Project

testing an JWT-VC + OT idea, with hardhat network

## Idea 
The credential repository is an entity responsible for securely storing the holder's Verifiable Credentials (VC), as described by w3.org: *"Software, such as a file system, storage vault, or personal verifiable credential wallet, that stores and protects access to holders' verifiable credentials"*.

This credential repository can be implemented in a self-hosted way (thus, as a personal wallet) or through an external service that manages storage on behalf of the holder. This might seem counter-intuitive to the concept of SSI (self-sovereign identities), but there may be valid reasons for doing so:

- Some users might prefer the convenience of an external custodian that offers an easier setup compared to self-hosting, perhaps trusting its capability to securely protect stored VCs more than their own.

- Additionally, storing VCs in the cloud can serve as a useful backup. Imagine a self-hosting user loses their device...

The Trust Model for VCs states the following regarding credential repositories: *"The holder expects the credential repository to store credentials securely, to not release credentials to anyone other than the holder (who may subsequently present them to a verifier), and to not corrupt nor lose credentials while they are in its care"*. Thus, the focus is on securely storing credentials, ensuring they are not released to unauthorized individuals, and maintaining the integrity of VCs in its possession.

I couldn’t help but notice one thing: the trust model does not address the privacy of the holder in cases where they are not self-hosting. For example, it does not discuss the information that the credential repository might collect, while still maintaining the assumptions mentioned above. Let’s take an example: an holder encrypts their VCs to store them securely in an "external" credential repository. This theoretically guarantees privacy for the holder, as well as security in case of unauthorized release of the credentials. 

However, the manager of the credential repository can still infer certain information: for example, they can observe how frequently a particular credential is requested in comparison to others (and therefore possibly deduce which is more important to the holder if it is requested more often), or see correlations between used VCs and specific periods/dates, which could help them infer what type of VC it might be.

Using OT (Oblivious Transfer) allows the holder to access their VCs privately without any information being inferred about the stored VCs, as the "traffic" between the holder and the credential repository is concealed. This means that the credential repository cannot deduce which specific VCs are being accessed or any other details, ensuring enhanced privacy for the holder.

![cred repo schema](./schema%20credential%20repository.png)

This projects simulates a credential repository and a user communicating, it is meant to demonstrate the privacy preserving capailities of OT, the hardhat network is used to host the did registry necessary to verify did's.

The 1-out of-n protocol is is provided through the [1-out-of-n library](https://github.com/wyatt-howe/1-out-of-n) by wyatt-howe.

## Istructions
Start the hardhat node

    npx hardhat node

in the project folder then deploy the registry, the Digital identities and the private information retrival experiment.

    npx hardhat run scripts/deploy.ts --network localhost

    npx hardhat run scripts/createDidJWT.ts --network localhost

    npx hardhat run scripts/createDidJWT2.ts --network localhost

    npx hardhat run scripts/createDidJWT3.ts --network localhost

    npx hardhat run scripts/PIRcredentialrepo.ts --network localhost

