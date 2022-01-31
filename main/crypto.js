const fs = require("fs");
const openpgp = require("openpgp");
const { readKeyFile } = require("./key");

module.exports = {
  encryptText: async (keyFilePath, isBinary, text) => {
    const publicKey = await readKeyFile(keyFilePath, isBinary);
    const message = await openpgp.Message.fromText(text);
    return openpgp.encrypt({ message, publicKeys: publicKey, armor: false });
  },

  encryptFile: async (keyFilePath, isBinary, filePlain) => {
    const publicKey = await readKeyFile(keyFilePath, isBinary);
    const plainData = fs.readFileSync(filePlain); //fs.createReadStream(filePlain);
    const message = await openpgp.Message.fromBinary(plainData);
    return openpgp.encrypt({ message, publicKeys: publicKey, armor: false });
  },

  encryptConfig: async (keyFilePath, isBinary, filePlain) => {
    const publicKey = await readKeyFile(keyFilePath, isBinary);
    const plainData = fs.readFileSync(filePlain);
    const message = await openpgp.Message.fromBinary(plainData);
    return openpgp.encrypt({ message, publicKeys: publicKey, armor: false });
  },

  encryptVPN: async (keyFilePath, isBinary, filePlain) => {
    const publicKey = await readKeyFile(keyFilePath, isBinary);
    const plainData = fs.readFileSync(filePlain);
    const message = await openpgp.Message.fromBinary(plainData);
    return openpgp.encrypt({ message, publicKeys: publicKey, armor: false });
  },

  armorMessage: async (message) => {
    return openpgp.armor(openpgp.enums.armor.message, message, 0, 1);
  },

  decryptText: async (keyFilePath, isBinary, passphrase, encrypted) => {
    const privateKey = await readKeyFile(keyFilePath, isBinary);
    await privateKey.decrypt(passphrase);
    console.log("after privateKey");

    const message = await openpgp.readMessage({
      armoredMessage: encrypted, // parse armored message
    });
    return openpgp.decrypt({ message, privateKeys: privateKey });
  },

  decryptFile: async (keyFilePath, isBinary, passphrase, fileEncrypted) => {
    const privateKey = await readKeyFile(keyFilePath, isBinary);
    await privateKey.decrypt(passphrase);
    console.log("after privateKey");

    console.log(fileEncrypted);
    // const encryptedData = fs.createReadStream(fileEncrypted);
    // const message = await openpgp.Message.fromBinary(encryptedData);
    // return message.decrypt([privateKey]);
    const binaryMessage = fs.readFileSync(fileEncrypted);
    const message = await openpgp.readMessage({ binaryMessage });
    console.log("Binary:");
    console.log(binaryMessage);
    console.log("Message:");
    console.log(message);
    console.log("Almost there");
    return openpgp.decrypt({ message, privateKeys: privateKey, format: 'binary' });
  },
};
