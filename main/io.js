const { app, dialog } = require("electron");
const fs = require("fs-extra");
const path = require("path");
var AdmZip = require("adm-zip");
const axios = require('axios').default;

// local dependencies
const notification = require("./notification");
const crypto = require("./crypto");

const userData = app.getPath("userData");
fs.ensureDirSync(userData);
const keysDir = path.resolve(userData, "keys");
fs.ensureDirSync(keysDir);
const orgDir = path.resolve(userData, "org");
fs.ensureDirSync(orgDir);
const tsDir = path.resolve(orgDir);
fs.ensureDirSync(tsDir);

// add files
exports.addFiles = (files = []) => {
  // copy `files` recursively (ignore duplicate file names)
  files.forEach((file) => {
    const filePath = path.resolve(keysDir, file.name);

    if (!fs.existsSync(filePath)) {
      fs.copyFileSync(file.path, filePath);
    }
  });

  // display notification
  notification.filesAdded(files.length);
};

// add key pair
exports.addKey = (name, private, public) => {
  const privatePath = path.resolve(keysDir, `${name}-private.asc`);
  const publicPath = path.resolve(keysDir, `${name}-public.asc`);

  if (!fs.existsSync(privatePath)) {
    fs.writeFileSync(privatePath, private);
  }

  if (!fs.existsSync(publicPath)) {
    fs.writeFileSync(publicPath, public);
  }

  // display notification
  notification.filesAdded(2);
};

exports.addVpn = (username, password, config, path, type) => {
  let lastEncryptedMessage;
  var zipName = "config.zip"
  var zipLoc = tsDir
  var zipWrite = (zipLoc + "\\" + zipName);
  var nl = "\n"
  var com = username+nl+password+nl+config
  var zip = new AdmZip();
  zip.addFile("config.txt", Buffer.from(com, "utf8"), "");
  zip.writeZip(zipWrite);
  crypto.encryptConfig(path, type, zipWrite)
        .then((encryptedMessage) => {
          console.log(encryptedMessage);
          lastEncryptedMessage = encryptedMessage;

          const filePath = app.getPath('documents') + '/EncryptedVPNConfig.zip.gpg';
          let options = {
            defaultPath: filePath,
            title: "Save Encrypted VPN Config",
            buttonLabel: "Save Config File",
            filters:[
              {name: 'OpenPGP Encrypted File', extensions: ['gpg', 'pgp']}
            ]
          }
          dialog.showSaveDialog(options).then((result) => {
            fs.writeFile(result.filePath, lastEncryptedMessage, (err) => {
            });
          }).catch((err) => {
            console.log(err);
            dialog.showErrorBox("app", "Unable to find encrypted config file.");
          });


          // fs.writeFile(app.getPath('documents') + '/EncryptedConfig.zip.gpg', lastEncryptedMessage, function (err) {
          //   if (err) return console.log(err);
          //   console.log("saved");
          // });
        })
};

exports.addSsh = (username, password, ip, key, path, type) => {
  let lastEncryptedMessage;
  var zipName = "config.zip"
  var zipLoc = tsDir
  var zipWrite = (zipLoc + "\\" + zipName);
  var zip = new AdmZip();
  zip.addFile("username.txt", Buffer.from(username, "utf8"), "");
  zip.addFile("password.txt", Buffer.from(password, "utf8"), "");
  zip.addFile("ip.txt", Buffer.from(ip, "utf8"), "");
  zip.addFile("key.txt", Buffer.from(key, "utf8"), "");
  zip.writeZip(zipWrite);
  crypto.encryptConfig(path, type, zipWrite)
        .then((encryptedMessage) => {
          console.log(encryptedMessage);
          lastEncryptedMessage = encryptedMessage;

          const filePath = app.getPath('documents') + '/EncryptedSSHConfig.zip.gpg';
          let options = {
            defaultPath: filePath,
            title: "Save Encrypted SSH Config",
            buttonLabel: "Save Config File",
            filters:[
              {name: 'OpenPGP Encrypted File', extensions: ['gpg', 'pgp']}
            ]
          }
          dialog.showSaveDialog(options).then((result) => {
            fs.writeFile(result.filePath, lastEncryptedMessage, (err) => {
            });
          }).catch((err) => {
            console.log(err);
            dialog.showErrorBox("app", "Unable to find encrypted config file.");
          });


          // fs.writeFile(app.getPath('documents') + '/EncryptedConfig.zip.gpg', lastEncryptedMessage, function (err) {
          //   if (err) return console.log(err);
          //   console.log("saved");
          // });
        })
};

