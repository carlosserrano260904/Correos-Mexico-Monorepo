import React from "react";
import {NavbarCorreos} from "@/components/NavbarCorreos";
import Footer from "@/components/footer";


const EnviarCarta: React.FC = () => {
    return (
    
    <section>

    <NavbarCorreos/>
      {/* Hero superior */}
      <div className="bg-pink-100 w-full px-4 md:px-20 py-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-20">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center md:text-left">
            Cómo <span className="text-[#E6007E]">enviar.</span>
          </h1>
          <img
            src="/3cajitas.png"
            alt="Cajas apiladas"
            className="w-32 md:w-40"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="bg-white px-4 md:px-20 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#006666] mb-4">
            ¿Cómo enviar una carta?
          </h2>
          <p className="mb-6 text-[#E6007E] font-medium">
            Hacer un envío a través de Correos de México es muy fácil. Para que tu
            correspondencia llegue de manera correcta a su destino, sigue estos
            pasos:
          </p>

          {/* Paso 1 */}
<div className="mb-8 text-gray-700">
  <div className="flex items-center gap-3 mb-2">
    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E6007E] text-white font-bold">
      1
    </span>
    <h3 className="font-bold text-[#006666]">Rotula el sobre</h3>
  </div>
  <p className="mb-2">
    En el anverso del sobre (frente), coloca a mano o en etiqueta
    adherible los datos de:
  </p>
  <ul className="list-disc ml-6 space-y-1">
    <li>
      <span className="font-semibold text-[#E6007E]">Remitente</span>{" "}
      (persona que envía) en la esquina superior izquierda.
    </li>
    <li>
      <span className="font-semibold text-[#E6007E]">Destinatario</span>{" "}
      (persona que recibe) en el centro inferior derecho.
    </li>
  </ul>
   <img
              src="carta.png"
              alt="Ejemplo sobre"
              className="mt-4 mx-auto w-full max-w-sm border rounded-lg"
            />
</div>

         

          <div className="space-y-6 text-gray-700">
  {[
    { num: 2, title: "Lleva tu carta", desc: "Lleva tu carta a la Oficina Postal más cercana." },
    { num: 3, title: "Elige la modalidad de envío", desc: "(servicio estándar o servicio exprés MEXPOST) y realiza el pago correspondiente." },
    { num: 4, title: "Coloca la estampilla", desc: "Coloca la estampilla de franqueo postal en la esquina superior derecha." },
    { num: 5, title: "Deposita tu carta", desc: "(Si agregaste el servicio adicional de Correo Registrado, recibirás un número de seguimiento)." }
  ].map((step) => (
    <div key={step.num}>
      <div className="flex items-center gap-3 mb-1">
        <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E6007E] text-white font-bold">
          {step.num}
        </span>
        <h3 className="font-bold text-[#006666]">{step.title}</h3>
      </div>
      <p>{step.desc}</p>
    </div>
  ))}
</div>

        </div>
      </div>
      {/* ¿Cómo enviar un paquete? */}
<div className="mt-16 text-gray-700  max-w-3xl mx-auto">
  <h2 className="text-2xl font-bold text-[#006666] mb-6">
    ¿Cómo enviar un paquete?
  </h2>
  <p className="mb-6 text-[#E6007E] font-medium">
            Hacer un envío a través de Correos de México es muy fácil.
            Para que tu paquete llegue de manera correcta a su destino, sigue estos pasos:
          </p>


  <div className="space-y-6">
    {[
      {
        num: 1,
        title: "Asegúrate de que tu envío no contenga objetos prohibidos."
      },
      {
        num: 2,
        title: "Coloca tus productos en un sobre o una caja",
        desc: "que se adapten a las necesidades de tu articulo, pero no lo cierres ni selles, Pues en la Oficina Poatal será revisado antes de enviar.",
      }
    
    ].map((step) => (
      <div key={step.num}>
        <div className="flex items-center gap-3 mb-1 mt-16 text-gray-700  max-w-3xl mx-auto">
          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E6007E] text-white font-bold">
            {step.num}
          </span>
          <h3 className="font-bold text-[#006666]">{step.title}</h3>
        </div>
        <p>{step.desc}</p>
      </div>
    ))}
    <div className="mb-8 ">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E6007E] text-white font-bold">
                3
              </span>
              <h3 className="font-bold text-[#006666]">Rotula tu paquete</h3>
            </div>
            <p className="mb-2">
              En una de las caras de la caja, coloca a mano o en una etiqueta adherible los datos de: 
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                <span className="font-semibold text-[#E6007E]">Remitente</span>{" "}
                (persona que envía) en la esquina superior izquierda.
              </li>
              <li>
                <span className="font-semibold text-[#E6007E]">Destinatario</span>{" "}
                (persona que recibe) en el centro inferior derecho.
              </li>
            </ul>
            <p className="mb-2">
                Ambos deben inscribirse en el siguiente orden:
                nombre completo, domicilio con calle, número interior o exterior, colonia, código postal, alcaldia o municipio, ciudad o poblacion, entidad federeativa.
            </p>
            <img
              src="rename.png"
              alt="Ejemplo sobre"
              className="mt-4 mx-auto w-full max-w-sm border rounded-lg"
            />
          </div>
  </div>
