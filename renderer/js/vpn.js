$("#SEF-cancel-btn").on("click", function () {
  window.api.removeOrg();
  window.location.replace("./index.html");
});

$("#save-enc-section").removeAttr("style").hide();
$("#pw").removeAttr("style").hide();
$("#processing").removeAttr("style").hide();


$("#OpenVPN").removeAttr("style").hide();
$("#Pritunl").removeAttr("style").hide();
$("#IPSec").removeAttr("style").hide();
$("#WireGuard").removeAttr("style").hide();
$("#btn-gen-zip").removeAttr("style").hide();


$(document).ready(function(){
  $('#vpnSelect').on('change', function() {
    if ( this.value == 'ovpn') {
      $("#Pritunl").removeAttr("style").hide();
      $("#IPSec").removeAttr("style").hide();
      $("#WireGuard").removeAttr("style").hide();
      $("#OpenVPN").show();
      $("#btn-gen-zip").show();
      console.log("OpenVPN selected")
    } else if( this.value == 'pritunl') {
      $("#OpenVPN").removeAttr("style").hide();
      $("#IPSec").removeAttr("style").hide();
      $("#WireGuard").removeAttr("style").hide();
      $("#Pritunl").show();
      $("#btn-gen-zip").show();
      console.log("Pritunl selected")
    } else if( this.value == 'ipsec') {
      $("#OpenVPN").removeAttr("style").hide();
      $("#Pritunl").removeAttr("style").hide();
      $("#WireGuard").removeAttr("style").hide();
      $("#IPSec").show();
      $("#btn-gen-zip").show();
      console.log("IPSec selected")
    } else if( this.value == 'wg') {
      $("#OpenVPN").removeAttr("style").hide();
      $("#Pritunl").removeAttr("style").hide();
      $("#IPSec").removeAttr("style").hide();
      $("#WireGuard").show();
      $("#btn-gen-zip").show();
      console.log("WireGuard selected")
    } else {
      $("#OpenVPN").removeAttr("style").hide();
      $("#Pritunl").removeAttr("style").hide();
      $("#IPSec").removeAttr("style").hide();
      $("#WireGuard").removeAttr("style").hide();
      $("#btn-gen-zip").removeAttr("style").hide();
      console.log("Nothing selected")
    }
  });
});

// $(document).ready(function(){
//   if ($('#ovpn-config') == "") {
//     console.log("btn hidden 1")
//     $("#btn-gen-zip").removeAttr("style").hide();
//   } else if ($('#OpenVPN').style.display != "none" && $('#ovpn-config') != "") {
//     console.log("btn shown 1")
//     $("#btn-gen-zip").show();
//   }
// });

// $(document).ready(function(){
//   if ($('#ipsec-un') == "") {
//     console.log("btn hidden 2")
//     $("#btn-gen-zip").removeAttr("style").hide();
//   } else if ($('#ipsec-pw') == "") {
//     console.log("btn hidden 3")
//     $("#btn-gen-zip").removeAttr("style").hide();
//   } else if ($('#ipsec-psk') == "") {
//     console.log("btn hidden 4")
//     $("#btn-gen-zip").removeAttr("style").hide();
//   } else if ($('#ipsec-ip') == "") {
//     console.log("btn hidden 5")
//     $("#btn-gen-zip").removeAttr("style").hide();
//   } else if ($('#IPSec').style.display != "none" && $('#ipsec-un') != "" && $('#ipsec-pw') != "" && $('#ipsec-psk') != "" && $('#ipsec-ip') != "") {
//     console.log("btn shown 2")
//     $("#btn-gen-zip").show();
//   }
// });

