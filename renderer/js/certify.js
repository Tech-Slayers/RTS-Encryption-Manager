$("#SEF-cancel-btn").on("click", function () {
  window.location.replace("./index.html");
});

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