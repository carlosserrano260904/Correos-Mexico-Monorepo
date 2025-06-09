// src/routes/routes.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoutesService {
  constructor(private configService: ConfigService) {}

  async getRoute(
    origin: LatLng,
    destination: LatLng,
    intermediates?: LatLng[],
  ) {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
    const url = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${apiKey}`;

    const body: any = {
      origin: {
        location: { latLng: origin },
      },
      destination: {
        location: { latLng: destination },
      },
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
      optimizeWaypointOrder: true,
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false,
      },
      languageCode: 'es-ES',
      units: 'METRIC',
    };

    // Si hay puntos intermedios, los agregamos al cuerpo
    if (intermediates && intermediates.length > 0) {
      body.intermediates = intermediates.map((point) => ({
        location: {
          latLng: {
            latitude: point.latitude,
            longitude: point.longitude,
          },
        },
      }));
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': '*', // Puedes ajustar esto para reducir tamaño de respuesta
    };

    try {
      const response = await axios.post(url, body, { headers });
      return response.data;
    } catch (error) {
      console.error(
        'Google Routes API error:',
        error.response?.data || error.message,
      );
      throw new Error('No se pudo obtener la ruta');
    }
  }
}

type LatLng = {
  latitude: number;
  longitude: number;
};
