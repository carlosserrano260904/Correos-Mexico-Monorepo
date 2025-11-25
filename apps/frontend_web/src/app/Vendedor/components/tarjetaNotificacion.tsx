import { TarjetaNotificacion } from "./Notificacion";
import { RiCoupon3Line } from "react-icons/ri";


function NotificacionCupones(){
    return(
    <div>
        <TarjetaNotificacion
            Icono={RiCoupon3Line }
            nombreIcono= "Cupón"
            titulo="BIENVENIDO"
            subtitulo= "Cupones"
            tiempo="2 horas después"
            descripcion="El cupón que creaste está a punto de caducar. Considera notificar a tus clientes o extender la vigencia si aún deseas que lo aprovechen."
            className="Cupón"
        />
    </div>
    );
}
function NotificacionProducto(){
    return(
        <TarjetaNotificacion
            Icono={RiCoupon3Line }
            nombreIcono= "Producto"
            titulo="Playera básica negra"
            subtitulo= "Producto"
            tiempo="2 horas después"
            descripcion="Un producto de tu inventario está agotado o por agotarse. Revisa y repón existencias pronto."
            className="Producto"
        />
    );
}
function NotificacionOrden(){
    return(
        <TarjetaNotificacion
            Icono={RiCoupon3Line }
            nombreIcono= "Orden"
            titulo="#2958"
            subtitulo= "Ordenes"
            tiempo="2 horas después"
            descripcion="Tienes una nueva orden pendiente. Revisa los detalles del pedido y prepáralo para su envío o entrega.."
            className="Orden"
        />
    );
}

export default function BandejaNotificaciones(){
    return(
        <div className="flex flex-col size-140 bg-white p-[25px] gap-[25px] rounded-[12px] shadow-[0px_0px_30px_0px_rgba(38,38,38,0.1)]">
            <h1 className=" text-black font-sans text-[20px] font-semibold">Notificaciones</h1>
            <NotificacionCupones/>
            <NotificacionProducto/>
            <NotificacionOrden/>
        </div>
    );
}

