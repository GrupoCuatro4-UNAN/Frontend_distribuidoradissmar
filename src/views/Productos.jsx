import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/productos/TablaProductos';
import { Container } from "react-bootstrap";

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/productos');
        if (!respuesta.ok) throw new Error('Error al cargar los productos');
        const datos = await respuesta.json();
        setListaProductos(datos);
        setCargando(false);
      } catch (error) {
        setErrorCarga(error.message);
        setCargando(false);
      }
    };
    obtenerProductos();
  }, []);

  return (
    <Container className="mt-5">
      <br />
      <h4>Productos</h4>
      <TablaProductos
        productos={listaProductos}
        cargando={cargando}
        error={errorCarga}
      />
    </Container>
  );
};

export default Productos;