$("#sel-keys")
  .on("change", () => {
    const keyFile =
      savedKeys.find((key) => key.name == $("#sel-keys").val());
    if (!keyFile) {
      $("#txt-key-id").text("Key information");
      $("#txt-key-email").text(null);
      $("#txt-key-fp").text(null);
      return;
    }
    console.log(keyFile);

    const keyType = getKeyType(keyFile);
    if (keyType < 0) {
      alert(
        "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
      );
      return;
    }

    window.api.key
      .readKeyFile(keyFile.path, keyType == 0)
      .then((privateKey) => {
        console.log(privateKey);
        const userInfo = privateKey.users[0].userId;
        $("#txt-key-id").text(userInfo.name);
        $("#txt-key-email").text(userInfo.email);
        const fingerprint = privateKey.keyPacket.fingerprint;
        const fpr = toHex(fingerprint).toUpperCase();
        $("#txt-key-fp").text(fpr.slice(0, 4) + ' ' + fpr.slice(4, 8) + ' ' + fpr.slice(8, 12) + ' ' + fpr.slice(12, 16) + ' ' + fpr.slice(16, 20) + ' ' + fpr.slice(20, 24) + ' ' + fpr.slice(24, 28) + ' ' + fpr.slice(28, 32) + ' ' + fpr.slice(32, 36) + ' ' + fpr.slice(36));
      })
      .catch(alert);

    $("#pw").show();
  });

$("#btn-export-key").on("click", (e) => {
  e.preventDefault();

  const keyFile = savedKeys.find((key) => key.name == $("#sel-keys").val());
  if (!keyFile) {
    alert("Please select a key pair from list");
    return;
  }

  window.api.downloadPublicKey(keyFile.name);
});

$("#btn-encrypt").on("click", function (e) {
  e.preventDefault();

  let keyFile =
    savedKeys2.find((key) => key.name == $("#sel-keys2").val());
  if (new RegExp("private|pvt").test(keyFile.name)) {
    window.api
      .findPublicKey2(keyFile.name)
      .then((k) => {
        console.log(k);
        encryptWithKey(k);
      })
      .catch(alert);
  } else {
    encryptWithKey(keyFile);
  }
});

$("#btn-gen-zip").on("click", function (e) {
  // e.preventDefault();

  let keyFile =
    savedKeys2.find((key) => key.name == $("#sel-keys2").val());
  if (new RegExp("private|pvt").test(keyFile.name)) {
    window.api
      .findPublicKey2(keyFile.name)
      .then((k) => {
        //console.log(k);
        if ($("#vpnSelect").val() == "ovpn") {
          encryptWithKey3(k);
          const element = document.createElement("a");
          element.focus();
        } else if ($("#vpnSelect").val() == "pritunl") {
          encryptWithKey5(k);
          const element = document.createElement("a");
          element.focus();
        } else if ($("#vpnSelect").val() == "ipsec") {
          encryptWithKey2(k);
          const element = document.createElement("a");
          element.focus();
        } else if ($("#vpnSelect").val() == "wg") {
          encryptWithKey4(k);
          const element = document.createElement("a");
          element.focus();
        } else {
          alert("VPN Type not found");
          return;
        }
      })
      .catch(alert);
  } else {
    if ($("#vpnSelect").val() == "ovpn") {
      encryptWithKey3(keyFile);
      const element = document.createElement("a");
      element.focus();
    } else if ($("#vpnSelect").val() == "pritunl") {
      encryptWithKey5(keyFile);
      const element = document.createElement("a");
      element.focus();
    } else if ($("#vpnSelect").val() == "ipsec") {
      encryptWithKey2(keyFile);
      const element = document.createElement("a");
      element.focus();
    } else if ($("#vpnSelect").val() == "wg") {
      encryptWithKey4(keyFile);
      const element = document.createElement("a");
      element.focus();
    } else {
      alert("VPN Type not found");
      return;
    }
  }
});

$("#btn-save-zip").on("click", function (e) {
  e.preventDefault();
  let vpnUN = $("#vpn-un").val();
  let vpnPW = $("#vpn-pw").val();
  let vpnConfig = $("#vpn-config").val();

  if (!keyFile) {
    alert("Please select a public key from list or import from file");
    return;
  }
  console.log(keyFile);

  const keyType = getKeyType(keyFile);
  if (keyType < 0) {
    alert(
      "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
    );
    return;
  }
  window.api.writeVpn(vpnUN, vpnPW, vpnConfig, keyFile.path, keyType == 0)
});

$("#btn-save-enc").on("click", function (e) {
  e.preventDefault();

  const element = document.createElement("a");
  const file = new Blob([lastEncryptedMessage], { type: "application/pgp-encrypted" });
  element.href = URL.createObjectURL(file);
  element.download = lastEncryptedMessage.path ?? "EncryptedConfig.zip.gpg";
  element.click();
});

