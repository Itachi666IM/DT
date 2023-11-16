
function endtime() {
  let d = new Date();
  let endtime = "";
  endtime = endtime + d.getHours() + ":";
  endtime = endtime + d.getMinutes() + ":";
  endtime = endtime + d.getSeconds() + ":";
  endtime = endtime + d.getMilliseconds();
  return endtime;
}

module.exports = { endtime: endtime};
