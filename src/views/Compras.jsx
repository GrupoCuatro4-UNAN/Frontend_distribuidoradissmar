import React, { useState, useEffect } from 'react';
import TablaCompras from '../components/compras/TablaCompras';
import { Container } from "react-bootstrap";

const Compras = () => {
  const [listaCompras, setListaCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/compras');
        if (!respuesta.ok) throw new Error('Error al cargar las compras');
        const datos = await respuesta.json();
        setListaCompras(datos);
        setCargando(false);
      } catch (error) {
        setErrorCarga(error.message);
        setCargando(false);
      }
    };
    obtenerCompras();
  }, []);

  return (
    <Container className="mt-5">
      <br />
      <h4>Compras</h4>
      <TablaCompras
        compras={listaCompras}
        cargando={cargando}
        error={errorCarga}
      />
    </Container>
  );
};

export default Compras;