import { MovimientoDomainEntity } from './movimiento.entity';
import { IncidenciaDomainEntity } from './incidencias.entity';
import {
  ContactoVO,
  SituacionVO,
  EmbalajeVO,
  IdVO,
  ValorDeclaradoVO,
  NumeroDeRastreoVO,
} from './value-objects';

/**
 * Tipos para constructor
 */
interface Props {
  id: IdVO; // safe
  numeroDeRastreo: NumeroDeRastreoVO; // safe
  situacion: SituacionVO;
  remitente: ContactoVO;
  destinatario: ContactoVO;
  embalaje: EmbalajeVO;
  valorDeclarado: ValorDeclaradoVO;
  fecha: Date; // safe
  fechaEntregaEstimada: Date;
  ultimoMovimiento?: MovimientoDomainEntity; // safe
  incidencia?: IncidenciaDomainEntity;
}

/**
 * Tipos para factory update
 */
type UpdatableProps = Partial<
  Pick<Props, 'situacion' | 'ultimoMovimiento' | 'incidencia'>
>;

/**
 * Entidad Guia
 */
export class GuiaDomainEntity {
  private constructor(private props: Props) {}

  /**
   * Instancia la guia
   * @param {Props} props - props
   * @property {ContactoVo} props.remitente - informacion del destinatario
   * @property {ContactoVO} props.destinatario - informacion del destinatario.
   * @property {EmbalajeVO} props.embalaje - tipo de embalaje.
   * @property {ValorDeclaradoVO} props.valorDeclarado - valor del envio.
   * @property {IncidenciaDomainEntity} props.incidencia - informacion de una incidencia
   * @returns {GuiaDomainEntity} - instancia Guia
   */
  public static create(
    props: Omit<
      Props,
      | 'id'
      | 'numeroDeRastreo'
      | 'fecha'
      | 'fechaEntregaEstimada'
      | 'ultimoMovimiento'
      | 'situacion'
      | 'incidencia'
    >,
  ): GuiaDomainEntity {
    return new GuiaDomainEntity({
      ...props,
      id: IdVO.safeCreate(),
      numeroDeRastreo: NumeroDeRastreoVO.safeCreate(),
      situacion: SituacionVO.safeCreate('En proceso'),
      fecha: new Date(),
      fechaEntregaEstimada: new Date(),
    });
  }

  /**
   * Registra un nuevo movimmiento y devuelve la guia actualizada
   * @param props
   * @property {movimiento} MovimientoDomainEntity - informacion del movimiento
   * @returns {GuiaDomainEntity} - copia de la guia con el nuevo movimiento integrado
   */
  public hacerMovimiento(movimiento: MovimientoDomainEntity): GuiaDomainEntity {
    // la situacion del paquete debe ser la misma que el estado de la guia
    // se usa el safeCreate porque

    // variable auxiliar nuevaSituacion para ser usada al mutar la instancia actual y devolver la copia para persistir
    const nuevaSituacion = SituacionVO.safeCreate(
      movimiento.estado.getSituacion,
    );
    // TODO: investigar restricciones, como por ejemplo, si el estado es entregado, este nuevo...
    // movimiento ya no puede ser, a menos que sea devuelto
    // ! si se van a aplicar restricciones de negocio aqui mismo, usar el result pattern
    return this.update({
      situacion: movimiento.estado,
      ultimoMovimiento: movimiento,
    });
  }

  /**
   * @param props
   * @property {IncidenciaDomainEntity} props.incidencia - datos de la incidencia
   * @returns {GuiaDomainEntity} - copia de la guia con la nueva incidencia integrada
   */
  public registrarIncidencia(
    incidencia: IncidenciaDomainEntity,
  ): GuiaDomainEntity {
    // TODO: investigar si al registrar incidencia, habra algun cambio en el movimiento del envio
    return this.update({
      incidencia: incidencia,
    });
  }

  /**
   * Muta la instancia y devuelve la copia modificada
   * @param {UpdatableProps} updatedProps - UpdatableProps
   * @property {situacion} SituacionVO - situacion de la guia
   * @property {ultimoMovimiento} MovimientoDomainEntity - informacion del nuevo movimiento
   * @return {GuiaDomainEntity} - copia modificada de la original
   */
  private update(updatedProps: UpdatableProps): GuiaDomainEntity {
    return new GuiaDomainEntity({
      ...this.props,
      ...updatedProps,
    });
  }

  /**
   * Reconstruye una entidad guia con datos desde la base de datos
   * @param {Props} props
   * @returns {GuiaDomainEntity} entidad guia
   */
  public static fromPersistence(props: Props): GuiaDomainEntity {
    return new GuiaDomainEntity(props);
  }

  public pesoVolumetricoVSReal() {
    if (
      this.props.embalaje.calcularPesoVolumetrico() >
      this.props.embalaje.calcularPeso()
    ) {
      return this.props.embalaje.calcularPesoVolumetrico();
    } else {
      return this.props.embalaje.calcularPeso();
    }
  }

  get Id(): IdVO {
    return this.props.id;
  }

  get NumeroRastreo(): NumeroDeRastreoVO {
    return this.props.numeroDeRastreo;
  }

  get SituacionActual(): SituacionVO {
    return this.props.situacion;
  }

  get UltimoMovimiento(): MovimientoDomainEntity | undefined {
    return this.props.ultimoMovimiento;
  }

  get Remitente(): ContactoVO {
    return this.props.remitente;
  }

  get Destinatario(): ContactoVO {
    return this.props.destinatario;
  }

  get Embalaje(): EmbalajeVO {
    return this.props.embalaje;
  }

  get ValorDeclarado(): ValorDeclaradoVO {
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

  get incidencia(): IncidenciaDomainEntity | undefined {
    return this.props.incidencia;
  }
}
