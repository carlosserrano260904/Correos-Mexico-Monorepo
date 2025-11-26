import { Result } from '../../../../utils/result';
import { GeocodingRequestDto } from '../../use-cases/crear-guia/dtos/geocoding-request.dto';
import { CoordenadasReadModel } from '../../read-models/geocoding-response.read-model';

export const GOOGLE_GEOCODE_REPOSITORY_INTERFACE = Symbol(
  'Google_Geocode_Repository_Interface',
);

export interface GoogleGeocodeRepositoryInterface {
  // firma para obtener la geolocalizacion
  obtenerCoordenadas(
    request: GeocodingRequestDto,
  ): Promise<Result<CoordenadasReadModel>>;
}
