import { useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { searchLocations } from "../services/locationApi";

function LocationSearch({ onSelectLocation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setStatus("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setStatus("Searching...");
        const locations = await searchLocations(query);
        setResults(locations);
        setStatus(locations.length ? "" : "No locations found.");
      } catch (error) {
        setStatus(error.message);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const selectLocation = (location) => {
    onSelectLocation(location);
    setQuery(
      `${location.locality}, ${location.city}, ${location.state} - ${location.pincode}`
    );
    setResults([]);
    setStatus("Location selected.");
  };

  return (
    <div className="locationSearch">
      <label>Search city, district, locality or PIN</label>

      <div className="locationSearchInput">
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Example: Mumbai, Bengaluru or 560001"
        />
      </div>

      {status && <p className="locationSearchStatus">{status}</p>}

      {results.length > 0 && (
        <div className="locationResults">
          {results.map((location) => (
            <button
              type="button"
              key={location._id}
              onClick={() => selectLocation(location)}
            >
              <MapPin size={18} />

              <div>
                <strong>
                  {location.locality || location.city}, {location.city}
                </strong>
                <span>
                  {location.district}, {location.state} - {location.pincode}
                </span>
                <small>{location.authority}</small>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationSearch;