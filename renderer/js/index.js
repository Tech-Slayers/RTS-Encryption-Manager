$("#encrypt-btn-main").on("click", function () {
  //$("#encrypt-btn-clicked").trigger("click");
  window.location.replace("./encrypt.html");
});
$("#encrypt-btn-clicked").change(function () {
  window.location.replace("./encrypt.html");
});
$("#decrypt-btn-main").on("click", function () {
  //$("#decrypt-btn-clicked").trigger("click");
  window.location.replace("./decrypt.html");
});
$("#decrypt-btn-clicked").change(function () {
  // var file = $("#decrypt-btn-clicked").val();
  // window.location.replace("./decrypt.html?file=" + file);
  window.location.replace("./decrypt.html");
});
$("#new_pair-btn-main").on("click", function () {
  window.location.replace("./new_pair.html");
});
$("#import-btn-main").on("click", function () {
  //$("#import-btn-clicked").trigger("click");
  window.location.replace("./import.html");
});
$("#import-btn-clicked").change(function () {
  window.location.replace("./import.html");
});
$("#export-btn-main").on("click", function () {
  window.location.replace("./export.html");
});

$("#processing_local").removeAttr("style").hide();
$("#processing_internal").removeAttr("style").hide();

$("#vpn-btn-main").on("click", function () {
  var apiKey = $.trim($("#txt-api-key-internal").val());
  $("#input_internal").removeAttr("style").hide();
  $("#processing_internal").show();
  window.api
    .writeOrgInt(apiKey)
    .then((response) => {
      if (response == 1) {
        console.log('passed');
        window.location.replace("./vpn.html");
      } else if (response == 0) {
        console.log('failed');
        $("#processing_internal").removeAttr("style").hide();
        $("#input_internal").show();
      } else {
        console.log("no idea what happened");
        console.log(response);
        $("#processing_internal").removeAttr("style").hide();
        $("#input_internal").show();
      }
    })
    .catch(alert);
});
$("#ssh-btn-main").on("click", function () {
  var apiKey = $.trim($("#txt-api-key-local").val());
  $("#input_local").removeAttr("style").hide();
  $("#processing_local").show();
  window.api
    .writeOrgLoc(apiKey)
    .then((response) => {
      if (response == 1) {
        console.log('passed');
        window.location.replace("./ssh.html");
      } else if (response == 0) {
        console.log('failed');
        $("#processing_local").removeAttr("style").hide();
        $("#input_local").show();
      } else {
        console.log("no idea what happened");
        console.log(response);
        $("#processing_local").removeAttr("style").hide();
        $("#input_local").show();
      }
    })
    .catch(alert);
});

$("#tablesearch").keyup(function () {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("tablesearch");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
});








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

function gottenOrg(value) {
  console.log(value);
  // setTimeout(() => {  $("#ts-org-key").val(value); }, 2000);
  // $("#ts-org-key").val(value);
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
  //window.api.getOrg().catch(alert);
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

$("#themeselect")
  .on("change", () => {
    const selected = $("#themeselect").val();

    if (selected == "cerulean") {
      $("#theme").attr("href", "../css/themes/cerulean/bootstrap.min.css");
      localStorage.setItem("theme", "cerulean");
    } else if (selected == "cosmo") {
      $("#theme").attr("href", "../css/themes/cosmo/bootstrap.min.css");
      localStorage.setItem("theme", "cosmo");
    } else if (selected == "cyborg") {
      $("#theme").attr("href", "../css/themes/cyborg/bootstrap.min.css");
      localStorage.setItem("theme", "cyborg");
    } else if (selected == "darkly") {
      $("#theme").attr("href", "../css/themes/darkly/bootstrap.min.css");
      localStorage.setItem("theme", "darkly");
    } else if (selected == "flatly") {
      $("#theme").attr("href", "../css/themes/flatly/bootstrap.min.css");
      localStorage.setItem("theme", "flatly");
    } else if (selected == "journal") {
      $("#theme").attr("href", "../css/themes/journal/bootstrap.min.css");
      localStorage.setItem("theme", "journal");
    } else if (selected == "litera") {
      $("#theme").attr("href", "../css/themes/litera/bootstrap.min.css");
      localStorage.setItem("theme", "litera");
    } else if (selected == "lumen") {
      $("#theme").attr("href", "../css/themes/lumen/bootstrap.min.css");
      localStorage.setItem("theme", "lumen");
    } else if (selected == "lux") {
      $("#theme").attr("href", "../css/themes/lux/bootstrap.min.css");
      localStorage.setItem("theme", "lux");
    } else if (selected == "materia") {
      $("#theme").attr("href", "../css/themes/materia/bootstrap.min.css");
      localStorage.setItem("theme", "materia");
    } else if (selected == "minty") {
      $("#theme").attr("href", "../css/themes/minty/bootstrap.min.css");
      localStorage.setItem("theme", "minty");
    } else if (selected == "morph") {
      $("#theme").attr("href", "../css/themes/morph/bootstrap.min.css");
      localStorage.setItem("theme", "morph");
    } else if (selected == "pulse") {
      $("#theme").attr("href", "../css/themes/pulse/bootstrap.min.css");
      localStorage.setItem("theme", "pulse");
    } else if (selected == "quartz") {
      $("#theme").attr("href", "../css/themes/quartz/bootstrap.min.css");
      localStorage.setItem("theme", "quartz");
    } else if (selected == "regent") {
      $("#theme").attr("href", "../css/themes/regent/bootstrap.min.css");
      localStorage.setItem("theme", "regent");
    } else if (selected == "sandstone") {
      $("#theme").attr("href", "../css/themes/sandstone/bootstrap.min.css");
      localStorage.setItem("theme", "sandstone");
    } else if (selected == "simplex") {
      $("#theme").attr("href", "../css/themes/simplex/bootstrap.min.css");
      localStorage.setItem("theme", "simplex");
    } else if (selected == "sketchy") {
      $("#theme").attr("href", "../css/themes/sketchy/bootstrap.min.css");
      localStorage.setItem("theme", "sketchy");
    } else if (selected == "slate") {
      $("#theme").attr("href", "../css/themes/slate/bootstrap.min.css");
      localStorage.setItem("theme", "slate");
    } else if (selected == "solar") {
      $("#theme").attr("href", "../css/themes/solar/bootstrap.min.css");
      localStorage.setItem("theme", "solar");
    } else if (selected == "spacelab") {
      $("#theme").attr("href", "../css/themes/spacelab/bootstrap.min.css");
      localStorage.setItem("theme", "spacelab");
    } else if (selected == "superhero") {
      $("#theme").attr("href", "../css/themes/superhero/bootstrap.min.css");
      localStorage.setItem("theme", "superhero");
    } else if (selected == "united") {
      $("#theme").attr("href", "../css/themes/united/bootstrap.min.css");
      localStorage.setItem("theme", "united");
    } else if (selected == "vapor") {
      $("#theme").attr("href", "../css/themes/vapor/bootstrap.min.css");
      localStorage.setItem("theme", "vapor");
    } else if (selected == "yeti") {
      $("#theme").attr("href", "../css/themes/yeti/bootstrap.min.css");
      localStorage.setItem("theme", "yeti");
    } else if (selected == "zephyr") {
      $("#theme").attr("href", "../css/themes/zephyr/bootstrap.min.css");
      localStorage.setItem("theme", "zephyr");
    }
  });