// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu} = require("electron");
const { openUrlMenuItem, openNewGitHubIssue, debugInfo, showAboutWindow } = require('electron-util');
const path = require("path");
const fs = require('fs');
const io = require("./main/io");

if (require('electron-squirrel-startup')) return;

require('update-electron-app')()

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "RTS Encryption Manager",
    icon: path.join(__dirname, "renderer/img/icon.png"),
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("renderer/views/index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  io.removeOrg();
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen to file(s) add event
ipcMain.handle("app:on-file-add", (event, files = []) => {
  io.addFiles(files);
});
// listen
ipcMain.handle("app:on-key-add", (event, name, private, public) => {
  io.addKey(name, private, public);
});
// 
ipcMain.handle("app:on-vpn-add", (event, vpns, input1, input2, input3, input4, input5, input6, path, type) => {
  io.addVpn(vpns, input1, input2, input3, input4, input5, input6, path, type);
});
// 
ipcMain.handle("app:on-ssh-add", (event, username, password, ip, key, path, type) => {
  io.addSsh(username, password, ip, key, path, type);
});
// 
// ipcMain.handle("app:on-ts-add", (event, key) => {
//   io.addOrg(key);
// });
// 
ipcMain.handle("app:on-encryptfile", (event, keyFilePath, isBinary, filePlain) => {
  return io.encryptFile(keyFilePath, isBinary, filePlain);
});
// 
ipcMain.handle("app:on-decryptfile", (event, keyFilePath, isBinary, passphrase, fileEncrypted) => {
  return io.decryptFile(keyFilePath, isBinary, passphrase, fileEncrypted);
});
// 
ipcMain.handle("app:on-ts-add-int", (event, apiKey) => {
  return io.addOrgInt(apiKey);
});
// 
ipcMain.handle("app:on-ts-add-loc", (event, apiKey) => {
  return io.addOrgLoc(apiKey);
});
// 
ipcMain.handle("app:on-ts-remove", (event) => {
  io.removeOrg();
});
// 
ipcMain.handle("app:get-ts-add", (event) => {
  io.getOrg();
});
// return ts keys
ipcMain.handle("app:get-ts-key", () => {
  return io.tsKey();
});
// return ts zip
ipcMain.handle("app:get-ts-zip", () => {
  return io.tsZip();
});
// return list of keys
ipcMain.handle("app:get-keys", () => {
  return io.getKeys();
});
//
ipcMain.handle("app:find-public-key", (event, private) => {
  return io.findPublicKey(private);
});
//
ipcMain.handle("app:find-public-key2", (event, private) => {
  return io.findPublicKey2(private);
});
//
ipcMain.handle("app:download-public-key", (event, private) => {
  io.downloadPublicKey(private);
});
ipcMain.handle("app:download-private-key", (event, private) => {
  io.downloadPrivateKey(private);
});
//
ipcMain.handle("app:delete-keys", (event, keyFile) => {
  return io.deleteKeys(keyFile);
});

const menuTemplate = Menu.buildFromTemplate([
  {
    role: 'fileMenu',
  },
  {
  	role: 'viewMenu'
  },
  {
  	label: 'Help',
    submenu: [
      {
        label: 'About',
        click() {
          showAboutWindow({
            icon: path.join(__dirname, 'renderer/img/icon.png'),
            copyright: 'Copyright © TechSlayers & Austin Casteel',
          });
        }
      },
      openUrlMenuItem({
        label: 'Website',
        url: 'https://techslayers.com'
      }),
      openUrlMenuItem({
        label: 'Source Code',
        url: 'https://github.com/tech-slayers/RTS-Encryption-Manager'
      }),
      {
        label: 'Open an Issue on GitHub',
        click() {
          const body =
`<!--- Provide a general summary of the issue in the Title above -->

## Description
<!--- Provide a more detailed introduction to the issue itself, and why you consider it to be a bug -->

## Expected Behavior
<!--- Tell us what should happen -->

## Actual Behavior
<!--- Tell us what happens instead -->

## Possible Fix
<!--- Not obligatory, but suggest a fix or reason for the bug -->

## Steps to Reproduce
<!--- Provide a link to a live example, or an unambiguous set of steps to -->
<!--- reproduce this bug. Include code to reproduce, if relevant -->
1.
2.
3.
4.

## Context
<!--- How has this bug affected you? What were you trying to accomplish? -->

**Screenshots**
If applicable, add screenshots to help explain your problem.



**Debug Information:**
${debugInfo()}`;
          openNewGitHubIssue({
            user: 'tech-slayers',
            repo: 'RTS-Encryption-Manager',
            assignee: 'AustinCasteel',
            body
          });
        },
      },
    ],
  },
]);

Menu.setApplicationMenu(menuTemplate);