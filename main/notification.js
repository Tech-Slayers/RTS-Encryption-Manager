const { Notification } = require("electron");

// display files added notification
exports.filesAdded = (size) => {
  const notif = new Notification({
    title: "Keys added",
    body: `${size} key(s) has been successfully added.`,
  });

  notif.show();
};
