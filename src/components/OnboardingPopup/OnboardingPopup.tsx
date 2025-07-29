import React from 'react';
import './OnboardingPopup.scss'; // Importa los estilos para este componente

interface OnboardingPopupProps {
  onClose: () => void;
}

const OnboardingPopup: React.FC<OnboardingPopupProps> = ({ onClose }) => {
  return (
    <section className='onboarding'>
    <div className="onboarding__popup--overlay">
      <div className="onboarding__popup--content">
        <h2>¡Bienvenido a My Maps Dashboard! 👋</h2>
        <p>¡Aquí podrás visualizar puntos de interés, crear rutas y explorar detalles de los hitos!</p>
        <p>Para empezar, te explicamos cómo usar la aplicación:</p>
        <ol>
          <li>
            Buscar una ubicación: Usa la barra de búsqueda en la parte superior para encontrar una dirección y centrar el mapa al instante. (todas las opciones actuales tiene la letra C para visualizarlas)
          </li>
          <li>
            Definir tu ruta: Alternativamente, haz clic en cualquier lugar del mapa para colocar tu punto de inicio. Vuelve a hacer clic para establecer tu destino y generar una ruta.
          </li>
          <li>
            Ver detalles de hitos: Haz clic en los marcadores rojos (hitos) en la ruta para ver información detallada y una vista de Google Street View.
          </li>
          <li>
            Controles del mapa: Usa los botones de control en el mapa para alternar la visibilidad de hitos, círculos de influencia y puntos de interés.
          </li>
          <li>
            Limpiar datos: Si deseas empezar de nuevo, usa el botón "Limpiar Datos" en los controles del mapa.
          </li>
        </ol>
        <button onClick={onClose} className="onboarding__popup--button">¡Entendido!</button>
      </div>
    </div>
    </section>
  );
};

export default OnboardingPopup;