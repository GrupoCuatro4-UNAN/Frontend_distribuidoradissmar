import React, { useState, useEffect } from 'react';
import TablaAbonos from '../components/abonos/TablaAbonos';
import { Container, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import ModalRegistroAbono from '../components/abonos/ModalRegistroAbono';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';


const Abonos = () => {
  // Estados para manejar los datos
  const [listaAbonos, setListaAbonos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoClientes, setCargandoClientes] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoAbono, setNuevoAbono] = useState({
    id_cliente: '',
    monto: '',
    fecha_abono: new Date().toISOString().split('T')[0]
  });
  const [clientes, setClientes] = useState([]);
  const [abonosFiltrados, setAbonosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5; // Número de elementos por página

  // Calcular elementos paginados
  const abonosPaginadas = abonosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // Función para obtener abonos
  const obtenerAbonos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/abonos');
      if (!respuesta.ok) throw new Error('Error al cargar los abonos');
      const datos = await respuesta.json();
      setListaAbonos(datos);
      setAbonosFiltrados(datos);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setCargando(false);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtrados = listaAbonos.filter(
      (abono, cliente) =>
        abono.monto.toLowerCase().includes(text) ||
        cliente.nombre.toLowerCase().includes(text)
    );
    setAbonosFiltrados(filtrados);
  };

  // Función para obtener clientes
  const obtenerClientes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/clientes');
      if (!response.ok) throw new Error('Error al cargar clientes');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      setErrorCarga("Error al cargar la lista de clientes");
    } finally {
      setCargandoClientes(false);
    }
  };

  // Obtener datos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      await Promise.all([obtenerAbonos(), obtenerClientes()]);
    };
    cargarDatos();
  }, []);

  // Manejar cambios en los inputs
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;

    setNuevoAbono(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Agregar nuevo abono - VERSIÓN CORREGIDA SIN ERRORES
  const agregarAbono = async () => {
    if (!nuevoAbono.id_cliente || !nuevoAbono.monto) {
      setErrorCarga("Por favor, completa todos los campos obligatorios (Cliente y Monto)");
      return;
    }

    try {
      // Convertimos a número el monto
      const montoNumber = Number(nuevoAbono.monto);
      if (isNaN(montoNumber)) {
        throw new Error('El monto debe ser un número válido');
      }

      // Preparamos los datos para enviar
      const datosAbono = {
        id_cliente: nuevoAbono.id_cliente,
        monto: montoNumber,
        fecha_abono: nuevoAbono.fecha_abono
      };

      // Hacemos la petición POST
      const response = await fetch('http://localhost:3000/api/registrarabono', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosAbono)
      });

      if (!response.ok) {
        const errorData = await response.json();
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
      console.error('Error en agregarAbono:', error);
      setErrorCarga(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h3>Gestión de Abonos</h3>

      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nueva Abono
          </Button>
        </Col>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      {errorCarga && <Alert variant="danger">{errorCarga}</Alert>}

      {cargando ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Cargando abonos...</p>
        </div>
      ) : (
        <>
          <TablaAbonos
            abonos={abonosPaginadas}
            cargando={cargando}
            error={errorCarga}
            totalElementos={listaAbonos.length} // Total de elementos
            elementosPorPagina={elementosPorPagina} // Elementos por página
            paginaActual={paginaActual} // Página actual
            establecerPaginaActual={establecerPaginaActual}
          />

          <ModalRegistroAbono
            mostrarModal={mostrarModal}
            setMostrarModal={setMostrarModal}
            nuevoAbono={nuevoAbono}
            manejarCambioInput={manejarCambioInput}
            agregarAbono={agregarAbono}
            errorCarga={errorCarga}
            clientes={clientes}
            cargandoClientes={cargandoClientes}
          />
        </>
      )}
    </Container>
  );
};

export default Abonos;