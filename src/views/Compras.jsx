import React, { useState, useEffect } from 'react';
import TablaCompras from '../components/compras/TablaCompras';
import { Container, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import ModalEliminacionCompra from '../components/compras/ModalEliminacionCompra';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalRegistroCompra from '../components/compras/ModalRegistroCompra';

const Compras = () => {
  // Estados para manejar los datos
  const [listaCompras, setListaCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCompra, setNuevaCompra] = useState({
    fecha_compra: new Date().toISOString().split('T')[0] // Fecha actual por defecto
  });
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [compraAEliminar, setCompraAEliminar] = useState(null);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5; // Número de elementos por página

  // Calcular elementos paginados
  const comprasPaginadas = comprasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtradas = listaCompras.filter(
      (compra) =>
        compra.fecha_compra.toLowerCase().includes(Date)
    );
    setComprasFiltradas(filtradas);
  };

  const eliminarCompra = async () => {
    if (!compraAEliminar) return;
    try {
      const respuesta = await
        fetch(`http://localhost:3000/api/eliminarcompra/${compraAEliminar.id_compra}`, {
          method: 'DELETE',
        });
      if (!respuesta.ok) {
        throw new Error('Error al eliminar la compra');
      }
      await obtenerCompras(); // Refresca la lista
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1); // Regresa a la primera página
      setCompraAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (compra) => {
    setCompraAEliminar(compra);
    setMostrarModalEliminacion(true);
  };

  // Función para obtener compras
  const obtenerCompras = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/compras');
      if (!respuesta.ok) throw new Error('Error al cargar las compras');
      const datos = await respuesta.json();
      setListaCompras(datos);
      setComprasFiltradas(datos);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setCargando(false);
    }
  };

  // Obtener compras al montar el componente
  useEffect(() => {
    obtenerCompras();
  }, []);

  // Manejar cambios en los inputs
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCompra(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Registrar nueva compra
  const registrarCompra = async () => {
    if (!nuevaCompra.fecha_compra) {
      setErrorCarga("La fecha de compra es obligatoria");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcompra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaCompra),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || 'Error al registrar la compra');
      }

      // Limpiar y actualizar
      await obtenerCompras();
      setNuevaCompra({
        fecha_compra: new Date().toISOString().split('T')[0]
      });
      setMostrarModal(false);
      setErrorCarga(null);

    } catch (error) {
      setErrorCarga(error.message);
      console.error('Error al registrar compra:', error);
    }
  };

  return (
    <Container className="mt-5">
      <h3>Gestión de Compras</h3>

      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nueva Compra
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
          <p>Cargando compras...</p>
        </div>
      ) : (
        <>
          <TablaCompras
            compras={comprasPaginadas}
            cargando={cargando}
            error={errorCarga}
            totalElementos={listaCompras.length} // Total de elementos
            elementosPorPagina={elementosPorPagina} // Elementos por página
            paginaActual={paginaActual} // Página actual
            establecerPaginaActual={establecerPaginaActual}
            abrirModalEliminacion={abrirModalEliminacion}
          />

          <ModalRegistroCompra
            mostrarModal={mostrarModal}
            setMostrarModal={setMostrarModal}
            nuevaCompra={nuevaCompra}
            manejarCambioInput={manejarCambioInput}
            registrarCompra={registrarCompra}
            errorCarga={errorCarga}
          />

          <ModalEliminacionCompra
            mostrarModalEliminacion={mostrarModalEliminacion}
            setMostrarModalEliminacion={setMostrarModalEliminacion}
            eliminarCompra={eliminarCompra}
          />

        </>
      )}
    </Container>
  );
};

export default Compras;