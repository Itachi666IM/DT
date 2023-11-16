
function starttime() {
  let c = new Date();
  let starttime = "";
  starttime = starttime + c.getHours() + ":";
  starttime = starttime + c.getMinutes() + ":";
  starttime = starttime + c.getSeconds() + ":";
  starttime = starttime + c.getMilliseconds();
  return starttime;
}

module.exports = { starttime: starttime};
