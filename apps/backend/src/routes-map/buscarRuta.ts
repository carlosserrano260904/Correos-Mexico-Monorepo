import { readFileSync, writeFileSync } from 'fs';
import minimist from 'minimist';

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

type Grafo = {
  nodos: Nodo[];
  aristas: Arista[];
};

function cargarGrafo(path: string): Grafo {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function dijkstra(grafo: Grafo, inicioId: number, finId: number): { ruta: number[], distanciaTotal: number } | null {
  const dist = new Map<number, number>();
  const prev = new Map<number, number | null>();
  const visitado = new Set<number>();

  for (const nodo of grafo.nodos) {
    dist.set(nodo.id, Infinity);
    prev.set(nodo.id, null);
  }

  dist.set(inicioId, 0);

  while (visitado.size < grafo.nodos.length) {
    let u: number | null = null;
    let minDist = Infinity;

    for (const [id, d] of dist.entries()) {
      if (!visitado.has(id) && d < minDist) {
        minDist = d;
        u = id;
      }
    }

    if (u === null || u === finId) break;

    visitado.add(u);

    const vecinos = grafo.aristas.filter(a =>
      a.origen === u || a.destino === u
    );

    for (const a of vecinos) {
      const vecino = a.origen === u ? a.destino : a.origen;
      const alt = dist.get(u)! + a.peso;

      if (alt < dist.get(vecino)!) {
        dist.set(vecino, alt);
        prev.set(vecino, u);
      }
    }
  }

  const ruta: number[] = [];
  let actual: number | null = finId;

  while (actual !== null) {
    ruta.unshift(actual);
    actual = prev.get(actual)!;
  }

  if (ruta[0] !== inicioId) return null;

  const distanciaTotal = ruta.reduce((acc, curr, i) => {
    if (i === 0) return 0;
    const a = ruta[i - 1];
    const b = curr;
    const arista = grafo.aristas.find(x =>
      (x.origen === a && x.destino === b) || (x.origen === b && x.destino === a)
    );
    return acc + (arista?.peso || Infinity);
  }, 0);

  return { ruta, distanciaTotal };
}

// CLI
const argv = minimist(process.argv.slice(2));
const origen = parseInt(argv.origen || argv.o);
const destino = parseInt(argv.destino || argv.d);
const archivo = argv.archivo || 'grafo.json';

if (isNaN(origen) || isNaN(destino)) {
  console.error('❌ Debes especificar --origen <id> y --destino <id>');
  process.exit(1);
}

const grafo = cargarGrafo(archivo);
const resultado = dijkstra(grafo, origen, destino);

if (!resultado) {
  console.log(`🚫 No hay ruta entre nodo ${origen} y nodo ${destino}`);
} else {
  const { ruta, distanciaTotal } = resultado;
  console.log(`✅ Ruta más corta de nodo ${origen} a nodo ${destino}:`);
  console.log(`ruta_${origen}_${destino} = [${ruta.join(', ')}]`);
  console.log(`📏 Distancia total: ${distanciaTotal.toFixed(2)} km`);

  writeFileSync(`ruta_${origen}_${destino}.json`, JSON.stringify({ nodos: ruta }, null, 2), 'utf-8');
  console.log(`📝 Ruta guardada en ruta_${origen}_${destino}.json`);
}