</div>
 {/* empaque */}
<div className="mt-16 text-gray-700  max-w-3xl mx-auto">
  <h2 className="text-2xl font-bold text-[#006666] mb-6">
    Empaque o Embalaje
  </h2>
  <p className="mb-6 text-[#E6007E] font-medium">
            Empaqueta tus articulos de manera correcta y protégelos de cualquier
            percance de transportación. Garantiza la entrega adecuada y segura de tus productos
            tomado en cuenta las siguientes recomendaciones:
          </p>
           <img
              src="asegura.png"
              alt="Ejemplo sobre"
              className="mt-4 mx-auto w-full max-w-sm border rounded-lg"
            />
             <img
              src="protege.png"
              alt="Ejemplo sobre"
              className="mt-4 mx-auto w-full max-w-sm border rounded-lg"
            />
             <img
              src="restricciones.png"
              alt="Ejemplo sobre"
              className="mt-4 mx-auto w-full max-w-sm border rounded-lg"
            />
            <h2 className="text-1xl font-bold text-[#006666] mb-6">
                Peso y medidas de los envíos
            </h2>
            <p>
                Toma encuenta los limites de peso de acuerdo a las caracteristicas de tu envío.
                Para efectos de cobro se aplicará el peso mayor.
            </p>
            <div className="mt-6">
            <h2 className="text-1xl font-bold text-[#006666] mb-6">
                Nacional (MEXPOST)
            </h2>
             <ul className="list-disc ml-6 space-y-1">
                <li>
                <span className="font-semibold text-[#E6007E]">Peso real maximo:</span>{" "}
                25 kg
                </li>
                <li>
                <span className="font-semibold text-[#E6007E]">Peso volumétrico</span>{" "}
                40 kg
                </li>
            </ul>

            </div>
            <div className="mt-6">
            <h2 className="text-1xl font-bold text-[#006666] mb-6">
                Internacional (MEXPOST)
            </h2>
             <ul className="list-disc ml-6 space-y-1">
                <li>
                <span className="font-semibold text-[#E6007E]">Peso real maximo:</span>{" "}
                25 kg
                </li>
                <li>
                <span className="font-semibold text-[#E6007E]">Peso volumétrico</span>{" "}
                40 kg
                </li>
            </ul>
            </div>
            <div className="mt-6">
            <h2 className="text-1xl font-bold text-[#006666] mb-6">
                Tips de embalaje
            </h2>
             <ul className="list-disc ml-6 space-y-1">
                <li>
                Si envías varios artículos en la misma caja, envuelvelos por separado.
                </li>
                <li>
                Utiliza cajas de doble capa para articulos frágiles o pesados
                </li>
                <li>
                    <span className="font-semibold text-[#E6007E]">Sella tu caja con el metodo H de encintado: </span>{" "}
                </li>
            </ul>
            <img
              src="sella.png"
              alt="Ejemplo sobre"
              className="mt-4 mx-auto w-full max-w-sm border rounded-lg"
            />
            </div>
</div>
 

  <Footer />
    </section>
  );
};

export default EnviarCarta;
