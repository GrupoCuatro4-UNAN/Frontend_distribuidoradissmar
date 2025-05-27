import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/TablaVentas';
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalDetallesVenta from '../components/detalles_ventas/ModalDetallesVenta';
import ModalEliminacionVenta from '../components/ventas/ModalEliminacionVenta';
import ModalRegistroVenta from '../components/ventas/ModalRegistroVenta';
import ModalActualizacionVenta from '../components/ventas/ModalActualizacionVenta';

const Ventas = () => {
  const [listaVentas, setListaVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState(null);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({
    id_cliente: '',
    fecha_venta: new Date(),
    total_venta: 0
  });
  const [detallesNuevos, setDetallesNuevos] = useState([]);
  const [mostrarModalActualizacion, setMostrarModalActualizacion] = useState(false);
  const [ventaActualizada, setVentaAEditar] = useState(null);
  const [detallesEditados, setDetallesEditados] = useState([]);


  useEffect(() => {
    obtenerVentas();
    obtenerClientes();;
    obtenerProductos();
  }, []);

  const actualizarVenta = async (ventaActualizada, detalles) => {
    if (!ventaActualizada.id_cliente || !ventaActualizada.fecha_venta || detalles.length === 0) {
      setErrorCarga("Por favor, completa todos los campos y agrega al menos un detalle.");
      return;
    }

    try {
      const ventaData = {
        id_venta: ventaActualizada.id_venta,
        id_cliente: ventaActualizada.id_cliente,
        fecha_venta: ventaActualizada.fecha_venta.toISOString(), // formato compatible para backend
        detalles: detalles.map(d => ({
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_detalle: d.precio_unitario // <- se envía como precio_detalle para coincidir con la tabla
        }))
      };

      console.log(`Enviando ID venta: ${ventaActualizada.id_venta}`, JSON.stringify(ventaData));

      const respuesta = await fetch(`http://localhost:3000/api/actualizarventa/${ventaActualizada.id_venta}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
      });

      if (!respuesta.ok) throw new Error('Error al actualizar la venta');

      await obtenerVentas();
      setMostrarModalActualizacion(false);
      setVentaAEditar(null);
      setDetallesEditados([]);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };


  const abrirModalActualizacion = async (venta) => {
    setVentaAEditar({
      id_venta: venta.id_venta,
      id_cliente: venta.id_cliente || '',
      fecha_venta: venta.fecha_venta
        ? new Date(venta.fecha_venta.split('/').reverse().join('-'))
        : new Date(),
    });

    setCargandoDetalles(true);
    try {
      const respuesta = await fetch(`http://localhost:3000/api/detalles_ventas/${venta.id_venta}`);
      if (!respuesta.ok) throw new Error('Error al cargar los detalles de la venta');
      const datos = await respuesta.json();
      setDetallesEditados(datos);
      setCargandoDetalles(false);
      setMostrarModalActualizacion(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };


  const agregarDetalle = (detalle) => {
    setDetallesNuevos(prev => [...prev, detalle]);
    setNuevaVenta(prev => ({
      ...prev,
      total_venta: prev.total_venta + (detalle.cantidad * detalle.precio_unitario)
    }));
  };

  const agregarVenta = async () => {
    console.log("Datos de la venta:", nuevaVenta);
    if (!nuevaVenta.id_cliente || !nuevaVenta.fecha_venta || detallesNuevos.length === 0) {
      setErrorCarga("Por favor, completa todos los campos y agrega al menos un detalle.");
      return;
    }

    try {
      const ventaData = {
        id_cliente: nuevaVenta.id_cliente,
        fecha_venta: nuevaVenta.fecha_venta.toISOString(),
        total_venta: detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0),
        detalles: detallesNuevos
      };

      const respuesta = await fetch('http://localhost:3000/api/registrarventa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
      });

      if (!respuesta.ok) throw new Error('Error al registrar la venta');

      await obtenerVentas();
      setNuevaVenta({ id_cliente: '', fecha_venta: new Date(), total_venta: 0 });
      setDetallesNuevos([]);
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
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

  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) throw new Error('Error al cargar los clientes');
      const datos = await respuesta.json();
      setClientes(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarVenta = async () => {
    if (!ventaAEliminar) return;
    try {
      const respuesta = await fetch(`http://localhost:3000/api/ventas/${ventaAEliminar.id_venta}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) {
        throw new Error('Error al eliminar la venta');
      }


      await obtenerVentas();
      setVentaAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (venta) => {
    setVentaAEliminar(venta);
    setMostrarModalEliminacion(true);
  };


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

  const obtenerDetalles = async (id_venta) => {
    setCargandoDetalles(true);
    setErrorDetalles(null);
    try {
      const respuesta = await fetch(`http://localhost:3000/api/detalles_ventas/${id_venta}`);
      if (!respuesta.ok) {
        throw new Error('Error al cargar los detalles de la venta');
      }
      const datos = await respuesta.json();
      setDetallesVenta(datos);
      setCargandoDetalles(false);
      setMostrarModal(true); // Mostrar modal
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };

  return (
    <Container className="mt-5">
      <br />
      <h4>Gestion de Ventas con detalles </h4>
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)} style={{ width: "100%" }}>
            Nueva Venta
          </Button>
        </Col>
      </Row>
      <br />
      <TablaVentas
        ventas={listaVentas}
        cargando={cargando}
        error={errorCarga}
        obtenerDetalles={obtenerDetalles}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalActualizacion={abrirModalActualizacion}
      />

      <ModalDetallesVenta
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        detalles={detallesVenta}
        cargandoDetalles={cargandoDetalles}
        errorDetalles={errorDetalles}
      />

      <ModalEliminacionVenta
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarVenta={eliminarVenta}
      />

      <ModalRegistroVenta
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaVenta={nuevaVenta}
        setNuevaVenta={setNuevaVenta}
        detallesVenta={detallesNuevos}
        setDetallesVenta={setDetallesNuevos}
        agregarDetalle={agregarDetalle}
        agregarVenta={agregarVenta}
        errorCarga={errorCarga}
        clientes={clientes}
        productos={productos}
      />

      <ModalActualizacionVenta
        mostrarModal={mostrarModalActualizacion}
        setMostrarModal={setMostrarModalActualizacion}
        venta={ventaActualizada}
        detallesVenta={detallesEditados}
        setDetallesVenta={setDetallesEditados}
        actualizarVenta={actualizarVenta}
        errorCarga={errorCarga}
        clientes={clientes}
        productos={productos}
      />

    </Container>
  );
};

export default Ventas;