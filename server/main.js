import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { encryptMessage, getSignature, aesEncrypt, rsaEncrypt } from '../crypto.js';
import { keyAES, ivAES, keyAESClient, ivAESClient, serverKey, publicKey, publicServer, privateKey, publicCredential, appId } from "../keyData.json";


Meteor.startup(() => {
    // code to run on server at startup
    console.log('Run on server');
});

const httpGetAsync = (url, options) => new Promise((resolve, reject) => {
    HTTP.get(url, options, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    })
})

const httpPostAsync = (url, options) => new Promise((resolve, reject) => {
    HTTP.post(url, options, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    })
})

Meteor.methods({
    async getLogs(param) { //getLogs
        console.log('Getting getLogs', param);
        // console.log('Getting getLogs2', JSON.stringify(param));
        try {
            if(param != 'all') {
                param = JSON.stringify(param);
            }
            const response = await httpGetAsync('http://192.168.0.96:8208/log/log', {
                'headers': {
                    'Content-Type': 'application/json',
                    'signature': 'signature',
                    'token': 'token',
                    'param': param
                }
            });
            // console.log('response getLogs', response.data);
            return response.data;
        } catch (ex) {
            throw new Meteor.Error('some-error', ex);
        }
    },
    async login(params) { //login
        let p={};
        let data = {
            'email': params.email,
            'password': params.password
        };
        // data = iterateObject(data)
        // console.log('data =>',data);

        p.params = iterateObject(data)
        // p = {
        //     params: {
        //         'email': params.email,
        //         'password': params.password
        //     }
        // };
        console.log('param =>',JSON.stringify(p))
        let signature = getSignature();
        signature = aesEncrypt(signature)
        let clientKey = aesEncrypt(publicKey);
        let aes = rsaEncrypt(ivAESClient);

        try {
            const response = await httpPostAsync('http://192.168.0.59:8202/authentication/login/employee', {
                'headers': {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Cache-Control": "no-cache",
                    'signature' : signature,
                    'clientKey' : clientKey,
                    'params' : JSON.stringify(p),
                    'aes' : aes
                },
                // body: '{"params":{"email":"rNdZP6lER9SmlNw4FfJq4RKlF6SVpwVYScYj3b2O3C5rStofU6BZgfnpb8B1C0RllA7KFrr2Oxn1VNzCOd9h6ddgWKVPn81ZLbPWycP7c53sQhdIAvy6ICPiaO2DGR9ZcwGpCaaQKrjDzysA6oxy/94wWHMC9ucJsRL7KTeIdOmZ6Aq4sF8bto1k0JwZbQr5sHkH0gymsHLCP0OxhvtQ9cL/2jDv9NQmhTgIpCepHUs=","password":"n9RPaOtdGbfG4CSRuUPX/71A9nSxExee6mOWRC2TGrZmLjyCHmIBsX6cmjY+w8tgiccG0xY2Px89sjgSHbpDJJd/CGsVEAl/e4zfgAz55EevzIqDSWthSHXDdl+PiwPVjqSGJMDa0gotQWMWQzLVbU0iyhGMMZs2mEqqR5fBXjBJ9xNSYLI94v4FIdWruN6gDxd7AqtNFYEgaHq97mUI62KqhultUmAZu2nZLbf0P8Y="}}'
                "processData": false,
                "body": JSON.stringify(p)
            });
            // const response = await httpGetAsync('http://192.168.0.59:8208/log/log', {
            //     'headers': {
            //         'Content-Type': 'application/json',
            //         'signature': 'signature',
            //         'token': 'token',
            //         'param': param
            //     }
            // });            
            // console.log('response getLogs', response.data);
            return response.data; 
        } catch (ex) {
            throw new Meteor.Error('some-error', ex);
        }
    },
});

function iterateObject(obj) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object") {
        iterateObject(obj[key]);
      } else {
        obj[key] = encryptMessage(obj[key]);
      }
    });
    return obj;
  }