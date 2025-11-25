'use client' // <-- ¡ESTA LÍNEA ES ESENCIAL!

import React from 'react'
import { useRouter } from 'next/navigation'
import { IoArrowBackOutline } from 'react-icons/io5'
import { NavbarCorreos } from '@/components/NavbarCorreos'
// Nota: Cambié 'Foterr' por 'Footer' para ser consistente con el archivo CotizarPage
import Footer from '@/components/footerCorreos' 
import Head from 'next/head'

export default function Tarifas() {
    const router = useRouter() // Ahora se permite usar useRouter
    
    const depositosIndividuales = [
        {
            nombre: 'Cartas y Tarjetas Postales Individual Nacional.',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975621/1_Cartas_y_Tarjetas_Postales_2025.pdf',
        },
        {
            nombre: 'Impresos Publicitarios',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975622/2_Impresos_en_General_2025.pdf',
        },
        {
            nombre: 'Servicios Adicionales',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975630/10_Servicios_Adicionales_Individuales_2025.pdf',
        },
        {
            nombre: 'Material para Ciegos, Impresos y Paquetes',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975627/7_INTERNACIONAL_Servicio_de_Registrado_2025.pdf',
        },
        {
            nombre: 'Internacional EMS y Exprés',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975625/5_INTERNACIONAL_EMS_2025.pdf',
        },
        {
            nombre: 'Internacional M-Bag',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975626/6_INTERNACIONAL_Encomiendas_Postales_2025.pdf',
        },
        {
            nombre: 'Internacional Envío Certificado',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975629/9_INTERNACIONAL_Servicios_Adicionales_2025.pdf',
        },
        {
            nombre: 'Urgente Nacional Documento Certificado',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975633/2_Cartas_Corporativas_2025.pdf',
        },
        {
            nombre: 'Paquetería Tradicional',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975623/3_Paqueteria_Individual_2025.pdf',
        },
    ]

    const depositosMasivos = [
        {
            nombre: 'Cartas',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975632/1_Respuesta_a_Promociones_Comerciales_2025.pdf',
        },
        {
            nombre: 'Correspondencias',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975635/4_Impresos_Depositados_por_sus_Editores_o_Agentes_2025.pdf',
        },
        {
            nombre: 'Impresos',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975634/3_Publicaciones_Periodicas_2025.pdf',
        },
        {
            nombre: 'Publicitarios Periódicos',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975634/3_Publicaciones_Periodicas_2025.pdf',
        },
        {
            nombre: 'Propaganda Comercial',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975637/6_Propaganda_Comercial_2025.pdf',
        },
        {
            nombre: 'Tarjetas Postales',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975636/5_Paqueteria_Corporativa_2025.pdf',
        },
        {
            nombre: 'Servicios Adicionales',
            url: 'https://www.gob.mx/cms/uploads/attachment/file/975638/7_Registros_Postales_y_Servicios_Adicionales_Corporativos_2025.pdf',
        },
    ]

    return (
        <>
            <Head>
                <title>Tarifas de Envío - Correos de México</title>
            </Head>

            <NavbarCorreos />

            <main className="min-h-screen bg-gray-100 px-6 pt-20 pb-32">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-10">
                    
                    {/* Botón Regresar */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-8"
                    >
                        <IoArrowBackOutline className="w-5 h-5 mr-2" />
                        Regresar
                    </button>

                    <h1 className="text-4xl font-bold mb-8">
                        <span className="text-pink-500">Tarifas</span>{' '}
                        <span className="text-gray-800">de correos</span>
                    </h1>
                    
                    {/* Depósitos individuales */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Depósitos individuales.</h2>
                        <ul className="space-y-2">
                            {depositosIndividuales.map((item, index) => (
                                <li
                                    key={index}
                                    className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-black active:text-pink-500 hover:underline"
                                    >
                                        {item.nombre}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Depósitos masivos */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Depósitos masivos.</h2>
                        <ul className="space-y-2">
                            {depositosMasivos.map((item, index) => (
                                <li
                                    key={index}
                                    className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-black active:text-pink-500 hover:underline"
                                    >
                                        {item.nombre}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    )
}