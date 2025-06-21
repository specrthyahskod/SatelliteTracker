const fs = require('fs');
const path = require('path');

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