function encryptWithKey5(keyFile) {
  let vpns = $("#vpnSelect").val();
  console.log(vpns)
  let option1 = $("#pritunl-un").val();
  //console.log(option1)
  let option2 = $("#pritunl-pw").val();
  //console.log(option2)
  let option3 = $("#pritunl-pp").val();
  //console.log(option3)
  let option4 = $("#pritunl-config").val();
  //console.log(option4)
  let option5 = "";
  //console.log(option5)
  let option6 = "";
  //console.log(option6)
  var validating = false;

  if (!keyFile) {
    alert("Please select a public key from list or import from file");
    return;
  }
  console.log(keyFile);

  const keyType = getKeyType(keyFile);
  if (keyType < 0) {
    alert(
      "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
    );
    return;
  }

  if (option4 == "") {
    alert(
      "Config is required"
    );
    setTimeout(function(){
      $("#pritunl-config").focus();
      validating = false;
    }, 1);
    return;
  }

  window.api
  .writeVpn(vpns, option1, option2, option3, option4, option5, option6, keyFile.path, keyType == 0)
  .catch(alert);
}

function encryptWithKey4(keyFile) {
  let vpns = $("#vpnSelect").val();
  console.log(vpns)
  let option1 = $("#wg-pubkey").val();
  //console.log(option1)
  let option2 = $("#wg-pvtkey").val();
  //console.log(option2)
  let option3 = $("#wg-ep-ip").val();
  //console.log(option3)
  let option4 = $("#wg-ep-p").val();
  //console.log(option4)
  let option5 = $("#wg-pskey").val();
  //console.log(option5)
  let option6 = $("#wg-l-ip").val();
  //console.log(option6)
  var validating = false;

  if (!keyFile) {
    alert("Please select a public key from list or import from file");
    return;
  }
  console.log(keyFile);

  const keyType = getKeyType(keyFile);
  if (keyType < 0) {
    alert(
      "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
    );
    return;
  }

  window.api
  .writeVpn(vpns, option1, option2, option3, option4, option5, option6, keyFile.path, keyType == 0)
  .catch(alert);
}

function encryptWithKey3(keyFile) {
  let vpns = $("#vpnSelect").val();
  console.log(vpns)
  let option1 = $("#ovpn-un").val();
  //console.log(option1)
  let option2 = $("#ovpn-pw").val();
  //console.log(option2)
  let option3 = $("#ovpn-pp").val();
  //console.log(option3)
  let option4 = $("#ovpn-config").val();
  //console.log(option4)
  let option5 = "";
  //console.log(option5)
  let option6 = "";
  //console.log(option6)
  var validating = false;

  if (!keyFile) {
    alert("Please select a public key from list or import from file");
    return;
  }
  console.log(keyFile);

  const keyType = getKeyType(keyFile);
  if (keyType < 0) {
    alert(
      "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
    );
    return;
  }

  if (option4 == "") {
    alert(
      "Config is required"
    );
    setTimeout(function(){
      $("#ovpn-config").focus();
      validating = false;
    }, 1);
    return;
  }

  window.api
  .writeVpn(vpns, option1, option2, option3, option4, option5, option6, keyFile.path, keyType == 0)
  .catch(alert);
}

function encryptWithKey2(keyFile) {
  let vpns = $("#vpnSelect").val();
  console.log(vpns)
  let option1 = $("#ipsec-un").val();
  //console.log(option1)
  let option2 = $("#ipsec-pw").val();
  //console.log(option2)
  let option3 = $("#ipsec-psk").val();
  //console.log(option3)
  let option4 = $("#ipsec-ip").val();
  //console.log(option4)
  let option5 = "";
  //console.log(option5)
  let option6 = "";
  //console.log(option6)
  var validating = false;

  if (!keyFile) {
    alert("Please select a public key from list or import from file");
    return;
  }
  console.log(keyFile);

  const keyType = getKeyType(keyFile);
  if (keyType < 0) {
    alert(
      "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
    );
    return;
  }
  
  if (option1 == "") {
    alert(
      "Username is required"
    );
    setTimeout(function(){
      $("#ipsec-un").focus();
      validating = false;
    }, 1);
    return;
  }
  if (option2 == "") {
    alert(
      "Password is required"
    );
    setTimeout(function(){
      $("#ipsec-pw").focus();
      validating = false;
    }, 1);
    return;
  }
  if (option3 == "") {
    alert(
      "Private Key Passphrase is required"
    );
    setTimeout(function(){
      $("#ipsec-psk").focus();
      validating = false;
    }, 1);
    return;
  }
  if (option4 == "") {
    alert(
      "IP is required"
    );
    setTimeout(function(){
      $("#ipsec-ip").focus();
      validating = false;
    }, 1);
    return;
  }

  window.api
  .writeVpn(vpns, option1, option2, option3, option4, option5, option6, keyFile.path, keyType == 0)
  .catch(alert);
}

