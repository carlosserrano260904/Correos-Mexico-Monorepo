import { writeFileSync, readFileSync } from 'fs';
import { fetch } from 'undici';
import * as dotenv from 'dotenv';
import cliProgress from 'cli-progress';
import minimist from 'minimist';

dotenv.config();
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;
if (!GOOGLE_API_KEY) throw new Error('No API Key definida');

interface Oficina {
  clave_ofinica_postal: number;
  nombre_entidad: string;
  nombre_municipio: string;
  nombre_cuo: string;
  tipo_cuo?: string;
  domicilio: string;
  codigo_postal?: number;
  telefono?: string;
  latitud: number;
  longitud: number;
}

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

type GoogleRoutesResponse = {
  routes?: {
    distanceMeters?: number;
    polyline?: { encodedPolyline: string };
  }[];
};

function calcularDistancia(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function estaEnMexico(lat: number, lng: number): boolean {
  return lat >= 14 && lat <= 33 && lng >= -118 && lng <= -86;
}

function normalizar(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

async function obtenerDistanciaRuta(origen: Nodo, destino: Nodo): Promise<{ distancia: number, polyline: string } | null> {
  const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
  const body = {
    origin: { location: { latLng: { latitude: origen.lat, longitude: origen.lng } } },
    destination: { location: { latLng: { latitude: destino.lat, longitude: destino.lng } } },
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_AWARE',
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'routes.distanceMeters,routes.polyline.encodedPolyline',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json() as GoogleRoutesResponse;
    const route = data.routes?.[0];

    if (route?.distanceMeters && route?.polyline?.encodedPolyline) {
      return {
        distancia: route.distanceMeters / 1000,
        polyline: route.polyline.encodedPolyline,
      };
    }
  } catch (err) {
    console.error('Error al obtener ruta:', err);
  }

  return null;
}

function construirClusters(nodos: Nodo[], aristas: Arista[]): number[] {
  const parent = nodos.map((_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : parent[x] = find(parent[x]));
  const union = (x: number, y: number) => { parent[find(x)] = find(y); };
  for (const { origen, destino } of aristas) union(origen, destino);
  return parent.map(find);
}

async function conectarClusters(nodos: Nodo[], aristas: Arista[]) {
  const clusterIds = construirClusters(nodos, aristas);
  const clusterMap = new Map<number, Nodo[]>();
  nodos.forEach((n, i) => {
    const cid = clusterIds[i];
    if (!clusterMap.has(cid)) clusterMap.set(cid, []);
    clusterMap.get(cid)!.push(n);
  });

  const clusters = Array.from(clusterMap.values());
  console.log(`🔗 Detectados ${clusters.length} clusters`);

  if (clusters.length <= 1) return;

  for (let i = 0; i < clusters.length - 1; i++) {
    let mejorDist = Infinity;
    let mejorRuta: { a: Nodo; b: Nodo; ruta: Awaited<ReturnType<typeof obtenerDistanciaRuta>> | null } | null = null;

    for (const a of clusters[i]) {
      for (const b of clusters[i + 1]) {
        const straight = calcularDistancia(a.lat, a.lng, b.lat, b.lng);
        if (straight < mejorDist) {
          const ruta = await obtenerDistanciaRuta(a, b);
          if (ruta && ruta.distancia < mejorDist) {
            mejorDist = ruta.distancia;
            mejorRuta = { a, b, ruta };
          }
        }
      }
    }

    if (mejorRuta) {
      const { a, b, ruta } = mejorRuta;
      aristas.push({
        origen: a.id,
        destino: b.id,
        distancia: ruta!.distancia,
        peso: ruta!.distancia,
        polyline: ruta!.polyline,
      });
      console.log(`🌉 Conectado nodo ${a.id} con ${b.id} entre clusters`);
    }
  }
}

async function main() {
  const argv = minimist(process.argv.slice(2));
  const estadosSeleccionados: string[] = Array.isArray(argv.estado)
    ? argv.estado
    : argv.estado ? [argv.estado] : [];

  const estadosSeleccionadosNorm = estadosSeleccionados.map(normalizar);
  const datos: Oficina[] = JSON.parse(readFileSync('test/oficinas_coordenadas.json', 'utf-8'));

  const filtradas = estadosSeleccionados.length > 0
    ? datos.filter(of => estadosSeleccionadosNorm.includes(normalizar(of.nombre_entidad)))
    : datos;

  const validas = filtradas.filter(d => estaEnMexico(d.latitud, d.longitud));
  console.log(`📌 Nodos válidos en México: ${validas.length} / ${datos.length}`);

  const nodos: Nodo[] = validas.map((o, i) => ({
    id: i,
    nombre: o.nombre_cuo,
    categoria: o.tipo_cuo || 'Oficina',
    pesoCategoria: 1,
    lat: o.latitud,
    lng: o.longitud,
  }));

  const aristas: Arista[] = [];
  const K = 10;

  const progress = new cliProgress.SingleBar({
    format: 'Conectando [{bar}] {percentage}% | Nodo {value}/{total}',
    barCompleteChar: '█',
    barIncompleteChar: '░',
    hideCursor: true,
  });

  progress.start(nodos.length, 0);

  for (let i = 0; i < nodos.length; i++) {
    const nodo = nodos[i];
    const vecinos = nodos
      .filter(n => n.id !== nodo.id)
      .map(n => ({
        destino: n,
        distancia: calcularDistancia(nodo.lat, nodo.lng, n.lat, n.lng),
      }))
      .sort((a, b) => a.distancia - b.distancia);

    let conexiones = 0;
    for (const { destino } of vecinos) {
      if (conexiones >= K) break;
      if (!estaEnMexico(destino.lat, destino.lng)) continue;

      const ruta = await obtenerDistanciaRuta(nodo, destino);
      if (ruta) {
        aristas.push({
          origen: nodo.id,
          destino: destino.id,
          distancia: ruta.distancia,
          peso: ruta.distancia,
          polyline: ruta.polyline,
        });
        conexiones++;
      }
    }

    progress.update(i + 1);
  }

  progress.stop();

  await conectarClusters(nodos, aristas);

  const grafo = { nodos, aristas };
  writeFileSync('grafo.json', JSON.stringify(grafo, null, 2), 'utf-8');
  console.log('✅ grafo.json generado correctamente.');
}

main();
