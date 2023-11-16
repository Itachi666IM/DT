const db = require('./connection');

// Function to retrieve all machine names from the database
function getAllMachines() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM machines';

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving machine names from the database:', err);
        reject(err);
      } else {
        // Extract machine names from the results
        const machineNames = results.map((result) => result.mname);
        resolve(machineNames);
      }
    });
  });
}

module.exports = {
getAllMachines,
};

//We are creating a Promise because we want to retrieve all the data from the table as soon as the application starts