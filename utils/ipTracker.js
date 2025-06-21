const fs = require('fs');
const path = require('path');

const fs = require('fs');
const path = require('path');

const ipDataPath = path.join(__dirname, '..', 'data', 'ip_storage.json');

// Create the /data folder if it doesn't exist
const dataDir = path.dirname(ipDataPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create the JSON file if it doesn't exist
if (!fs.existsSync(ipDataPath)) {
  fs.writeFileSync(ipDataPath, JSON.stringify({}));
}

const ipDBPath = path.join(__dirname, '../data/ip_storage.json');

// Ensure file exists
if (!fs.existsSync(ipDBPath)) fs.writeFileSync(ipDBPath, '{}');

function loadIPs() {
  return JSON.parse(fs.readFileSync(ipDBPath, 'utf8'));
}

function saveIPs(ips) {
  fs.writeFileSync(ipDBPath, JSON.stringify(ips, null, 2));
}

function getStoredIP(userId) {
  const ips = loadIPs();
  return ips[userId] || null;
}

function setUserIP(userId, ip) {
  const ips = loadIPs();
  ips[userId] = ip;
  saveIPs(ips);
}

module.exports = {
  getStoredIP,
  setUserIP
};
