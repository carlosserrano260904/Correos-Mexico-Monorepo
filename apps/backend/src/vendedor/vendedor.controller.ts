import { Controller, Get, Param, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { VendedorService } from './vendedor.service';
import { SolicitudDto } from './dto/solicitud.dto';
import { Solicitud } from './entities/solicitud.entity';

@Controller('vendedor')
export class VendedorController {
    constructor(private readonly vendedorService: VendedorService) { } // ← Solo el service

    @Post('crear-solicitud')
    async crearSolicitud(@Body() solicitud: SolicitudDto): Promise<Solicitud> {
        console.log('🎯 Solicitud recibida en controller:', solicitud); // ← Agregar log
        return this.vendedorService.crearSolicitud(solicitud);
    }

    @Get('encontrar-solicitud/:userId') // ← Agregar endpoint GET que falta
    async encontrarPorUserId(@Param('userId') userId: string) {
        return this.vendedorService.encontrarPorUserId(userId);
    }
}