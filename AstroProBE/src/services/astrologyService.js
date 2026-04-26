import { Observer, Body, Equator } from 'astronomy-engine';

export const getKundliData = async (dob, tob, lat, lon) => {
  // 1. Strict Validation & Casting
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error(`Invalid Coordinates: Received Lat=${lat}, Lon=${lon}. Both must be valid numbers.`);
  }

  try {
    // 2. Observer (Lat, Lon, Elevation)
    const obs = new Observer(latitude, longitude, 0);
    
    // Validate Date
    const birthDate = new Date(`${dob}T${tob}:00Z`);
    if (isNaN(birthDate.getTime())) {
      throw new Error("Invalid Date/Time format. Use YYYY-MM-DD and HH:mm.");
    }

    const bodies = [
      Body.Sun, Body.Moon, Body.Mars, Body.Mercury, 
      Body.Jupiter, Body.Venus, Body.Saturn
    ];

    const planets = bodies.map(body => {
      const equ = Equator(body, birthDate, obs, true, true);
      // Vedic Sidereal Adjustment (Lahiri Ayanamsa approx)
      const siderealLong = (equ.ra * 15 - 24.0 + 360) % 360;

      return {
        name: body,
        longitude: siderealLong.toFixed(4),
        sign: getZodiacSign(siderealLong),
        house: Math.floor(siderealLong / 30) + 1
      };
    });

    return { planets };
  } catch (error) {
    throw error; // Pass it up to the controller
  }
};

function getZodiacSign(lon) {
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  return signs[Math.floor(lon / 30)];
}