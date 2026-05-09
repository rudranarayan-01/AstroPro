import { Observer, Body, Equator } from "astronomy-engine";

export const getKundliData = async (dob, tob, lat, lon) => {
  // 1. Strict Validation & Casting
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error(
      `Invalid Coordinates: Received Lat=${lat}, Lon=${lon}. Both must be valid numbers.`,
    );
  }

  try {
    // Check for parameter existence
    if (!dob || !tob) {
      throw new Error("Missing birth date (dob) or birth time (tob).");
    }

    const cleanDob = dob.trim();
    const cleanTob = tob.trim();

    // Strict validation regex pattern matches
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/; // Matches HH:mm or HH:mm:ss

    if (!dateRegex.test(cleanDob) || !timeRegex.test(cleanTob)) {
      throw new Error("Invalid Date/Time format. Use YYYY-MM-DD and HH:mm.");
    }

    // Split components for safe, zero-assumption date parsing
    const [year, month, day] = cleanDob.split("-").map(Number);
    const [hours, minutes] = cleanTob.split(":").map(Number);

    // Creates Date local to your Node runtime environment configuration
    const birthDate = new Date(year, month - 1, day, hours, minutes, 0);

    if (isNaN(birthDate.getTime())) {
      throw new Error("Invalid Date/Time format. Use YYYY-MM-DD and HH:mm.");
    }

    // 2. Observer (Lat, Lon, Elevation)
    const obs = new Observer(latitude, longitude, 0);

    const bodies = [
      Body.Sun,
      Body.Moon,
      Body.Mars,
      Body.Mercury,
      Body.Jupiter,
      Body.Venus,
      Body.Saturn,
    ];

    const planets = bodies.map((body) => {
      const equ = Equator(body, birthDate, obs, true, true);
      // Vedic Sidereal Adjustment (Lahiri Ayanamsa approx)
      const siderealLong = (equ.ra * 15 - 24.0 + 360) % 360;

      return {
        name: body,
        longitude: siderealLong.toFixed(4),
        sign: getZodiacSign(siderealLong),
        house: Math.floor(siderealLong / 30) + 1,
      };
    });

    return { planets };
  } catch (error) {
    throw error; // Pass it up to the route handler / controller response structure
  }
};

function getZodiacSign(lon) {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  return signs[Math.floor(lon / 30)];
}

