import React, { useState, useEffect } from 'react';
import TablaAbonos from '../components/abonos/TablaAbonos';
import { Container, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import ModalRegistroAbono from '../components/abonos/ModalRegistroAbono';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalEliminacionAbono from '../components/abonos/ModalEliminacionAbono';
import ModalEdicionAbono from '../components/abonos/ModalEdicionAbono';
import jsPDF from 'jspdf'; // Corrected import
import 'jspdf-autotable'; // Added import for autoTable
import * as XLSX from 'xlsx';

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
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [abonoAEliminar, setAbonoAEliminar] = useState(null);
  const [mostrarModalEdicionAbono, setMostrarModalEdicionAbono] = useState(false);
  const [abonoEditado, setAbonoEditado] = useState(null);
  const [errorCargaAbono, setErrorCargaAbono] = useState(null);

  // Calcular elementos paginados
  const abonosPaginadas = abonosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // Función para exportar a PDF
  const exportarPDF = () => {
    console.log('Iniciando exportación a PDF');
    if (abonosFiltrados.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }
    const doc = new jsPDF();
    console.log('Documento PDF creado');
    doc.setFontSize(18);
    doc.text('Lista de Abonos', 14, 22);
    console.log('Título agregado');
    doc.setFontSize(11);
    doc.setTextColor(100);

    const headers = [['ID Abono', 'ID Cliente', 'Monto', 'Fecha Abono']];
    const data = abonosFiltrados.map(abono => [
      abono.id_abono || 'N/A',
      abono.id_cliente || 'N/A',
      abono.monto || '0',
      abono.fecha_abono ? new Date(abono.fecha_abono).toLocaleDateString() : 'N/A'
    ]);
    console.log('Datos preparados para la tabla');

    doc.autoTable({
      head: headers,
      body: data,
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 }
    });
    console.log('Tabla agregada al documento');

    doc.save('abonos.pdf');
    console.log('Documento guardado');
  };

  // Función para exportar a Excel
  const exportarExcel = () => {
    console.log('Iniciando exportación a Excel');
    if (abonosFiltrados.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }
    const datosExportar = abonosFiltrados.map(abono => ({
      'ID Abono': abono.id_abono || 'N/A',
      'ID Cliente': abono.id_cliente || 'N/A',
      'Monto': abono.monto || '0',
      'Fecha Abono': abono.fecha_abono ? new Date(abono.fecha_abono).toLocaleDateString() : 'N/A'
    }));
    console.log('Datos preparados para Excel');

    const worksheet = XLSX.utils.json_to_sheet(datosExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Abonos');
    console.log('Hoja de cálculo creada');

    XLSX.writeFile(workbook, 'abonos.xlsx');
    console.log('Archivo Excel guardado');
  };

  // Resto de las funciones permanecen sin cambios
  const manejarCambioInputEdicionAbono = (e) => {
    const { name, value } = e.target;
    setAbonoEditado(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const actualizarAbono = async () => {
    if (!abonoEditado?.id_cliente || !abonoEditado?.monto || !abonoEditado?.fecha_abono) {
      setErrorCargaAbono("Por favor, completa todos los campos obligatorios antes de guardar.");
      return;
    }

    let fechaFormateada = abonoEditado.fecha_abono;
    if (abonoEditado.fecha_abono.includes('T')) {
      fechaFormateada = new Date(abonoEditado.fecha_abono).toISOString().split('T')[0];
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/abonos/${abonoEditado.id_abono}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_cliente: abonoEditado.id_cliente,
          monto: abonoEditado.monto,
          fecha_abono: fechaFormateada,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar el abono');
      }

      await obtenerAbonos();
      setMostrarModalEdicionAbono(false);
      setAbonoEditado(null);
      setErrorCargaAbono(null);
    } catch (error) {
      console.error("Error al actualizar abono:", error);
      setErrorCargaAbono(error.message || "Error inesperado");
    }
  };

  const abrirModalEdicionAbono = (abono) => {
    const fechaFormateada = new Date(abono.fecha_abono).toISOString().split('T')[0];
    setAbonoEditado({
      ...abono,
      fecha_abono: fechaFormateada,
    });
    setMostrarModalEdicionAbono(true);
    setErrorCargaAbono(null);
  };

  const eliminarAbono = async () => {
    if (!abonoAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarabono/${abonoAEliminar.id_abono}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el abono');
      }

      await obtenerAbonos();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setAbonoAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (abono) => {
    setAbonoAEliminar(abono);
    setMostrarModalEliminacion(true);
  };

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
      (abono) =>
        abono.monto.toString().includes(texto) ||
        abono.id_cliente.toString().includes(texto)
    );
    setAbonosFiltrados(filtrados);
  };

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

  useEffect(() => {
    const cargarDatos = async () => {
      await Promise.all([obtenerAbonos(), obtenerClientes()]);
    };
    cargarDatos();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoAbono(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarAbono = async () => {
    if (!nuevoAbono.id_cliente || !nuevoAbono.monto) {
      setErrorCarga("Por favor, completa todos los campos obligatorios (Cliente y Monto)");
      return;
    }

    try {
      const montoNumber = Number(nuevoAbono.monto);
      if (isNaN(montoNumber)) {
        throw new Error('El monto debe ser un número válido');
      }

      const datosAbono = {
        id_cliente: nuevoAbono.id_cliente,
        monto: montoNumber,
        fecha_abono: nuevoAbono.fecha_abono
      };

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

      <Row className="mb-3">
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nueva Abono
          </Button>
        </Col>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button variant="success" onClick={exportarExcel} style={{ width: "100%" }}>
            Exportar a Excel
          </Button>
        </Col>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="danger" onClick={exportarPDF} style={{ width: "100%" }}>
            Exportar a PDF
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
            totalElementos={listaAbonos.length}
            elementosPorPagina={elementosPorPagina}
            paginaActual={paginaActual}
            establecerPaginaActual={establecerPaginaActual}
            abrirModalEliminacion={abrirModalEliminacion}
            abrirModalEdicionAbono={abrirModalEdicionAbono}
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

          <ModalEliminacionAbono
            mostrarModalEliminacion={mostrarModalEliminacion}
            setMostrarModalEliminacion={setMostrarModalEliminacion}
            eliminarAbono={eliminarAbono}
          />

          <ModalEdicionAbono
            mostrarModalEdicion={mostrarModalEdicionAbono}
            setMostrarModalEdicion={setMostrarModalEdicionAbono}
            abonoEditado={abonoEditado}
            manejarCambioInputEdicion={manejarCambioInputEdicionAbono}
            actualizarAbono={actualizarAbono}
            errorCarga={errorCargaAbono}
          />
        </>
      )}
    </Container>
  );
};

export default Abonos;