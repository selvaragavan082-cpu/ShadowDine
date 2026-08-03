export const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY || "PASTE_YOUR_GEOAPIFY_API_KEY_HERE";

// Map Tile Layer URL for Leaflet / OpenLayers / MapLibre or image display
export const MAP_TILE_URL = `https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`;

// Search nearby restaurants using Geoapify Places API
export const searchPlaces = async (category = "catering.restaurant", lat = 11.6643, lon = 78.1460) => {
  try {
    const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Map API request failed");
    return await response.json();
  } catch (error) {
    console.error("Geoapify Search Places Error:", error);
    throw error;
  }
};

// Convert Address / City name to Lat & Long coordinates (Geocoding)
export const geocodeAddress = async (text) => {
  try {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&apiKey=${GEOAPIFY_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Geocoding request failed");
    return await response.json();
  } catch (error) {
    console.error("Geoapify Geocode Error:", error);
    throw error;
  }
};

const mapService = {
  GEOAPIFY_API_KEY,
  MAP_TILE_URL,
  searchPlaces,
  geocodeAddress
};

export default mapService;
