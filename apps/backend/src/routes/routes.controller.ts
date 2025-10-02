// src/routes/routes.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { RoutesService } from './routes.service';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  async getRoute(@Body() body: GetRouteDto) {
    const { origin, destination, intermediates } = body;
    return this.routesService.getRoute(origin, destination, intermediates);
  }
}

type LatLng = {
  latitude: number;
  longitude: number;
};

type GetRouteDto = {
  origin: LatLng;
  destination: LatLng;
  intermediates?: LatLng[];
};
