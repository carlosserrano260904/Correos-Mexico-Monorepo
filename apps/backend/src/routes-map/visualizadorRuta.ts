import { readFileSync, writeFileSync } from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_MAPS_API_KEY;
if (!apiKey) throw new Error('API Key de Google Maps no está definida');

interface Nodo {
  id: number;
  nombre: string;
  categoria: string;
  pesoCategoria: number;
  lat: number;
  lng: number;
}

interface Arista {
  origen: number;
  destino: number;
  distancia: number;
  peso: number;
  polyline?: string;
}

const grafo = JSON.parse(readFileSync('grafo.json', 'utf-8')) as {
  nodos: Nodo[];
  aristas: Arista[];
};

const ruta = JSON.parse(readFileSync('ruta_25_88.json', 'utf-8')) as {
  nodos: number[];
};

const nodosRuta = grafo.nodos.filter(n => ruta.nodos.includes(n.id));
const aristasRuta: Arista[] = [];

for (let i = 0; i < ruta.nodos.length - 1; i++) {
  const a = ruta.nodos[i];
  const b = ruta.nodos[i + 1];
  const arista = grafo.aristas.find(
    x => (x.origen === a && x.destino === b) || (x.origen === b && x.destino === a)
  );
  if (arista) aristasRuta.push(arista);
}

const centerLat = nodosRuta[0].lat;
const centerLng = nodosRuta[0].lng;

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Ruta entre nodos</title>
  <style>
    #map { height: 100vh; width: 100%; margin: 0; padding: 0; }
    html, body { margin: 0; padding: 0; height: 100%; }
  </style>
  <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"></script>
  <script>
    function decodePolyline(encoded) {
      let points = [];
      let index = 0, lat = 0, lng = 0;

      while (index < encoded.length) {
        let b, shift = 0, result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        points.push({ lat: lat / 1e5, lng: lng / 1e5 });
      }

      return points;
    }

    function initMap() {
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: { lat: ${centerLat}, lng: ${centerLng} },
      });

      const nodos = ${JSON.stringify(nodosRuta)};
      const aristas = ${JSON.stringify(aristasRuta)};

      for (const nodo of nodos) {
        new google.maps.Marker({
          position: { lat: nodo.lat, lng: nodo.lng },
          map,
          label: nodo.id.toString(),
          title: nodo.nombre
        });
      }

      for (const arista of aristas) {
        if (arista.polyline) {
          const path = decodePolyline(arista.polyline);
          new google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: "#00AA00",
            strokeOpacity: 0.9,
            strokeWeight: 4,
            map: map
          });
        }
      }
    }

    window.onload = initMap;
  </script>
</head>
<body>
  <div id="map"></div>
</body>
</html>`;

writeFileSync('ruta_visual.html', html, 'utf-8');
console.log('🗺️ Visualizador de ruta generado como ruta_visual.html');
