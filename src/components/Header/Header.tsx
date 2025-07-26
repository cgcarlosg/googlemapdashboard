import { useState } from "react";
import "./Header.scss";
import type { SearchProps } from "../../types";
import { mockLocations } from "../../data/MockLocations";
import logo from "../../assets/logoProject.png"
import logomob from "../../assets/logoProjectMob.png"


const Header: React.FC<SearchProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

   const filteredLocations = mockLocations.filter(loc =>
    loc.name.toLowerCase().includes(query.toLowerCase())
  );


  const handleSelect = (locationName: string) => {
    const selected = mockLocations.find(loc => loc.name === locationName);
    if (selected) {
      onLocationSelect(selected.coords);
      setQuery(selected.name);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="header">
      <div className="header__brand">
        <img src={logomob} alt="Logo" className="header__brand--mobileimg"/>
        <img src={logo} alt="Logo" className="header__brand--deskimg" />
      </div>

      <div className="header__search">
        <input
          data-testid="location-input"
          id="location-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder="Escribe una ubicacion..."
          autoComplete="off"
        />

        {showSuggestions && query && (
          <ul className="header__search--suggestions">
            {filteredLocations.length > 0 ? (
              filteredLocations.map(loc => (
                <li key={loc.name} onClick={() => handleSelect(loc.name)}>
                  {loc.name}
                </li>
              ))
            ) : (
              <li className="no-result">No se encontraron resultados</li>
            )}
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;