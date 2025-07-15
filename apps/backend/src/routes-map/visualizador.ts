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

function loadGraph(filePath: string): { nodos: Nodo[]; aristas: Arista[] } {
  const rawData = readFileSync(filePath, 'utf-8');
  const grafo = JSON.parse(rawData) as { nodos: Nodo[]; aristas: Arista[] };
  return grafo;
}

function generarHTML(nodos: Nodo[], aristas: Arista[]) {
  const centerLat = nodos[0].lat;
  const centerLng = nodos[0].lng;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Grafo en Google Maps</title>
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
        zoom: 6,
        center: { lat: ${centerLat}, lng: ${centerLng} },
      });

      const nodos = ${JSON.stringify(nodos)};
      const aristas = ${JSON.stringify(aristas)};

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
            strokeColor: "#0000FF",
            strokeOpacity: 0.8,
            strokeWeight: 3,
            map: map
          });
        } else {
          const origen = nodos.find(n => n.id === arista.origen);
          const destino = nodos.find(n => n.id === arista.destino);
          if (origen && destino) {
            new google.maps.Polyline({
              path: [
                { lat: origen.lat, lng: origen.lng },
                { lat: destino.lat, lng: destino.lng }
              ],
              geodesic: true,
              strokeColor: "#FF0000",
              strokeOpacity: 0.6,
              strokeWeight: 2,
              map: map
            });
          }
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
}

function main() {
  const { nodos, aristas } = loadGraph('grafo.json');
  const html = generarHTML(nodos, aristas);
  writeFileSync('mapa_grafo.html', html, 'utf-8');
  console.log('🗺️ HTML generado como mapa_grafo.html');
}

main();
