import { ContactoVO } from "./value-objects/contacto.vo"
import { SituacionVO } from "./value-objects/situacion.vo"
import { EmbalajeVO } from "./value-objects/embalaje.vo"
import { IdVO } from "./value-objects/id.vo"
import { ValorDeclaradoVO } from "./value-objects/valorDeclarado.vo"
import { MovimientoDomainEntity } from "./movimiento.entity"
import { NumeroSeguimientoVO } from "./value-objects/numeroSeguimiento.vo"

interface Props {
    id: IdVO,
    numeroSeguimiento: NumeroSeguimientoVO,
    situacion: SituacionVO,
    remitente: ContactoVO,
    destinatario: ContactoVO,
    embalaje: EmbalajeVO,
    valorDeclarado: ValorDeclaradoVO,
    fecha: Date,
    fechaEntregaEstimada: Date,
    ultimoMovimiento?: MovimientoDomainEntity
}

type UpdatableProps = Partial<Pick<Props, 'situacion' | 'ultimoMovimiento'>>

export class GuiaDomainEntity {

    private constructor(private props: Props) {
        this.validate()
    }

    static create(props: Omit<Props, 'id' | 'numeroSeguimiento' | 'fecha' | 'fechaEntregaEstimada' | 'ultimoMovimiento' | 'situacion'>): GuiaDomainEntity {
        return new GuiaDomainEntity({
            ...props,
            id: IdVO.create(),
            numeroSeguimiento: NumeroSeguimientoVO.create(),
            situacion: SituacionVO.create('En proceso'),
            fecha: new Date(),
            fechaEntregaEstimada: new Date(), // no se si lo cambiamos a string pero me gustaria normalizar las fechas para el back office
        })
    }

    nuevoMovimiento(data: {
        idSucursal: string,
        idRuta: string,
        estado: string,
        localizacion: string,
    }): GuiaDomainEntity {
        const movimiento = MovimientoDomainEntity.create({
            idSucursal: data.idSucursal,
            idRuta: data.idRuta,
            estado: data.estado,
            localizacion: data.localizacion
        })

        const nuevaSituacion = SituacionVO.fromString(data.estado)

        return this.update({
            situacion: nuevaSituacion,
            ultimoMovimiento: movimiento
        })
    }

    private update(updatedProps: UpdatableProps): GuiaDomainEntity {
        return new GuiaDomainEntity({
            ...this.props,
            ...updatedProps,
        })
    }



    // se hidrata desde la base de datos
    static fromPersistence(props: Props): GuiaDomainEntity {
        return new GuiaDomainEntity(props)
    }


    //  TODO: validar que el remitente y el destinatario sean diferentes
    private validate() {
        // logica de validacion, por ahora "anemico"
    }

    // metodos de negocio

    pesoVolumetricoVSReal() {
        if (this.props.embalaje.calcularPesoVolumetrico() > this.props.embalaje.calcularPeso()) {
            return this.props.embalaje.calcularPesoVolumetrico()
        } else {
            return this.props.embalaje.calcularPeso()
        }
    }

    // hacerMovimiento(movimiento: MovimientoDomainEntity): MovimientoDomainEntity {

    // }

    get id(): IdVO {
        return this.props.id;
    }

    get numeroSeguimiento(): NumeroSeguimientoVO {
        return this.props.numeroSeguimiento;
    }

    get situacionActual(): SituacionVO {
        return this.props.situacion;
    }

    get ultimoMovimiento(): MovimientoDomainEntity | undefined {
        return this.props.ultimoMovimiento;
    }

    get remitente(): ContactoVO {
        return this.props.remitente;
    }

    get destinatario(): ContactoVO {
        return this.props.destinatario;
    }

    get embalaje(): EmbalajeVO {
        return this.props.embalaje;
    }

    get valorDeclarado(): ValorDeclaradoVO {
        return this.props.valorDeclarado;
    }

    get fechaCreacion(): Date {
        return this.props.fecha;
    }

    get fechaActualizacion(): Date {
        return this.props.fecha;
    }

    get fechaEntregaEstimada(): Date {
        return this.props.fechaEntregaEstimada;
    }
}