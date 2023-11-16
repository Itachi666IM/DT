const db = require('./connection'); // Import the database connection

function insertMachine(machineName, callback) {
  const sql = 'INSERT INTO machines (mname) VALUES (?)';
  db.query(sql, [machineName], (err, results) => {
    if (err) {
      console.error('Error inserting machine name:', err);
      callback(err);
    } else {
      console.log('Machine name inserted successfully');
      callback(null, results);
    }
  });
}

function removeMachine(machineName, callback) {
  const sql = 'DELETE FROM machines WHERE mname = ?'; // SQL to delete a specific machine by name
  db.query(sql, [machineName], (err, results) => {
    if (err) {
      console.error('Error removing machine name:', err);
      callback(err);
    } else {
      console.log('Machine name removed successfully');
      callback(null, results);
    }
  });
}

function clearMachines(callback) {
  const sql = 'DELETE FROM machines'; // SQL to delete all records from the machine table
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error clearing machine names:', err);
      callback(err);
    } else {
      console.log('Machine names cleared successfully');
      callback(null, results);
    }
  });
}

module.exports = { insertMachine, removeMachine, clearMachines };
