const fs = require("fs");

import { keyAES, ivAES, keyAESClient, ivAESClient, serverKey, publicKey, publicServer, privateKey, publicCredential, appId } from "./keyData.json";

// console.log('serverKey =>',serverKey);
// console.log('publicKey =>',publicKey);
// console.log('publicServer =>',publicServer);
// console.log('privateKey =>',privateKey);

const Cryptr = require('cryptr');
const crypto = require('crypto');
const cryptr = new Cryptr(serverKey);
const NodeRSA = require('node-rsa');
const pub = publicKey;
const pubServer = publicServer;
const priv = privateKey;
function aesEncrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', keyAES, ivAES);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }
  
  function aesDecrypt(text) {
    let decipher = crypto.createDecipheriv('aes-256-cbc', keyAESClient, ivAESClient);
    let decrypted = decipher.update(text, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
  }
  
  function rsaEncrypt(text) {
    const keyPub = new NodeRSA(pubServer);
    let encrypted = keyPub.encrypt(text, 'base64');
    return encrypted;
  }
  
  function rsaDecrypt(text) {
    const keyPriv = new NodeRSA(priv);
    let decrypted = keyPriv.decrypt(text, 'utf8')
    return decrypted;
  }
  
  function encryptMessage(text) {
    try {
        let rsaFirst = rsaEncrypt(text);
        let aesThen = aesEncrypt(rsaFirst);
        return aesThen;
    } catch (err) {
        return err;
    }
  }
  
  function decryptMessage(text) {
    let finalDecrypt;
    try {
        let aesFirst = aesDecrypt(text);
        finalDecrypt = rsaDecrypt(aesFirst);
    } catch (err) {
      try{
        finalDecrypt = aesDecrypt(text);
      }catch(f){
        try{
          finalDecrypt = rsaDecrypt(text);
        }catch(g){
          finalDecrypt = g;
        }
      }
    }
    return finalDecrypt;
  }
  function getSignature() {
    const pb = publicCredential;
    const cryptr = new Cryptr(pb);
    let ss1 = [appId, '903801a3bfa89376'];
    let ss2 = ss1.join('|');
    const signature = cryptr.encrypt(ss2);
    return signature;
  }

  module.exports = {aesEncrypt,aesDecrypt,rsaEncrypt,rsaDecrypt,encryptMessage,decryptMessage,getSignature,pub,priv,cryptr,keyAESClient,ivAESClient};