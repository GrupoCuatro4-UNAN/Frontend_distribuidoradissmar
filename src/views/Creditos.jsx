import React, { useState, useEffect } from 'react';
import TablaCreditos from '../components/creditos/TablaCreditos';
import { Container } from "react-bootstrap";

const Creditos = () => {
  const [listaCreditos, setListaCreditos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  useEffect(() => {
    const obtenerCreditos = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/creditos');
        if (!respuesta.ok) throw new Error('Error al cargar los créditos');
        const datos = await respuesta.json();
        setListaCreditos(datos);
        setCargando(false);
      } catch (error) {
        setErrorCarga(error.message);
        setCargando(false);
      }
    };
    obtenerCreditos();
  }, []);

  return (
    <Container className="mt-5">
      <br />
      <h4>Créditos</h4>
      <TablaCreditos
        creditos={listaCreditos}
        cargando={cargando}
        error={errorCarga}
      />
    </Container>
  );
};

export default Creditos;