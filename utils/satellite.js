const axios = require('axios');

const satelliteMap = {
  iss: 25544,
  hubble: 20580
};

const LAT = parseFloat(process.env.LAT);
const LON = parseFloat(process.env.LON);
const ALT = parseFloat(process.env.ALT || '0');

async function fetchSatellite(name) {
  const id = satelliteMap[name.toLowerCase()];
  if (!id) return null;

  const url = `https://api.n2yo.com/rest/v1/satellite/positions/${id}/${LAT}/${LON}/${ALT}/1?apiKey=${process.env.N2YO_API_KEY}`;

  try {
    const { data } = await axios.get(url);
    const pos = data.positions?.[0];

    if (!pos) return null;

    return {
      name: name.toUpperCase(),
      latitude: pos.satlatitude,
      longitude: pos.satlongitude,
      altitude: pos.sataltitude,
      speed: pos.satvelocity,
      message: `${name.toUpperCase()} is currently above your sky!`
    };
  } catch (e) {
    console.error(`❌ Error fetching satellite data:`, e.message);
    return null;
  }
}

module.exports = { fetchSatellite };
