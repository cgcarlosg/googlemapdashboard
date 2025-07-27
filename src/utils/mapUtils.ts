export function interpolatePoints(
  path: google.maps.LatLngLiteral[],
  stepMeters = 1000
): google.maps.LatLngLiteral[] {
  const earthRadius = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const result: google.maps.LatLngLiteral[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];

    const lat1 = toRad(p1.lat);
    const lon1 = toRad(p1.lng);
    const lat2 = toRad(p2.lat);
    const lon2 = toRad(p2.lng);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    const steps = Math.floor(distance / stepMeters);
    for (let j = 1; j <= steps; j++) {
      const f = j / steps;
      const lat = p1.lat + (p2.lat - p1.lat) * f;
      const lng = p1.lng + (p2.lng - p1.lng) * f;
      result.push({ lat, lng });
    }
  }

  return result;
}

export function generarPuntoAleatorioEnCirculo(
  centro: google.maps.LatLngLiteral,
  radioMetros: number
): google.maps.LatLngLiteral {
  const y = Math.random();
  const x = Math.random();

  const distancia = radioMetros * Math.sqrt(x);
  const angulo = 2 * Math.PI * y;
  const METERS_PER_DEGREE_AT_EQUATOR = 111320;

  const deltaLat = (distancia * Math.cos(angulo)) / 111320;
  const deltaLng =
    (distancia * Math.sin(angulo)) /
    (METERS_PER_DEGREE_AT_EQUATOR * Math.cos((centro.lat * Math.PI) / 180));

  return {
    lat: centro.lat + deltaLat,
    lng: centro.lng + deltaLng,
  };
}
