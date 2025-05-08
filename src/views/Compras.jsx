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
    fecha_compra: new Date(),
    total_compra: 0
  });
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [compraAEliminar, setCompraAEliminar] = useState(null);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5; // Número de elementos por página
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [productos, setProductos] = useState([]);

  const [detallesCompra, setDetallesCompra] = useState([]);


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

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
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
    obtenerProductos();
  }, []);

  // Manejar cambios en los inputs
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCompra(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarDetalle = (detalle) => {
    setDetallesCompra(prev => [...prev, detalle]);
    setNuevaCompra(prev => ({
      ...prev,
      total_compra: prev.total_compra + (detalle.cantidad * detalle.precio_unitario)
    }));
  };

  const agregarCompra = async () => {
    if (!nuevaCompra.fecha_compra || detallesCompra.length === 0) {
      setErrorCarga("Por favor, selecciona una fecha y agrega al menos un producto.");
      return;
    }

    try {
      const compraData = {
        fecha_compra: nuevaCompra.fecha_compra.toISOString(),
        total_compra: detallesCompra.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0),
        detalles: detallesCompra
      };

      const respuesta = await fetch('http://localhost:3000/api/registrarcompra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraData)
      });

      if (!respuesta.ok) throw new Error('Error al registrar la compra');

      await obtenerCompras();
      setNuevaCompra({ fecha_compra: new Date(), total_compra: 0 });
      setDetallesCompra([]);
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };


  /* Registrar nueva compra
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
  };*/

  return (
    <Container className="mt-5">
      <h3>Gestión de Compras con detalles</h3>

      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)} style={{ width: "100%" }}>
            Nueva Compra
          </Button>
        </Col>
      </Row>
      <br />

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
            mostrarModal={mostrarModalRegistro}
            setMostrarModal={setMostrarModalRegistro}
            nuevaCompra={nuevaCompra}  // Cambiado a nuevaCompra
            setNuevaCompra={setNuevaCompra}  // Cambiado a setNuevaCompra
            detallesCompra={detallesCompra}  // Cambiado a detallesCompra
            setDetallesCompra={setDetallesCompra}  // Cambiado a setDetallesCompra
            agregarDetalle={agregarDetalle}
            agregarCompra={agregarCompra}  // Cambiado a agregarCompra
            errorCarga={errorCarga}
            productos={productos}  // Solo productos son necesarios para el modal
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