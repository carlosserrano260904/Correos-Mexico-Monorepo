const situaciones = ['Creado', 'En proceso', 'En recoleccion', 'Recolectado', 'En transito', 'En aduana', 'En entrega', 'Entregado', 'Reprogramado', 'Cancelado', 'Devuelto', 'Rechazado'] as const;
type Situacion = (typeof situaciones)[number];

export class SituacionVO {
    private constructor(private readonly value: Situacion) {
    }

    static create(situacion: Situacion): SituacionVO {
        if (!situaciones.includes(situacion)) {
            throw new Error('Situacion no valida');
        }

        switch (situacion) {
            case 'Creado':
                return new SituacionVO('Creado');
            case 'En proceso':
                return new SituacionVO('En proceso');
            case 'En recoleccion':
                return new SituacionVO('En recoleccion');
            case 'Recolectado':
                return new SituacionVO('Recolectado');
            case 'En transito':
                return new SituacionVO('En transito');
            case 'En aduana':
                return new SituacionVO('En aduana');
            case 'En entrega':
                return new SituacionVO('En entrega');
            case 'Entregado':
                return new SituacionVO('Entregado');
            case 'Reprogramado':
                return new SituacionVO('Reprogramado');
            case 'Cancelado':
                return new SituacionVO('Cancelado');
            case 'Devuelto':
                return new SituacionVO('Devuelto');
            case 'Rechazado':
                return new SituacionVO('Rechazado');
        }
    }

    static fromPersistence(value: string): SituacionVO {
        return new SituacionVO(value as Situacion)
    }

    static fromString(value: string): SituacionVO {
        return new SituacionVO(value as Situacion)
    }

    get situacion(): Situacion {
        return this.value
    }
}