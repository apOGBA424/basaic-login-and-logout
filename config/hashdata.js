
const crypto = require('crypto');
const {v4: uuidv4} = require('uuid');

// variables
const algorithm = 'aes-256-cbc';
const secretKey = 'some secret password'; //will come from .env file
let password; //user sign-up password
const logSummary = {logID: uuidv4().toString(), recovery: password}; // stores user password in plain test

let encryptedResultTRIM;

// encrypt data
function encryptFunction(dataToEncrypt) {
    const encryptWord = crypto.createCipher(algorithm, secretKey);
    let encryptedData = encryptWord.update(JSON.stringify(dataToEncrypt), 'utf-8', 'hex');
    encryptedData += encryptWord.final('hex');

    encryptedResultTRIM = encryptedData;

    console.log(encryptedResultTRIM);

    return encryptedResultTRIM;
}

// decrypt data
function decryptFunction(dataToDecrypt) {
    const decryptConfig = crypto.createDecipher(algorithm, secretKey);
    let decryptData = decryptConfig.update(dataToDecrypt, 'hex', 'utf-8');
    decryptData += decryptConfig.final('utf-8');
    
    return decryptData;
}

// Example usage
const encryptedData = encryptFunction(logSummary);
const decryptedData = decryptFunction(encryptedData);

console.log(`Decrypted data: ${decryptedData}`);



// functions export
module.exports = { encryptFunction, decryptFunction};

