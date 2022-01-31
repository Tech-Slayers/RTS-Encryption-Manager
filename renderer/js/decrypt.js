$("#SEF-cancel-btn").on("click", function () {
  window.location.replace("./index.html");
});

$("#save-dec-section").removeAttr("style").hide();
$("#pw1").removeAttr("style").hide();
$("#pw2").removeAttr("style").hide();
$("#processing").removeAttr("style").hide();

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

    $("#pw1").show();
    $("#pw2").show();
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

$("#btn-decrypt").on("click", function (e) {
  e.preventDefault();

  const keyFile =
    savedKeys.find((key) => key.name == $("#sel-keys").val());
  if (!keyFile) {
    alert("Please select a private key from list or import from file");
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

  const passphrase = $("#txt-passphrase").val();
  if (!passphrase) {
    alert("Please enter the key password");
    return;
  }
  console.log(passphrase);

  const encFile = document.getElementById("file-encrypted").files[0];
  // const encMessage = $("#txt-encrypted").val();
  if (encFile) {
    $("#btn-decrypt").removeAttr("style").hide();
    $("#save-dec-section").removeAttr("style").hide();
    $("#processing").show();
    console.log(encFile);
    window.api.crypto
      .decryptFile(keyFile.path, keyType == 0, passphrase, encFile.path)
      .then((plainFile) => {
        console.log(plainFile);
        lastPlainMessage = plainFile;
        alert("File was decrypted successfully. Remember to Save it!");
        $("#save-dec-section").show();
        $("#processing").removeAttr("style").hide();
        $("#btn-decrypt").show();
      })
      .catch(alert);
    return;
    // } else if (encMessage && !encMessage.empty) {
    //   console.log(encMessage);
    //   window.api.crypto
    //     .decryptText(keyFile.path, keyType == 0, passphrase, encMessage)
    //     .then((plainMessage) => {
    //       console.log(plainMessage);
    //       lastPlainMessage = plainMessage;
    //       alert("Data was decrypted successfully.");
    //     })
    //     .catch(alert);
    //   return;
  } else {
    alert("Please provide an encrypted file or paste in text box");
    return;
  }
});

// $("#btn-show").on("click", function (e) {
//   e.preventDefault();

//   $("#txt-decrypted").val(lastPlainMessage.data);
// });

$("#btn-save").on("click", function (e) {
  e.preventDefault();

  const element = document.createElement("a");
  const file = new Blob([lastPlainMessage.data], { type: "application/zip" });
  element.href = URL.createObjectURL(file);
  element.download = lastPlainMessage.path ?? "Decrypted_Results.zip";
  element.click();
});

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
let lastPlainMessage;
let lastEncryptedMessage;

window.api.onReloadKeys((args) => {
  console.log("on Reload Keys");
  window.api.listKeys().then(bindKeys).catch(alert);
});

(() => {
  window.api.listKeys().then(bindKeys).catch(alert);
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