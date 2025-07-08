import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('oficinas')
export class Oficina {
  @PrimaryGeneratedColumn()
  id_oficina: number;

  @Column({ type: 'integer', unique: true, name: 'clave_oficina_postal' })
  clave_oficina_postal: number;

  @Column({ length: 5 })
  clave_cuo: string;

  @Column({ length: 5 })
  clave_inmueble: string;

  @Column({ length: 10 })
  clave_inegi: string;

  @Column({ length: 2 })
  clave_entidad: string;

  @Column({ length: 50 })
  nombre_entidad: string;

  @Column({ length: 50 })
  nombre_municipio: string;

  @Column({
    type: 'enum',
    enum: [
      'Centro Operativo Mexpost',
      'Centro de Distribución',
      'Administración Postal',
      'Gerencia Postal Estatal',
      'Oficina de Servicios Directos',
      'Sucursal',
      'Módulo de Depósitos Masivos',
      'Centro Operativo de Reparto',
      'Gerencia',
      'Centro de Atención al Público',
      'Oficina de Transbordo',
      'Coordinación Operativa',
      'Oficina Operativa',
      'Consol. de Ingresos y Egresos',
      'Coordinación Mexpost',
      'Puerto Maritimo',
      'Agencia Municipal',
      'Centro de Atención Integral',
      'Aeropuerto',
      'Subdirección',
      'Dirección',
      'Otros',
      'Módulo de Servicios',
      'Coordinación Administrativa',
      'Almacen',
      'Dirección General',
      'Tienda Filatélica',
      'Oficina de Cambio',
      'Of. Sindicato',
      'Centro de Depósitos Masivos',
    ],
  })
  tipo_cuo: string;

  @Column({ length: 100 })
  nombre_cuo: string;

  @Column({ length: 200 })
  domicilio: string;

  @Column({ length: 5 })
  codigo_postal: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ length: 50, default: 'México' })
  pais: string;

  @Column('decimal')
  latitud: number;

  @Column('decimal')
  longitud: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_registro: Date;
}
