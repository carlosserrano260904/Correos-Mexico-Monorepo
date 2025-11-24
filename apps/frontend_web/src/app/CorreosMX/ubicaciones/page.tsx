'use client';

import React, { useState } from 'react';
import { NavbarCorreos } from '@/components/NavbarCorreos';
import Foterr from '@/components/foterr';
import Head from 'next/head';

export default function Ubicaciones() {
  const [showResults, setShowResults] = useState(false);
  const [buttonText, setButtonText] = useState('Buscar');
  const [isHovered, setIsHovered] = useState(false);
  const [estado, setEstado] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showPostalWarning, setShowPostalWarning] = useState(false);

  //  estado para manejar los detalles
  const [showDetails, setShowDetails] = useState({});

  const handleSearch = () => {
    if (!estado || !municipio) {
      setShowWarning(true);
      return;
    }

    const postalCodePattern = /^[0-9]{5}$/;
    if (codigoPostal && !postalCodePattern.test(codigoPostal)) {
      setShowPostalWarning(true);
      return;
    }

    setShowResults(true);
    setButtonText('Limpiar');
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
    }, 1500);
    console.log('Buscando oficinas...');
  };

  const handleClear = () => {
    setShowResults(false);
    setButtonText('Buscar');
    setEstado('');
    setMunicipio('');
    setCodigoPostal('');
    setShowWarning(false);
    setShowPostalWarning(false);
    setShowLoading(false);
    console.log('Limpiando los resultados...');
  };

  const toggleDetails = (index) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

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
      flexDirection: 'row',
      gap: '40px',
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
      gap: '15px',
      width: '30%',
      alignSelf: 'flex-start',
    },
    titulo: {
      fontSize: '36px',
      color: '#333333',
      fontWeight: '600',
      marginBottom: '10px',
    },
    inputLabel: {
      fontSize: '14px',
      color: '#333333',
      display: 'block',
      marginBottom: '5px',
    },
    input: {
      padding: '10px',
      fontSize: '14px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      width: '100%',
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
      alignSelf: 'center',
    },
    botonHover: {
      backgroundColor: '#B7047E',
    },
    tabla: {
      width: '60%',
      marginTop: '145px',
      borderCollapse: 'collapse',
      backgroundColor: '#FFFFFF',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid #ddd',
      textAlign: 'center',
    },
    tablaThTd: {
      padding: '12px',
      fontSize: '12px',
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
    warningAlert: {
      backgroundColor: '#FFCDD2',
      color: '#B71C1C',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #B71C1C',
      marginBottom: '15px',
      fontSize: '14px',
      textAlign: 'center',
      display: showWarning ? 'block' : 'none',
    },
    loadingMessage: {
      backgroundColor: '#E8F5E9',
      color: '#388E3C',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #388E3C',
      marginBottom: '15px',
      fontSize: '14px',
      textAlign: 'center',
      display: showLoading ? 'block' : 'none',
    },
    postalWarningAlert: {
      backgroundColor: '#FFEBEE',
      color: '#D32F2F',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #D32F2F',
      marginBottom: '15px',
      fontSize: '14px',
      textAlign: 'center',
      display: showPostalWarning ? 'block' : 'none',
    },
  };

  return (
    <>
      <Head>
        <title>Ubicación de Oficinas Postales - Correos de México</title>
      </Head>

      <NavbarCorreos />

      <div style={styles.container}>
        <div style={styles.circulo1}></div>
        <div style={styles.circulo2}></div>

        <div style={styles.formulario}>
          <h1 style={styles.titulo}>Ubicación de Oficinas Postales</h1>
          {showWarning && <div style={styles.warningAlert}>Por favor, complete ambos campos: Estado y Municipio.</div>}
          {showPostalWarning && <div style={styles.postalWarningAlert}>El código postal debe tener exactamente 5 dígitos numéricos.</div>}
          {showLoading && <div style={styles.loadingMessage}>Mostrando resultados...</div>}
          <div>
            <label style={styles.inputLabel}>Estado:</label>
            <input
              type="text"
              placeholder="Ej. Durango"
              style={styles.input}
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />
          </div>
          <div>
            <label style={styles.inputLabel}>Municipio:</label>
            <input
              type="text"
              placeholder="Ej. Gómez Palacio"
              style={styles.input}
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
            />
          </div>
          <div>
            <label style={styles.inputLabel}>Código Postal:</label>
            <input
              type="text"
              placeholder="Ej. 34000"
              style={styles.input}
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
            />
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

        {showResults && (
          <table style={styles.tabla}>
            <thead>
              <tr>
                <th style={styles.tablaTh}>Oficina</th>
                <th style={styles.tablaTh}>Tipo</th>
                <th style={styles.tablaTh}>Ubicación</th>
                <th style={styles.tablaTh}>Colonia</th>
                <th style={styles.tablaTh}>Municipio</th>
                <th style={styles.tablaTh}>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(2)].map((_, index) => (
                <tr key={index}>
                  <td style={styles.tablaThTd}>Ejemplo Oficina {index + 1}</td>
                  <td style={styles.tablaThTd}>Servicios</td>
                  <td style={styles.tablaThTd}>Av. Ejemplo {index + 1}</td>
                  <td style={styles.tablaThTd}>Colonia {index === 0 ? 'A' : 'B'}</td>
                  <td style={styles.tablaThTd}>{index === 0 ? 'Durango' : 'Gómez Palacio'}</td>
                  <td style={styles.tablaThTd}>
                    <button
                      onClick={() => toggleDetails(index)}
                      style={{ backgroundColor: '#EC05A3', color: 'white', padding: '5px 10px', borderRadius: '5px' }}
                    >
                      {showDetails[index] ? 'Ocultar detalles' : 'Ver detalles'}
                    </button>
                    {showDetails[index] && (
                      <div>
                        <p>Ubicación: Av. Ejemplo {index + 1}</p>
                        <p>Dirección: Calle Ejemplo {index + 1}</p>
                        <p>Teléfonos: 123-4567</p>
                        <p>Horarios: L-V 9:00-18:00</p>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Foterr />
    </>
  );
}
