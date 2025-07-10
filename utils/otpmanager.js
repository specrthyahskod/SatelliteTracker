const otps = new Map();

function generateAndStoreOTP(userId) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps.set(userId, { otp, expires: Date.now() + 5 * 60 * 1000 });
  return otp;
}

function verifyOTP(userId, input) {
  const data = otps.get(userId);
  if (!data) return false;

  if (Date.now() > data.expires) {
    otps.delete(userId);
    return false;
  }

  const match = data.otp === input;
  if (match) otps.delete(userId);
  return match;
}

module.exports = { generateAndStoreOTP, verifyOTP };
