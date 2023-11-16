const db = require("./connection");

function add(starttime, endtime, cycletime,downtime,numberOfJobs,goodJobs) {
  var time_stamp = new Date();
  time_stamp = time_stamp.toString();
  const badJobs = numberOfJobs - goodJobs; 

  let post = [starttime, endtime, cycletime, time_stamp, downtime,numberOfJobs,goodJobs,badJobs]; // Use an array for the values

  let sql = 'INSERT INTO finalreport (starttime, endtime, cycletime, time_stamp, downtime, number_of_jobs, good_jobs, bad_jobs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(sql, post, (err, result) => {
    if (err) throw err;
    console.log('data entered');
  });
}

module.exports = { add };
