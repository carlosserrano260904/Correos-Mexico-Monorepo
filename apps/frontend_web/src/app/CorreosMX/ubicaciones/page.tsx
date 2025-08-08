'use client'

import React, { useState } from 'react'
import { NavbarCorreos } from '@/components/NavbarCorreos' 
import Foterr from '@/components/foterr' 
import Head from 'next/head'

export default function Ubicaciones() {
  const [showResults, setShowResults] = useState(false)
  const [buttonText, setButtonText] = useState('Buscar')
  const [isHovered, setIsHovered] = useState(false) 

  const handleSearch = () => {
    setShowResults(true)
    setButtonText('Limpiar')
  }

  const handleClear = () => {
    setShowResults(false)
    setButtonText('Buscar')
  }

  const styles = {
    container: {
      fontFamily: 'Poppins, sans-serif',
      backgroundColor: '#ffffff',
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      position: 'relative',
      overflow: 'hidden',
    },
    circulo1: {
      position: 'absolute',
      top: '10%',
      left: '5%',
      width: '300px',
      height: '300px',
      backgroundColor: '#F1A7C1',
      borderRadius: '50%',
      zIndex: -1,
      opacity: '0.1',
    },
    circulo2: {
      position: 'absolute',
      top: '30%',
      right: '5%',
      width: '250px',
      height: '250px',
      backgroundColor: '#F1A7C1',
      borderRadius: '50%',
      zIndex: -1,
      opacity: '0.1',
    },
    formulario: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '40%',
      alignSelf: 'flex-start',
    },
    titulo: {
      fontSize: '36px',
      color: '#333333',
      fontWeight: '600',
      marginBottom: '10px',
    },
    subtitulo: {
      fontSize: '18px',
      color: '#666666',
      marginBottom: '20px',
    },
    inputLabel: {
      fontSize: '16px',
      color: '#333333',
      display: 'block',
      marginBottom: '5px',
    },
    input: {
      padding: '12px',
      fontSize: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      width: '100%',
      marginBottom: '15px',
      backgroundColor: '#f9f9f9',
    },
    boton: {
      backgroundColor: '#EC05A3',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s',
    },
    botonHover: {
      backgroundColor: '#B7047E',
    },
    tabla: {
      width: '70%',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderCollapse: 'collapse',
      backgroundColor: '#FFFFFF',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid #ddd',
      textAlign: 'center',
      marginTop: '20px',
    },
    tablaThTd: {
      padding: '15px',
      fontSize: '14px',
      color: '#333333',
      border: '1px solid #ddd',
    },
    tablaTh: {
      backgroundColor: '#F1F1F1',
      fontWeight: 'bold',
      color: '#333333',
    },
    footer: {
      marginTop: '50px',
      textAlign: 'center',
      color: '#888888',
      fontSize: '14px',
      marginBottom: '10px',
      position: 'absolute',
      bottom: '20px',
      width: '100%',
    },
  }

  return (
    <>
      <Head>
        <title>Ubicación de Oficinas Postales - Correos de México</title>
      </Head>

      {/* Navbar */}
      <NavbarCorreos />

      <div style={styles.container}>
        {/* Círculos*/}
        <div style={styles.circulo1}></div>
        <div style={styles.circulo2}></div>

        {/* Formulario */}
        <div style={styles.formulario}>
          <h1 style={styles.titulo}>Ubicación de Oficinas Postales</h1>
          <div>
            <label style={styles.inputLabel}>Estado:</label>
            <input type="text" placeholder="Ej. Durango" style={styles.input} />
          </div>
          <div>
            <label style={styles.inputLabel}>Municipio:</label>
            <input type="text" placeholder="Ej. Gómez Palacio" style={styles.input} />
          </div>

          <button
            onClick={showResults ? handleClear : handleSearch}
            style={isHovered ? { ...styles.boton, ...styles.botonHover } : styles.boton}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {buttonText}
          </button>
        </div>

        {/* Tabla */}
        {showResults && (
          <table style={styles.tabla}>
            <thead>
              <tr>
                <th style={styles.tablaTh}>Oficina</th>
                <th style={styles.tablaTh}>Tipo</th>
                <th style={styles.tablaTh}>Ubicación</th>
                <th style={styles.tablaTh}>Colonia</th>
                <th style={styles.tablaTh}>Municipio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tablaThTd}>Ejemplo Oficina 1</td>
                <td style={styles.tablaThTd}>Servicios</td>
                <td style={styles.tablaThTd}>Av. Ejemplo</td>
                <td style={styles.tablaThTd}>Colonia A</td>
                <td style={styles.tablaThTd}>Durango</td>
              </tr>
              <tr>
                <td style={styles.tablaThTd}>Ejemplo Oficina 2</td>
                <td style={styles.tablaThTd}>Servicios</td>
                <td style={styles.tablaThTd}>Av. Ejemplo 2</td>
                <td style={styles.tablaThTd}>Colonia B</td>
                <td style={styles.tablaThTd}>Gómez Palacio</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Footer*/}
      <Foterr />
    </>
  )
}
