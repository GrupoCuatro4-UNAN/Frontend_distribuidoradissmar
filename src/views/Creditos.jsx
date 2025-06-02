import React, { useState, useEffect } from 'react';
import TablaCreditos from '../components/creditos/TablaCreditos';
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalRegistroCredito from '../components/creditos/ModalRegistroCredito';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalEliminacionCredito from '../components/creditos/ModalEliminacionCredito';
import ModalEdicionCredito from '../components/creditos/ModalEdicionCredito';

const Creditos = () => {
  const [listaCreditos, setListaCreditos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCredito, setNuevoCredito] = useState({
    id_cliente: '',
    tipo_credito: '',
    plazo_pago: '',
    tasa_interes: '',
    fecha_vencimiento: '',
    monto_credito: '',
    limite_credito: ''
  });
  const [listaClientes, setListaClientes] = useState([]);
  const [creditosFiltrados, setCreditosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [creditoAEliminar, setCreditoAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [creditoEditado, setCreditoEditado] = useState(null);


  const abrirModalEdicion = (credito) => {
    setCreditoEditado(credito);
    setMostrarModalEdicion(true);
  };


  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setCreditoEditado((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const actualizarCredito = async () => {
    if (!creditoEditado) return;

    // Asegurarse que la fecha esté en formato YYYY-MM-DD
    const fechaFormateada = new Date(creditoEditado.fecha_vencimiento).toISOString().split("T")[0];

    const datosActualizados = {
      ...creditoEditado,
      fecha_vencimiento: fechaFormateada,
    };

    try {
      const respuesta = await fetch(`http://localhost:3000/api/creditos/${creditoEditado.id_credito}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosActualizados),
      });

      if (!respuesta.ok) throw new Error("Error al actualizar el crédito");

      await obtenerCreditos();
      setMostrarModalEdicion(false);
      setCreditoEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };



  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCredito(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    obtenerCreditos();
    obtenerClientes();
  }, []);

  const eliminarCredito = async () => {
    if (!creditoAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarcredito/${creditoAEliminar.id_credito}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el credito');
      }

      await obtenerCreditos(); // Refresca la lista
      setMostrarModalEliminacion(false);
      //establecerPaginaActual(1); // Regresa a la primera página
      setCreditoAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };


  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtrados = listaCreditos.filter(
      (credito) =>
        credito.id_cliente.toString().includes(texto) ||
        credito.monto_credito.toString().includes(texto) ||
        credito.plazo_pago.toString().includes(texto)
    );
    setCreditosFiltrados(filtrados);
  };


  const abrirModalEliminacion = (credito) => {
    setCreditoAEliminar(credito);
    setMostrarModalEliminacion(true);
  };

  const obtenerCreditos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/creditos');
      if (!respuesta.ok) throw new Error('Error al cargar los créditos');
      const datos = await respuesta.json();
      setCreditosFiltrados(datos);
      setListaCreditos(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  // Obtener categorías para el dropdown
  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) throw new Error('Error al cargar los clientes');
      const datos = await respuesta.json();
      setListaClientes(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const agregarCredito = async () => {

    console.log("Datos del crédito:", nuevoCredito);
    if (!nuevoCredito.id_cliente || !nuevoCredito.tipo_credito ||
      !nuevoCredito.plazo_pago || !nuevoCredito.tasa_interes ||
      !nuevoCredito.fecha_vencimiento || !nuevoCredito.monto_credito ||
      !nuevoCredito.limite_credito) {
      setErrorCarga("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      console.log("Datos a enviar:", nuevoCredito);
      const respuesta = await fetch('http://localhost:3000/api/registrarcredito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCredito),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el producto');

      await obtenerCreditos();
      setNuevoCredito({
        id_cliente: '',
        tipo_credito: '',
        plazo_pago: '',
        tasa_interes: '',
        fecha_vencimiento: '',
        monto_credito: '',
        limite_credito: ''
      });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };
  return (
    <Container className="mt-5">
      <br />
      <h4>Créditos</h4>

      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nuevo Credito
          </Button>
        </Col>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <TablaCreditos
        creditos={creditosFiltrados}
        cargando={cargando}
        error={errorCarga}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}  // Método para abrir modal de eliminación
      />

      <ModalRegistroCredito
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCredito={nuevoCredito}
        manejarCambioInput={manejarCambioInput}
        agregarCredito={agregarCredito}
        errorCarga={errorCarga}
        creditos={listaCreditos}
        clientes={listaClientes}
      />


      <ModalEliminacionCredito
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCredito={eliminarCredito}
      />

      <ModalEdicionCredito
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        creditoEditado={creditoEditado}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarCredito={actualizarCredito}
        errorCarga={errorCarga}
        clientes={listaClientes}
      />


    </Container>
  );
};

export default Creditos;