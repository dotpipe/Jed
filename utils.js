// Import necessary modules
const fs = require('fs');

// Function to load JSON data from file
function loadJSONData() {
  const jsonData = fs.readFileSync('data.json', 'utf8');
  return JSON.parse(jsonData);
}

// Function to update JSON data in file
function updateJSONData(jsonData) {
  const updatedData = JSON.stringify(jsonData);
  fs.writeFileSync('data.json', updatedData, 'utf8');
}

module.exports = {
  loadJSONData,
  updateJSONData
};
