import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GeocodingRequestDto } from '../../../guias_trazabilidad/application/use-cases/crear-guia/dtos/geocoding-request.dto';
import { Result } from '../../../utils/result';
import { CoordenadasReadModel } from '../../../guias_trazabilidad/application/read-models/geocoding-response.read-model';
import { GoogleGeocodeRepositoryInterface } from '../../../guias_trazabilidad/application/ports/outbound/geocode.repository.interface';

@Injectable()
export class GoogleGeocodeRepository implements GoogleGeocodeRepositoryInterface {
  
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService
  ) {}

  async obtenerCoordenadas(
    request: GeocodingRequestDto
  ): Promise<Result<CoordenadasReadModel>> {
    
    try {
      const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
      const direccionFormateada = this.formatearDireccion(request);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${direccionFormateada}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        const readModel: CoordenadasReadModel = {
          latitud: location.lat,
          longitud: location.lng,
          direccionFormateada: data.results[0].formatted_address,
          precision: data.results[0].geometry.location_type,
          exitoso: true
        };
        
        return Result.success(readModel);
      } 

      // en caso de no cumplirse OK, pero hay respuesta
      return Result.failure(`Error geocode: ${data.status}`);
      
    } catch (error) {
        // error tecnico
        return Result.failure(`Error geocode: ${error.message}`);
    }
  }

  private formatearDireccion(request: GeocodingRequestDto): string {
    return encodeURIComponent(
      `${request.calle} ${request.numeroExterior}, ${request.numeroInterior || ''}, ${request.asentamiento}, ${request.codigoPostal} ${request.localidad}, ${request.estado}, ${request.pais}`
    );
  }
}