function encryptWithKey(keyFile) {
  if (!keyFile) {
    alert("Please select a public key from list or import from file");
    return;
  }
  console.log(keyFile);

  const keyType = getKeyType(keyFile);
  if (keyType < 0) {
    alert(
      "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
    );
    return;
  }

  const plainFile = document.getElementById("file-plain").files[0];
  // const plainMessage = $("#msg-plain").val();
  if (plainFile) {
    $("#btn-encrypt").removeAttr("style").hide();
    $("#save-enc-section").removeAttr("style").hide();
    $("#processing").show();
    console.log(plainFile);
    window.api.crypto
      .encryptFile(keyFile.path, keyType == 0, plainFile.path)
      .then((encryptedMessage) => {
        console.log(encryptedMessage);
        lastEncryptedMessage = encryptedMessage;
        alert("File was encrypted successfully. Remember to Save it!");
        $("#save-enc-section").show();
        $("#processing").removeAttr("style").hide();
        $("#btn-encrypt").show();
      })
      .catch(alert);
    return;
    // } else if (plainMessage && !plainMessage.empty) {
    //   console.log(plainMessage);
    //   window.api.crypto
    //     .encryptText(keyFile.path, keyType == 0, plainMessage)
    //     .then((encryptedMessage) => {
    //       console.log(encryptedMessage);
    //       lastEncryptedMessage = encryptedMessage;
    //       alert("Data was encrypted successfully. Remember Save it!");
    //     })
    //     .catch(alert);
    //   return;
  } else {
    alert("Please provide an plain file or paste in text box");
    return;
  }
}

function getKeyType(keyFile) {
  let extension = keyFile.name.split(".").reverse()[0];
  console.log(extension);
  if (extension == "key") {
    console.log("binary");
    return 0;
  } else if (extension == "asc") {
    console.log("ascii");
    return 1;
  }
  return -1;
}

function bindKeys(files = []) {
  $("#sel-keys").empty();
  $("#sel-keys").append(new Option("Select a key.."));
  savedKeys = files
    .filter((file) => new RegExp("private|pvt").test(file.name))
    .map(fileToKey);
  savedKeys.forEach((key) => {
    $("#sel-keys").append(new Option(key.title, key.name));
  });
}

function bindKeys2(files = []) {
  $("#sel-keys2").empty();
  savedKeys2 = files
    .filter((file) => new RegExp("private|pvt").test(file.name))
    .map(fileToKey);
  savedKeys2.forEach((key) => {
    $("#sel-keys2").append(new Option(key.title, key.name));
  });
}

function fileToKey(file) {
  let fileElements = file.name.split("-");
  fileElements.pop();
  return {
    title: fileElements.join(" "),
    name: file.name,
    path: file.path,
  };
}

let savedKeys = [];
let savedKeys2 = [];
let vpns;
let lastPlainMessage;
let lastEncryptedMessage;

window.api.onReloadKeys((args) => {
  console.log("on Reload Keys");
  window.api.listKeys().then(bindKeys).catch(alert);
});

(() => {
  window.api.listKeys().then(bindKeys).catch(alert);
  window.api.vpnKey().then(bindKeys2).catch(alert);
})();

