const axios = require('axios');

async function fetchSatellite(name) {
  const ids = {
    iss: 25544,
    hubble: 20580
  };

  const id = ids[name.toLowerCase()];
  if (!id) return null;

  const lat = parseFloat(process.env.LAT);
  const lon = parseFloat(process.env.LON);
  const alt = parseFloat(process.env.ALT || '271');
  const apiKey = process.env.N2YO_API_KEY;

  const url = `https://api.n2yo.com/rest/v1/satellite/positions/${id}/${lat}/${lon}/${alt}/1?apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const pos = response.data.positions?.[0];
    if (!pos) return null;

    return {
      name: name.toUpperCase(),
      latitude: pos.satlatitude,
      longitude: pos.satlongitude,
      altitude: pos.sataltitude,
      speed: pos.satvelocity,
      message: `This satellite is passing close to your location.`
    };
  } catch (err) {
    console.error(`[Satellite Error] ${name}:`, err.message);
    return null;
  }
}

module.exports = { fetchSatellite };
