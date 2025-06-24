import { DireccionVO } from "./direccion.vo";

interface Props {
    nombres: string,
    apellidos: string,
    telefono: string,
    direccion: DireccionVO,
}

export class ContactoVO {
    private constructor(private readonly props: Props) {
        this.validate();
    }

    static create(props: Props): ContactoVO {
        return new ContactoVO(props)
    }

    static fromPersistence(props: Props): ContactoVO {
        return new ContactoVO(props)
    }

    validate() {
        // logica de validacion
    }

    get nombres(): string {
        return this.props.nombres
    }

    get apellidos(): string {
        return this.props.apellidos
    }

    get telefono(): string {
        return this.props.telefono
    }

    get direccion(): DireccionVO {
        return this.props.direccion
    }

}