exports.addOrgInt = (apiKey) => {
  const key = apiKey;
  return axios.get('https://vpn-config-api.herokuapp.com/api/v1/material/internal', {
    headers: {
      'Content-Type': 'application/json',
      //'X-API-Key': key
    }
  })
  .then(function (response) {
    const material = response.data;
    function addNewlines(str) {
      var result = '';
      while (str.length > 0) {
        result += str.substring(0, 60) + '\n';
        str = str.substring(60);
      }
      return result;
    }
    var com1 = addNewlines(material);
    var com2 = com1.substring(0, com1.lastIndexOf("="));
    var com3 = com1.substring(com1.lastIndexOf("="), com1.length);
    var header = "-----BEGIN PGP PUBLIC KEY BLOCK-----"
    var footer = "-----END PGP PUBLIC KEY BLOCK-----"
    var nl = "\n"
    var com4 = header+nl+nl+com2+nl+com3+footer;
    const keyPath1 = path.resolve(orgDir, `ts-pub.asc`);
    const keyPath2 = path.resolve(orgDir, `ts-pvt.asc`);
    if (fs.existsSync(keyPath1)) {
      fs.unlinkSync(keyPath1);
    }
    if (fs.existsSync(keyPath2)) {
      fs.unlinkSync(keyPath2);
    }
    if (!fs.existsSync(keyPath1)) {
      fs.writeFileSync(keyPath1, com4);
    }
    if (!fs.existsSync(keyPath2)) {
      fs.writeFileSync(keyPath2, com4);
    }
    return 1
  })
  .catch(function (error) {
    if(error.response.status == 403) {
      dialog.showErrorBox("RTS EM", "No Key Given");
      return 0
    } else if(error.response.status == 401) {
      dialog.showErrorBox("RTS EM", "Invalid Key");
      return 0
    } else if(error.request) {
      console.log(error.request);
      return 0
    } else {
      console.error('error:', error);
      console.log('statusCode:', error.response && error.response.status);
      console.log('body:', error.response.data);
      throw new Error("see above^^^");
    }
  });
};

exports.addOrgLoc = (apiKey) => {
  const key = apiKey;
  return axios.get('https://vpn-config-api.herokuapp.com/api/v1/material/local', {
    headers: {
      'Content-Type': 'application/json',
      //'X-API-Key': key
    }
  })
  .then(function (response) {
    const material = response.data;
    function addNewlines(str) {
      var result = '';
      while (str.length > 0) {
        result += str.substring(0, 60) + '\n';
        str = str.substring(60);
      }
      return result;
    }
    var com1 = addNewlines(material);
    var com2 = com1.substring(0, com1.lastIndexOf("="));
    var com3 = com1.substring(com1.lastIndexOf("="), com1.length);
    var header = "-----BEGIN PGP PUBLIC KEY BLOCK-----"
    var footer = "-----END PGP PUBLIC KEY BLOCK-----"
    var nl = "\n"
    var com4 = header+nl+nl+com2+nl+com3+footer;
    const keyPath1 = path.resolve(orgDir, `ts-pub.asc`);
    const keyPath2 = path.resolve(orgDir, `ts-pvt.asc`);
    if (fs.existsSync(keyPath1)) {
      fs.unlinkSync(keyPath1);
    }
    if (fs.existsSync(keyPath2)) {
      fs.unlinkSync(keyPath2);
    }
    if (!fs.existsSync(keyPath1)) {
      fs.writeFileSync(keyPath1, com4);
    }
    if (!fs.existsSync(keyPath2)) {
      fs.writeFileSync(keyPath2, com4);
    }
    return 1
  })
  .catch(function (error) {
    if(error.response.status == 403) {
      dialog.showErrorBox("RTS EM", "No Key Given");
      return 0
    } else if(error.response.status == 401) {
      dialog.showErrorBox("RTS EM", "Invalid Key");
      return 0
    } else if(error.request) {
      console.log(error.request);
      return 0
    } else {
      console.error('error:', error);
      console.log('statusCode:', error.response && error.response.status);
      console.log('body:', error.response.data);
      throw new Error("see above^^^");
    }
  });
};

