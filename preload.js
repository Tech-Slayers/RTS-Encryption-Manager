// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

process.once("loaded", () => {
  console.log("loaded");
});

const fs = require("fs");
const { contextBridge, ipcRenderer } = require("electron");
const key = require("./main/key");
const crypto = require("./main/crypto");

contextBridge.exposeInMainWorld("api", {
  readFileSync: fs.readFileSync,
  copyFiles: (files = []) => {
    return ipcRenderer.invoke("app:on-file-add", files);
  },
  writeKey: (name, private, public) => {
    return ipcRenderer.invoke("app:on-key-add", name, private, public);
  },
  writeVpn: (vpns, input1, input2, input3, input4, input5, input6, path, type) => {
    return ipcRenderer.invoke("app:on-vpn-add", vpns, input1, input2, input3, input4, input5, input6, path, type);
  },
  writeSsh: (username, password, ip, key, path, type) => {
    return ipcRenderer.invoke("app:on-ssh-add", username, password, ip, key, path, type);
  },
  // writeOrg: (key) => {
  //   return ipcRenderer.invoke("app:on-ts-add", key);
  // },
  encryptFile: (keyFilePath, isBinary, filePlain) => {
    return ipcRenderer.invoke("app:on-encryptfile", keyFilePath, isBinary, filePlain);
  },
  decryptFile: (keyFilePath, isBinary, passphrase, fileEncrypted) => {
    return ipcRenderer.invoke("app:on-decryptfile", keyFilePath, isBinary, passphrase, fileEncrypted);
  },
  writeOrgInt: (apiKey) => {
    return ipcRenderer.invoke("app:on-ts-add-int", apiKey);
  },
  writeOrgLoc: (apiKey) => {
    return ipcRenderer.invoke("app:on-ts-add-loc", apiKey);
  },
  removeOrg: () => {
    return ipcRenderer.invoke("app:on-ts-remove");
  },
  getOrg: () => {
    return ipcRenderer.invoke("app:get-ts-add");
  },
  vpnKey: () => {
    return ipcRenderer.invoke("app:get-ts-key");
  },
  vpnZip: () => {
    return ipcRenderer.invoke("app:get-ts-zip");
  },
  listKeys: () => {
    return ipcRenderer.invoke("app:get-keys");
  },
  findPublicKey: (keyFile) => {
    return ipcRenderer.invoke("app:find-public-key", keyFile);
  },
  findPublicKey2: (keyFile) => {
    return ipcRenderer.invoke("app:find-public-key2", keyFile);
  },
  downloadPublicKey: (keyFile) => {
    return ipcRenderer.invoke("app:download-public-key", keyFile);
  },
  downloadPrivateKey: (keyFile) => {
    return ipcRenderer.invoke("app:download-private-key", keyFile);
  },
  deleteKeys: (keyFile) => {
    return ipcRenderer.invoke("app:delete-keys", keyFile);
  },
  reloadKeys: () => {
    return ipcRenderer.sendTo(1, "data:reload-keys");
  },
  onReloadKeys: (callBack) => {
    return ipcRenderer.on("data:reload-keys", (e, ...args) =>
      callBack(...args)
    );
  },
  key: key,
  crypto: crypto,
});
