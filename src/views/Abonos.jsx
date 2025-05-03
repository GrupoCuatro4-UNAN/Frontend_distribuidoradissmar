// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaAbonos from '../components/abonos/TablaAbonos';
import { Container, Button } from "react-bootstrap";
import ModalRegistroAbono from '../components/abonos/ModalRegistroAbono';

// Declaración del componente Abonos
const Abonos = () => {
  // Estados para manejar los datos
  const [listaAbonos, setListaAbonos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoAbono, setNuevoAbono] = useState({
    id_cliente: '',
    monto: '',
    fecha_abono: new Date().toISOString().split('T')[0] // Fecha actual por defecto
  });

  // Función para obtener abonos
  const obtenerAbonos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/abonos');
      if (!respuesta.ok) throw new Error('Error al cargar los abonos');
      const datos = await respuesta.json();
      setListaAbonos(datos);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setCargando(false);
    }
  };

  // Obtener abonos al montar el componente
  useEffect(() => {
    obtenerAbonos();
  }, []);

  // Manejar cambios en los inputs
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    
    setNuevoAbono(prev => ({
      ...prev,
      [name]: name === 'id_cliente' || name === 'monto' 
             ? Number(value) 
             : value
    }));
  };

  // Agregar nuevo abono
  const agregarAbono = async () => {
    if (!nuevoAbono.id_cliente || !nuevoAbono.monto) {
      setErrorCarga("Por favor, completa todos los campos obligatorios (ID Cliente y Monto)");
      return;
    }

    try {
      if (parseFloat(nuevoAbono.monto) <= 0) {
        throw new Error('El monto debe ser mayor a cero');
      }

      const respuesta = await fetch('http://localhost:3000/api/registrarabono', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_cliente: parseInt(nuevoAbono.id_cliente),
          monto: parseFloat(nuevoAbono.monto),
          fecha_abono: nuevoAbono.fecha_abono
        }),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || 'Error al registrar el abono');
      }

      // Limpiar y actualizar
      await obtenerAbonos();
      setNuevoAbono({ 
        id_cliente: '', 
        monto: '', 
        fecha_abono: new Date().toISOString().split('T')[0] 
      });
      setMostrarModal(false);
      setErrorCarga(null);
      
    } catch (error) {
      setErrorCarga(error.message);
      console.error('Error al agregar abono:', error);
    }
  };

  // Renderizado
  return (
    <Container className="mt-5">
      <h3>Abonos</h3>
      <Button variant="primary" onClick={() => setMostrarModal(true)}>
        Nuevo Abono
      </Button>
      <br/><br/>

      <TablaAbonos
        abonos={listaAbonos}
        cargando={cargando}
        error={errorCarga}
      />

      <ModalRegistroAbono
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoAbono={nuevoAbono}
        manejarCambioInput={manejarCambioInput}
        agregarAbono={agregarAbono}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Abonos;