exports.removeOrg = () => {
  const keyPath1 = path.resolve(orgDir, `ts-pub.asc`);
  if (fs.existsSync(keyPath1)) {
    fs.unlinkSync(keyPath1);
  }
  const keyPath2 = path.resolve(orgDir, `ts-pvt.asc`);
  if (fs.existsSync(keyPath2)) {
    fs.unlinkSync(keyPath2);
  }
  const configPath = path.resolve(orgDir, `config.zip`);
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
};

exports.getOrg = () => {
  // const options = {
  //   url: 'http://localhost:5000/api/v1/material',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-API-Key': ''
  //   }
  // };

  // function callback(error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     const material = JSON.parse(body);
  //     function addNewlines(str) {
  //       var result = '';
  //       while (str.length > 0) {
  //         result += str.substring(0, 60) + '\n';
  //         str = str.substring(60);
  //       }
  //       return result;
  //     }
  //     var com1 = addNewlines(material);
  //     var com2 = com1.substring(0, com1.lastIndexOf("="));
  //     var com3 = com1.substring(com1.lastIndexOf("="), com1.length);
  //     var header = "-----BEGIN PGP PUBLIC KEY BLOCK-----"
  //     var footer = "-----END PGP PUBLIC KEY BLOCK-----"
  //     var nl = "\n"
  //     var com4 = header+nl+nl+com2+nl+com3+footer;

  //     const keyPath1 = path.resolve(orgDir, `ts-pub.asc`);
  //     if (!fs.existsSync(keyPath1)) {
  //       fs.writeFileSync(keyPath1, com4);
  //     }
  //     const keyPath2 = path.resolve(orgDir, `ts-pvt.asc`);
  //     if (!fs.existsSync(keyPath2)) {
  //       fs.writeFileSync(keyPath2, com4);
  //     }
  //   } else if(response.statusCode == 403) {
  //     dialog.showErrorBox("RTS EM", "Invalid Key");
  //   } else {
  //     console.error('error:', error);
  //     console.log('statusCode:', response && response.statusCode);
  //     console.log('body:', body);
  //   }
  // }
  // request(options, callback);
};

exports.tsZip = () => {
  const files = fs.readdirSync(orgDir);

  return files
    .filter((file) => [".zip"].includes(path.extname(file)))
    .map((filename) => {
      const filePath = path.resolve(orgDir, filename);
      const fileStats = fs.statSync(filePath);
      return {
        name: filename,
        path: filePath,
        size: Number(fileStats.size / 1000).toFixed(1), // kb
      };
    });
};

exports.tsKey = () => {
  const files = fs.readdirSync(orgDir);

  return files
    .filter((file) => [".asc", ".key"].includes(path.extname(file)))
    .map((filename) => {
      const filePath = path.resolve(orgDir, filename);
      const fileStats = fs.statSync(filePath);
      return {
        name: filename,
        path: filePath,
        size: Number(fileStats.size / 1000).toFixed(1), // kb
      };
    });
};

// get the list of keys
exports.getKeys = () => {
  const files = fs.readdirSync(keysDir);

  return files
    .filter((file) => [".asc", ".key"].includes(path.extname(file)))
    .map((filename) => {
      const filePath = path.resolve(keysDir, filename);
      const fileStats = fs.statSync(filePath);
      return {
        name: filename,
        path: filePath,
        size: Number(fileStats.size / 1000).toFixed(1), // kb
      };
    });
};

