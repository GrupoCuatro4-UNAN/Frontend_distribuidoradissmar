import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/TablaVentas';
import { Container } from "react-bootstrap";

const Ventas = () => {
  const [listaVentas, setListaVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/ventas');
        if (!respuesta.ok) throw new Error('Error al cargar las ventas');
        const datos = await respuesta.json();
        setListaVentas(datos);
        setCargando(false);
      } catch (error) {
        setErrorCarga(error.message);
        setCargando(false);
      }
    };
    obtenerVentas();
  }, []);

  return (
    <Container className="mt-5">
      <br />
      <h4>Ventas</h4>
      <TablaVentas
        ventas={listaVentas}
        cargando={cargando}
        error={errorCarga}
      />
    </Container>
  );
};

export default Ventas;