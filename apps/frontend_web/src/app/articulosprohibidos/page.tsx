import React from "react";
import { NavbarCorreos } from "@/components/NavbarCorreos";
import Footer from "@/components/footer";
import mujerx from "./images/mujerx.png";


export default function ArticulosProhibidos(){
    return (
        <>
            <NavbarCorreos/>
                <div className="font-sans bg-white min-h-screen">
                    <header className="bg-pink-100 p-6 flex flex-col md:flex-col md:flex-row justify-center items-center gap md:gap-8">
                        
                        <div className="flex flex-col items-center md:items-start pr-48 aling-items">
                            <span className="text-3xl font-bold md:text-5xl text-type-70">Artículos</span>
                            <span className="text-3xl font-bold text-pink-600 md:text-5xl ">prohibidos.</span>
                        </div>
                        <div className="relative md:w-48">
                          <img

                              src={mujerx.src}
                              alt="Articulos Prohibidos"
                              className="w-36 md:w-48"
                          />
                        </div>
                    </header>

                    <main className="max-w-2xl mx-auto p-6 space-y-6">
                        <h2 className="text-xl font-bold text-pink-600 md:text-4xl">Artículos Prohibidos</h2>
                        <p className="text-gray-700">
                            De conformidad con lo establecido en el Artículo 15 de la Ley del Servicio Postal Mexicano, queda prohibida la circulación por correo de los siguientes envíos y correspondencia:
                        </p>
                      

                        <ul className="space-y-4">

                          {/* Articulo 1*/}
                          <li className="flex items-start gap-4 p-4 transition-colors">
                            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center">
                              {/*Imagen del articulo */}
                              <img 
                                src="https://cdn-icons-png.flaticon.com/512/475/475886.png"
                                alt="Materias peligrosas"
                                className="w-15 h-15 object-contain"
                              />
                            </div>
                            <div className="flex-grow">
                              {/* Informacion sobre el articulo */}
                              <p className="text-gray-800">
                                  Los que contengan materias corrosivas, inflamables, explosivas o cualquier otro que pueda causar daño.
                              </p>
                              <p className="text-sm mt-2">
                                Fraccion reformada DOF 19-09-2023

                              </p>
                                
                            </div>

                          </li>

                          {/* Articulo 2*/}
                          <li className="flex items-start gap-4 p-4 transition-colors">
                            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center">
                              {/*Imagen del articulo */}
                              <img 
                                src="https://cdn.pixabay.com/photo/2022/06/30/16/47/apple-7294069_960_720.png"
                                alt="Cosas podridas"
                                className="w-15 h-15 object-contain"
                              />
                            </div>
                            <div className="flex-grow">
                              {/* Informacion sobre el articulo */}
                              <p className="text-gray-800 aling-center pt-2">
                                  Los que contengan objetos de facil descomposicion o mal olor.
                              </p>

                            </div>

                          </li>
                          {/* Articulo 3*/}
                          <li className="flex items-start gap-4 p-4 transition-colors">
                            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center">
                              {/*Imagen del articulo */}
                              <img 
                                src="https://cdn.pixabay.com/photo/2017/09/24/11/29/gun-2781556_1280.png"
                                alt="Armas"
                                className="w-20 h-20 object-contain"
                              />
                            </div>
                            <div className="flex-grow">
                              {/* Informacion sobre el articulo */}
                              <p className="text-gray-800 aling-center pt-2">
                                  Los que presumiblemente puedan ser utilizados en la comision de un delito.
                              </p>

                            </div>

                          </li>
                          {/* Articulo 4*/}
                          <li className="flex items-start gap-4 p-4 transition-colors">
                            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center">
                              {/*Imagen del articulo */}
                              <img 
                                src="https://cdn.pixabay.com/photo/2012/04/10/23/24/mexico-26989_960_720.png"
                                alt="Cosas ofrensivas"
                                className="w-15 h-15 object-contain"
                              />
                            </div>
                            <div className="flex-grow">
                              {/* Informacion sobre el articulo */}
                              <p className="text-gray-800 aling-center pt-2">
                                  Los que sean ofensivos o denigrantes para la nacion.
                              </p>

                            </div>

                          </li>

                          {/* Articulo 5*/}
                          <li className="flex items-start gap-4 p-4 transition-colors">
                            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center">
                              {/*Imagen del articulo */}
                              <img 
                                src="https://cdn.pixabay.com/photo/2017/02/21/03/17/green-2084561_960_720.png"
                                alt="Dinero"
                                className="w-15 h-15 object-contain"
                              />
                            </div>
                            <div className="flex-grow">
                              {/* Informacion sobre el articulo */}
                              <p className="text-gray-800 aling-center pt-2">
                                  Los que contengan billetes o anuncios de loterias extranjeras y, que en general, de juegos prohibidos como texto princial.
                                  Si se trata de envios o correspondencia nacional se estara a lo dispuesto por el Articulo 29
                              </p>

                            </div>

                          </li>

                          {/* Articulo 6*/}
                          <li className="flex items-start gap-4 p-4 transition-colors">
                            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center">
                              {/*Imagen del articulo */}
                              <img 
                                src="https://i.pinimg.com/1200x/dc/66/75/dc6675eb657128fca3d4413d8ec98796.jpg"
                                alt="Animales vivos"
                                className="w-15 h-15 object-contain"
                              />
                            </div>
                            <div className="flex-grow">
                              {/* Informacion sobre el articulo */}
                              <p className="text-gray-800 aling-center pt-2">
                                  Los que contengan animales vivos.
                              </p>

                            </div>

                          </li>

                          {/* Articulo 7*/}
                          <li className="flex items-start gap-4 p-4 transition-colors">
                            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center">
                              {/*Imagen del articulo */}
                              <img 
                                src="https://i.pinimg.com/736x/e3/e5/aa/e3e5aa8e5d7c44280cac08474cbd79d1.jpg"
                                alt="Sustancias nocivas"
                                className="w-15 h-15 object-contain"
                              />
                            </div>
                            <div className="flex-grow">
                              {/* Informacion sobre el articulo */}
                              <p className="text-gray-800 aling-center pt-2">
                                  Los que contengan sustancias ilegales, psicotrópicos o estupefacientes.
                              </p>

                            </div>

                          </li>


                            
                        </ul>
                    </main>

                    <Footer/>
                </div>
            
        </>
    )
}