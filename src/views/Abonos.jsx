// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaAbonos from '../components/abonos/TablaAbonos'; // Importa el componente de tabla
import { Container } from "react-bootstrap";

// Declaración del componente Abonos
const Abonos = () => {
  // Estados para manejar los datos, carga y errores
  const [listaAbonos, setListaAbonos] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);     // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null); // Maneja errores de la petición

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerAbonos = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/abonos');
        if (!respuesta.ok) {
          throw new Error('Error al cargar los abonos');
        }
        const datos = await respuesta.json();
        setListaAbonos(datos);    // Actualiza el estado con los datos
        setCargando(false);       // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);       // Termina la carga aunque haya error
      }
    };
    obtenerAbonos();            // Ejecuta la función al montar el componente
  }, []);                       // Array vacío para que solo se ejecute una vez

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h3>Abonos</h3>

        {/* Pasa los estados como props al componente TablaAbonos */}
        <TablaAbonos
          abonos={listaAbonos}
          cargando={cargando}
          error={errorCarga}
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Abonos;