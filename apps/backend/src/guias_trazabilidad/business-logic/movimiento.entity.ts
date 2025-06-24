import { IdVO } from "./value-objects/id.vo"

interface Props {
    idMovimiento: IdVO, // auto
    idSucursal: string,
    idRuta: string,
    estado: string,
    localizacion: string,
    fecha_movimiento: Date // auto
}

export class MovimientoDomainEntity {

    private constructor(private readonly props: Props) {
        this.validate()
    }

    static create(props: Omit<Props, 'idMovimiento' | 'fecha_movimiento'>): MovimientoDomainEntity {
        const id = IdVO.create()
        const fecha_movimiento = new Date()

        return new MovimientoDomainEntity({
            ...props,
            idMovimiento: IdVO.create(),
            fecha_movimiento
        })
    }

    static fromPersistence(props: Props): MovimientoDomainEntity {
        return new MovimientoDomainEntity(props)
    }

    validate() {
        // logica de validacion
        if (!this.props.idSucursal?.trim()) {
            throw new Error('ID de sucursal es requerido');
        }
        if (!this.props.estado?.trim()) {
            throw new Error('Estado del movimiento es requerido');
        }
        if (!this.props.localizacion?.trim()) {
            throw new Error('Localizacion es requerida');
        }
    }

    get idMovimiento(): IdVO {
        return this.props.idMovimiento;
    }

    get idSucursal(): string {
        return this.props.idSucursal;
    }

    get idRuta(): string {
        return this.props.idRuta;
    }

    get estado(): string {
        return this.props.estado;
    }

    get localizacion(): string {
        return this.props.localizacion;
    }

    get fechaMovimiento(): Date {
        return this.props.fecha_movimiento;
    }

    // metodos de negocio
    esMovimientoDeEntrega(): boolean {
        return this.props.estado.toLowerCase() === 'entregado';
    }

    esMovimientoEnRuta(): boolean {
        return this.props.estado.toLowerCase() === 'en ruta' ||
            this.props.estado.toLowerCase() === 'en reparto';
    }

    toObject(): Props {
        return { ...this.props };
    }
}