import React, { useState, useEffect } from 'react';
import { geocodeAddress, searchPlaces } from '../services/mapService';

const RestaurantMap = ({ address = "Salem, Tamil Nadu", restaurantName = "ShadowDine Fine Dining" }) => {
  const [location, setLocation] = useState({ lat: 11.6643, lon: 78.1460, formatted: address });
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      setLoading(true);
      try {
        const geoData = await geocodeAddress(address);
        if (geoData && geoData.results && geoData.results.length > 0) {
          const first = geoData.results[0];
          const newLat = first.lat || 11.6643;
          const newLon = first.lon || 78.1460;
          setLocation({
            lat: newLat,
            lon: newLon,
            formatted: first.formatted || address
          });

          const placesData = await searchPlaces("catering.restaurant", newLat, newLon);
          if (placesData && placesData.features) {
            setNearbyPlaces(placesData.features.slice(0, 6));
          }
        }
      } catch (err) {
        console.error("Map fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, [address]);

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.6)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      borderRadius: '20px',
      padding: '24px',
      marginTop: '24px',
      color: '#F8FAFC',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '24px' }}>📍</span>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#FFF' }}>Geoapify Location & Nearby Dining</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{location.formatted}</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#94A3B8', fontSize: '14px' }}>Loading real-time map & location details...</p>
      ) : (
        <div>
          {/* STATIC MAP PREVIEW / TILE DISPLAY */}
          <div style={{
            height: '200px',
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            background: '#0F172A',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=300&center=lonlat:${location.lon},${location.lat}&zoom=14&apiKey=85f879a4a22f4a5b84aece0b8fc811be)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              padding: '10px 18px',
              borderRadius: '25px',
              border: '1px solid #F59E0B',
              color: '#F59E0B',
              fontWeight: '800',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>📍</span> {restaurantName} ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})
            </div>
          </div>

          {/* NEARBY PLACES LIST */}
          {nearbyPlaces.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#F59E0B' }}>Nearby Dining Spots (Geoapify Places):</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                {nearbyPlaces.map((place, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '13px'
                  }}>
                    <strong style={{ color: '#FFF' }}>{place.properties.name || "Gourmet Restaurant"}</strong>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
                      {place.properties.address_line2 || place.properties.street || "Nearby"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantMap;
