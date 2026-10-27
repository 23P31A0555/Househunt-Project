import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [budget, setBudget] = useState("Any");

  useEffect(() => {
    fetch("http://localhost:5000/api/properties")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
      });
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesLocation =
      location.trim() === "" ||
      property.location?.toLowerCase().includes(location.toLowerCase());

    const matchesType =
  propertyType === "All" ||
  Number(property.bedrooms) ===
    Number(propertyType.replace("BHK", ""));

    let matchesBudget = true;

    if (budget === "Under ₹10,000") {
      matchesBudget = property.rent < 10000;
    } else if (budget === "₹10,000 - ₹20,000") {
      matchesBudget = property.rent >= 10000 && property.rent <= 20000;
    } else if (budget === "Above ₹20,000") {
      matchesBudget = property.rent > 20000;
    }

    return matchesLocation && matchesType && matchesBudget;
  });

  const displayedProperties = filteredProperties.slice(0, 6);
const locationCount = new Set(
  properties.map((property) => property.location)
).size;

const bedroomTypeCount = new Set(
  properties.map((property) => property.bedrooms)
).size;
  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-small-text">FIND YOUR NEXT HOME</span>

          <h1>
            Find a home
            <br />
            <span>you'll love.</span>
          </h1>

          <p>
            Discover comfortable rental homes, apartments and flats
            in locations that suit your lifestyle and budget.
          </p>

          <button
            className="hero-button"
            onClick={() => navigate("/properties")}
          >
            Explore Homes
          </button>
        </div>
      </section>

      {/* SEARCH BOX */}
      <section className="search-wrapper">
        <div className="search-box">

          <div className="search-field">
            <label>Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="search-field">
            <label>Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="All">All Properties</option>
              <option value="1BHK">1 BHK</option>
              <option value="2BHK">2 BHK</option>
              <option value="3BHK">3 BHK</option>
            </select>
          </div>

          <div className="search-field">
            <label>Budget</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option value="Any">Any Budget</option>
              <option value="Under ₹10,000">Under ₹10,000</option>
              <option value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</option>
              <option value="Above ₹20,000">Above ₹20,000</option>
            </select>
          </div>

          <button
  className="search-button"
  onClick={() =>
    navigate(
      `/properties?location=${encodeURIComponent(location)}&type=${encodeURIComponent(propertyType)}&budget=${encodeURIComponent(budget)}`
    )
  }
>
  Search
</button>

        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="properties-section">

        <div className="section-heading">
          <div>
            <span>EXPLORE HOMES</span>
            <h2>Featured Properties</h2>
            <p>Find a place that feels right for you.</p>
          </div>

          <button
            className="view-all-button"
            onClick={() => navigate("/properties")}
          >
            View All Properties →
          </button>
        </div>

        <div className="property-grid">

          {displayedProperties.length > 0 ? (
            displayedProperties.map((property) => (
              <div className="property-card" key={property._id}>

                <div className="property-image-container">
                  <img
                    src={
                      property.images?.[0] ||
                      property.image ||
                      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={property.title}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />

                  <span className="property-tag">
                    For Rent
                  </span>
                </div>

                <div className="property-info">
                  <h3>{property.title}</h3>

                  <p className="property-location">
                    📍 {property.location}
                  </p>

                  <div className="property-details">
                    <span>🛏 {property.bedrooms} Beds</span>
                    <span>🏠 Apartment</span>
                  </div>

                  <div className="property-bottom">
                    <div>
                      <strong>₹{property.rent}</strong>
                      <small>/ month</small>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/properties/${property._id}`)
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="no-properties">
              <h3>No properties found</h3>
              <p>Try changing your search options.</p>
            </div>
          )}

        </div>
      </section>

      
{/* WHY HOUSEHUNT - DYNAMIC */}

<section className="why-section">

  <div className="why-heading">
    <span>WHY HOUSEHUNT?</span>
    <h2>A simpler way to find your home</h2>
    <p>
      Explore rental properties available on our platform.
    </p>
  </div>

  <div className="why-grid">

    <div className="why-card">
      <div className="why-icon">⌂</div>
      <h3>{properties.length}+ Homes</h3>
      <p>
        Explore rental properties listed on HouseHunt.
      </p>
    </div>

    <div className="why-card">
      <div className="why-icon">⌖</div>
      <h3>{locationCount}+ Locations</h3>
      <p>
        Find properties in different locations.
      </p>
    </div>

    <div className="why-card">
      <div className="why-icon">✓</div>
      <h3>{bedroomTypeCount} Property Types</h3>
      <p>
        Choose homes based on your bedroom requirements.
      </p>
    </div>

  </div>
</section>
      {/* CTA */}
      <section className="cta-section">
        <div>
          <span>READY TO MOVE?</span>
          <h2>Find your next home today.</h2>
          <p>
            Browse our available properties and find a place you'll love.
          </p>
        </div>

        <button
          onClick={() => navigate("/properties")}
        >
          Browse Properties →
        </button>
      </section>

    </div>
  );
}

export default Home;