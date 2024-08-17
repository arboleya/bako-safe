import { concat, hexlify, sha256 } from 'fuels';
import { secp256r1 } from '@noble/curves/p256';
import { parseSignChallangeResponse } from 'bakosafe/src';
import { randomBytes } from 'crypto';

type MockWebAuthnCredential = {
  address: string;
  publicKey: Uint8Array;
  privateKey: Uint8Array;
};

export function WebAuthn_createCredentials(): MockWebAuthnCredential {
  const privateKey = secp256r1.utils.randomPrivateKey();
  const publicKey = secp256r1.getPublicKey(privateKey, false).slice(1);
  return {
    address: sha256(publicKey),
    publicKey,
    privateKey,
  };
}

export function WebAuthn_signChallange(
  credential: MockWebAuthnCredential,
  challenge: string,
) {
  const dataJSON: Record<string, string | boolean> = {
    type: 'webauthn.get',
    challenge,
    origin: 'http://mocktest.test',
    crossOrigin: false,
  };
  // Emulates random data injected by WebAuthn to make sure
  // that developers know that dataJSON struct can change over time
  if (Math.random() * 100 > 40) {
    dataJSON.random = 'Random data';
  }
  // On this case we ignore the authenticatorData field and just generate random data
  const authenticatorData = randomBytes(64);
  // Convert the dataJSON to a byte array
  const clientDataJSON = new TextEncoder().encode(JSON.stringify(dataJSON));
  // Hash data in the same order webauthn does before signing
  const clientHash = sha256(clientDataJSON);
  const digest = sha256(concat([authenticatorData, clientHash]));
  // Sign the digest using the credential private key
  const sig = secp256r1.sign(digest.slice(2), credential.privateKey);

  const mockReponseWebAuthn = {
    response: {
      signature: sig.toDERRawBytes(false),
      authenticatorData,
      clientDataJSON,
    },
  };
  return parseSignChallangeResponse(
    hexlify(credential.publicKey),
    challenge,
    mockReponseWebAuthn,
  );
}