exports.findPublicKey = (privateKeyName) => {
  const files = fs.readdirSync(keysDir);
  const publicKeyFile = files.find((filename) => {
    const nameElements = privateKeyName.split("-").pop();
    const publicName = nameElements.startsWith("private")
      ? privateKeyName.replace("private", "public")
      : nameElements.startsWith("pvt")
      ? privateKeyName.replace("pvt", "pub")
      : privateKeyName;
    return publicName == filename;
  });
  try {
    const filePath = path.resolve(keysDir, publicKeyFile);
    return {
      name: publicKeyFile,
      path: filePath,
    };
  } catch (err) {
    console.log(err);
    dialog.showErrorBox("app", "Unable to find public key file.");
  }
};

exports.findPublicKey2 = (privateKeyName) => {
  const files = fs.readdirSync(orgDir);
  const publicKeyFile = files.find((filename) => {
    const nameElements = privateKeyName.split("-").pop();
    const publicName = nameElements.startsWith("private")
      ? privateKeyName.replace("private", "public")
      : nameElements.startsWith("pvt")
      ? privateKeyName.replace("pvt", "pub")
      : privateKeyName;
    return publicName == filename;
  });
  try {
    const filePath = path.resolve(orgDir, publicKeyFile);
    return {
      name: publicKeyFile,
      path: filePath,
    };
  } catch (err) {
    console.log(err);
    dialog.showErrorBox("app", "Unable to find public key file.");
  }
};

exports.downloadPublicKey = (privateKeyName) => {
  const files = fs.readdirSync(keysDir);
  const publicKeyFile = files.find((filename) => {
    const nameElements = privateKeyName.split("-").pop();
    const publicName = nameElements.startsWith("private")
      ? privateKeyName.replace("private", "public")
      : nameElements.startsWith("pvt")
      ? privateKeyName.replace("pvt", "pub")
      : privateKeyName;
    return publicName == filename;
  });
  try {
    const filePath = path.resolve(keysDir, publicKeyFile);
    const keyContent = fs.readFileSync(filePath);
    let options = {
      defaultPath: publicKeyFile,
      title: "Export Certificates",
      buttonLabel: "Save Public Key",
      filters:[
        {name: 'OpenPGP Certificates', extensions: ['asc', 'key']}
      ]
    }
    dialog.showSaveDialog(options).then((result) => {
      fs.writeFile(result.filePath, keyContent, (err) => {
      });
    }).catch((err) => {
      console.log(err);
      dialog.showErrorBox("app", "Unable to find public key file.");
    });
  } catch (err) {
    console.log(err);
    dialog.showErrorBox("app", "Unable to find public key file.");
  }
};

exports.downloadPrivateKey = (privateKeyName) => {
  const files = fs.readdirSync(keysDir);
  const privateKeyFile = files.find((filename) => {
    const nameElements = privateKeyName.split("-").pop();
    const privateName = nameElements.startsWith("private")
      ? privateKeyName.replace("private", "private")
      : nameElements.startsWith("pvt")
      ? privateKeyName.replace("pvt", "pvt")
      : privateKeyName;
    return privateName == filename;
  });
  try {
    const filePath = path.resolve(keysDir, privateKeyFile);
    const keyContent = fs.readFileSync(filePath);
    let options = {
      defaultPath: privateKeyFile,
      title: "Export Certificates",
      buttonLabel: "Save Private Key",
      filters:[
        {name: 'OpenPGP Certificates', extensions: ['asc', 'key']}
      ]
    }
    dialog.showSaveDialog(options).then((result) => {
      fs.writeFile(result.filePath, keyContent, (err) => {
      });
    }).catch((err) => {
      console.log(err);
      dialog.showErrorBox("app", "Unable to find private key file.");
    });
  } catch (err) {
    console.log(err);
    dialog.showErrorBox("app", "Unable to find private key file.");
  }
};