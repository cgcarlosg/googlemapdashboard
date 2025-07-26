import "./Header.scss";
import type { SearchProps } from "../../types";
import logo from "../../assets/logoProject.png"

const mockLocations = [
  { name: "Bogotá Centro", coords: {lat: 4.710989, lng: -74.07209 } },
  { name: "Bogotá Aeropuerto", coords: { lat: 4.7010, lng: -74.1464 } },
  { name: "Centro Comercial Multiplaza", coords: { lat: 4.6517, lng: -74.1265 } },
  { name: "Centro Comercial Plaza Imperial", coords: { lat: 4.7496, lng: -74.0956 } },
];

const Header: React.FC<SearchProps> = ({ onLocationSelect }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = mockLocations.find((loc) => loc.name === e.target.value);
    if (selected) {
      onLocationSelect(selected.coords);
    }
  };

  return (
    <header className="header">
      <div className="header__brand">
        <img src={logo} />
      </div>
      <div className="header__search">
        <label htmlFor="location-select">Buscar ubicación:</label>
        <select id="location-select" onChange={handleChange}>
          <option value="">Seleccione...</option>
          {mockLocations.map((loc) => (
            <option key={loc.name} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;