const os = require("os");
const welcomeUser = document.getElementById("welcome-user");

document.addEventListener("DOMContentLoaded", () => {
  const username = os.userInfo().username || "Guest";
  if (username.length > 15) {
    let name = username.substring(0, 15) + "...";
    welcomeUser.innerHTML = `Welcome back, ${name}`;
  } else {
    let name = username;
    welcomeUser.innerHTML = `Welcome back, ${name}`;
  }
});
