import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Solicitud } from './entities/solicitud.entity';
import { Repository } from 'typeorm';
import { SolicitudDto } from './dto/solicitud.dto';

@Injectable()
export class VendedorService {
    constructor(
        @InjectRepository(Solicitud)
        private vendedorRepository: Repository<Solicitud>,
    ) {}

    async crearSolicitud(solicitud: SolicitudDto): Promise<Solicitud> {
        console.log('📝 Creando solicitud:', solicitud); // ← Agregar log
        
        const solicitudEntity = this.vendedorRepository.create({
            ...solicitud,
            userId: Number(solicitud.userId),
        });
        
        const resultado = await this.vendedorRepository.save(solicitudEntity);
        console.log('✅ Solicitud creada:', resultado); // ← Agregar log
        
        return resultado;
    }

    async encontrarPorUserId(userId: string): Promise<Solicitud | null> {
        // ✅ CORRECTO - Busca por 'userId' (campo que relaciona con el usuario)
        return this.vendedorRepository.findOne({ where: { userId: Number(userId) } });  
    }
}
