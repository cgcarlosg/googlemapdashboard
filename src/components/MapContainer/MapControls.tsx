import type {MapControlsProps} from "../../types";
import "./MapContainer.scss";

const MapControls: React.FC<MapControlsProps> = ({
  mostrarHitos,
  setMostrarHitos,
  mostrarCirculos,
  setMostrarCirculos,
  mostrarPuntosInteres,
  setMostrarPuntosInteres,
}) => {
  return (
    <div className="mapcontainer__controls">
      <label>
        <input
          type="checkbox"
          checked={mostrarHitos}
          onChange={(e) => setMostrarHitos(e.target.checked)}
        />
        Mostrar Hitos
      </label>
      <label>
        <input
          type="checkbox"
          checked={mostrarCirculos}
          onChange={(e) => setMostrarCirculos(e.target.checked)}
        />
        Mostrar Círculos
      </label>
      <label>
        <input
          type="checkbox"
          checked={mostrarPuntosInteres}
          onChange={(e) => setMostrarPuntosInteres(e.target.checked)}
        />
        Mostrar Puntos de Interés
      </label>
    </div>
  );
};

export default MapControls;
