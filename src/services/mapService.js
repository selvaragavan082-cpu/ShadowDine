export const GEOAPIFY_API_KEY = "85f879a4a22f4a5b84aece0b8fc811be";

export const MAP_TILE_URL = `https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`;

export const searchPlaces = async (category = "catering.restaurant", lat, lon) => {
  const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
  const response = await fetch(url);
  return await response.json();
};

export const geocodeAddress = async (text) => {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&apiKey=${GEOAPIFY_API_KEY}`;
  const response = await fetch(url);
  return await response.json();
};

const mapService = {
  GEOAPIFY_API_KEY,
  MAP_TILE_URL,
  searchPlaces,
  geocodeAddress,
};

export default mapService;
