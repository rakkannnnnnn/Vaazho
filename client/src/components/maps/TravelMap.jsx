import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const parseCoordinate = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

function TravelMap({
  latitude,
  longitude,
  zoom = 12,
  properties = [],
  attractions = [],
}) {
  const destinationLatitude = parseCoordinate(latitude);
  const destinationLongitude = parseCoordinate(longitude);

  if (destinationLatitude === null || destinationLongitude === null) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
        Map location is unavailable.
      </div>
    );
  }

  const validProperties = Array.isArray(properties)
    ? properties.filter((property) => {
        const lat = parseCoordinate(property?.latitude);
        const lng = parseCoordinate(property?.longitude);
        return lat !== null && lng !== null;
      })
    : [];

  const validAttractions = Array.isArray(attractions)
    ? attractions.filter((attraction) => {
        const lat = parseCoordinate(attraction?.latitude);
        const lng = parseCoordinate(attraction?.longitude);
        return lat !== null && lng !== null;
      })
    : [];

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <MapContainer
        center={[destinationLatitude, destinationLongitude]}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[destinationLatitude, destinationLongitude]}>
          <Popup>
            <div className="min-w-[180px]">
              <strong>Destination</strong>
            </div>
          </Popup>
        </Marker>

        {validProperties.map((property) => (
          <Marker
            key={property._id || property.slug || property.name}
            position={[parseCoordinate(property.latitude), parseCoordinate(property.longitude)]}
          >
            <Popup>
              <div className="min-w-[180px]">
                <h3 className="font-semibold text-neutral-900">{property.name}</h3>
                {property.description && (
                  <p className="mt-1 text-sm text-neutral-600">{property.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {validAttractions.map((attraction, index) => (
          <Marker
            key={attraction._id || attraction.slug || attraction.name || `attraction-${index}`}
            position={[parseCoordinate(attraction.latitude), parseCoordinate(attraction.longitude)]}
          >
            <Popup>
              <div className="min-w-[180px]">
                <h3 className="font-semibold text-neutral-900">{attraction.name}</h3>
                {attraction.description && (
                  <p className="mt-1 text-sm text-neutral-600">{attraction.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default TravelMap;