function toHex(buffer) {
  return Array.prototype.map
    .call(buffer, (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

const currentTheme = localStorage.getItem("theme");

if (localStorage.getItem("theme") === null) {
  $("#theme").attr("href", "../css/themes/flatly/bootstrap.min.css");
  localStorage.setItem("theme", "flatly");
} else if (currentTheme == "cerulean") {
  $("#theme").attr("href", "../css/themes/cerulean/bootstrap.min.css");
  localStorage.setItem("theme", "cerulean");
} else if (currentTheme == "cosmo") {
  $("#theme").attr("href", "../css/themes/cosmo/bootstrap.min.css");
  localStorage.setItem("theme", "cosmo");
} else if (currentTheme == "cyborg") {
  $("#theme").attr("href", "../css/themes/cyborg/bootstrap.min.css");
  localStorage.setItem("theme", "cyborg");
} else if (currentTheme == "darkly") {
  $("#theme").attr("href", "../css/themes/darkly/bootstrap.min.css");
  localStorage.setItem("theme", "darkly");
} else if (currentTheme == "flatly") {
  $("#theme").attr("href", "../css/themes/flatly/bootstrap.min.css");
  localStorage.setItem("theme", "flatly");
} else if (currentTheme == "journal") {
  $("#theme").attr("href", "../css/themes/journal/bootstrap.min.css");
  localStorage.setItem("theme", "journal");
} else if (currentTheme == "litera") {
  $("#theme").attr("href", "../css/themes/litera/bootstrap.min.css");
  localStorage.setItem("theme", "litera");
} else if (currentTheme == "lumen") {
  $("#theme").attr("href", "../css/themes/lumen/bootstrap.min.css");
  localStorage.setItem("theme", "lumen");
} else if (currentTheme == "lux") {
  $("#theme").attr("href", "../css/themes/lux/bootstrap.min.css");
  localStorage.setItem("theme", "lux");
} else if (currentTheme == "materia") {
  $("#theme").attr("href", "../css/themes/materia/bootstrap.min.css");
  localStorage.setItem("theme", "materia");
} else if (currentTheme == "minty") {
  $("#theme").attr("href", "../css/themes/minty/bootstrap.min.css");
  localStorage.setItem("theme", "minty");
} else if (currentTheme == "morph") {
  $("#theme").attr("href", "../css/themes/morph/bootstrap.min.css");
  localStorage.setItem("theme", "morph");
} else if (currentTheme == "pulse") {
  $("#theme").attr("href", "../css/themes/pulse/bootstrap.min.css");
  localStorage.setItem("theme", "pulse");
} else if (currentTheme == "quartz") {
  $("#theme").attr("href", "../css/themes/quartz/bootstrap.min.css");
  localStorage.setItem("theme", "quartz");
} else if (currentTheme == "regent") {
  $("#theme").attr("href", "../css/themes/regent/bootstrap.min.css");
  localStorage.setItem("theme", "regent");
} else if (currentTheme == "sandstone") {
  $("#theme").attr("href", "../css/themes/sandstone/bootstrap.min.css");
  localStorage.setItem("theme", "sandstone");
} else if (currentTheme == "simplex") {
  $("#theme").attr("href", "../css/themes/simplex/bootstrap.min.css");
  localStorage.setItem("theme", "simplex");
} else if (currentTheme == "sketchy") {
  $("#theme").attr("href", "../css/themes/sketchy/bootstrap.min.css");
  localStorage.setItem("theme", "sketchy");
} else if (currentTheme == "slate") {
  $("#theme").attr("href", "../css/themes/slate/bootstrap.min.css");
  localStorage.setItem("theme", "slate");
} else if (currentTheme == "solar") {
  $("#theme").attr("href", "../css/themes/solar/bootstrap.min.css");
  localStorage.setItem("theme", "solar");
} else if (currentTheme == "spacelab") {
  $("#theme").attr("href", "../css/themes/spacelab/bootstrap.min.css");
  localStorage.setItem("theme", "spacelab");
} else if (currentTheme == "superhero") {
  $("#theme").attr("href", "../css/themes/superhero/bootstrap.min.css");
  localStorage.setItem("theme", "superhero");
} else if (currentTheme == "united") {
  $("#theme").attr("href", "../css/themes/united/bootstrap.min.css");
  localStorage.setItem("theme", "united");
} else if (currentTheme == "vapor") {
  $("#theme").attr("href", "../css/themes/vapor/bootstrap.min.css");
  localStorage.setItem("theme", "vapor");
} else if (currentTheme == "yeti") {
  $("#theme").attr("href", "../css/themes/yeti/bootstrap.min.css");
  localStorage.setItem("theme", "yeti");
} else if (currentTheme == "zephyr") {
  $("#theme").attr("href", "../css/themes/zephyr/bootstrap.min.css");
  localStorage.setItem("theme", "zephyr");
}