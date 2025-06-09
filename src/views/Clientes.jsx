import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import TableClientes from '../components/clientes/TablaClientes';
import ModalRegistroCliente from '../components/clientes/ModalRegistroCliente';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalEliminacionCliente from '../components/clientes/ModalEliminacionCliente';
import ModalEdicionCliente from '../components/clientes/ModalEdicionCliente';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';



const Clientes = () => {
    const [listaClientes, setListaClientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorCarga, setErrorCarga] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: '',
        apellido: '',
        celular: '',
        direccion: '',
        cedula: ''
    });
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [paginaActual, establecerPaginaActual] = useState(1);
    const elementosPorPagina = 5; // Número de elementos por página
    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [clienteEliminar, setClienteEliminar] = useState(null);
    const [clienteEditado, setClienteEditado] = useState(null);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);






    const manejarCambioInputEdicion = (e) => {
        const { name, value } = e.target;
        setClienteEditado(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const manejarCambioBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);

        const filtrados = listaClientes.filter(
            (cliente) =>
                cliente.nombre.toLowerCase().includes(texto) ||
                cliente.apellido.toLowerCase().includes(texto) ||
                cliente.direccion.toLowerCase().includes(texto) ||
                cliente.cedula.toLowerCase().includes(texto)
        );
        setClientesFiltrados(filtrados);
    };

    const abrirModalEdicion = (cliente) => {
        setClienteEditado(cliente);
        setMostrarModalEdicion(true);
    };

    const actualizarCliente = async () => {
        if (!clienteEditado?.nombre || !clienteEditado?.apellido ||
            !clienteEditado?.celular || !clienteEditado?.direccion ||
            !clienteEditado?.cedula) {
            setErrorCarga("Por favor, completa todos los campos obligatorios antes de guardar.");
            return;
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/api/actualizarcliente/${clienteEditado.id_cliente}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: clienteEditado.nombre,
                    apellido: clienteEditado.apellido,
                    celular: clienteEditado.celular,
                    direccion: clienteEditado.direccion,
                    cedula: clienteEditado.cedula,
                }),
            });

            if (!respuesta.ok) {
                throw new Error('Error al actualizar el cliente');
            }

            await obtenerClientes();
            setMostrarModalEdicion(false);
            setClienteEditado(null);
            setErrorCarga(null);
        } catch (error) {
            setErrorCarga(error.message);
        }
    };

    const eliminarCliente = async () => {
        if (!clienteEliminar) return;

        try {
            const respuesta = await fetch(`http://localhost:3000/api/eliminarcliente/${clienteEliminar.id_cliente}`, {
                method: 'DELETE',
            });

            if (!respuesta.ok) {
                throw new Error('Error al eliminar el cliente');
            }

            await obtenerClientes();
            setMostrarModalEliminacion(false);
            establecerPaginaActual(1);
            setClienteEliminar(null);
            setErrorCarga(null);
        } catch (error) {
            setErrorCarga(error.message);
        }
    };

    const abrirModalEliminacion = (cliente) => {
        setClienteEliminar(cliente);
        setMostrarModalEliminacion(true);
    };

    // Función reutilizable para obtener clientes
    const obtenerClientes = async () => {
        try {

            setCargando(true);
            const respuesta = await fetch('http://localhost:3000/api/clientes');

            if (!respuesta.ok) {
                throw new Error('Error al cargar los clientes');
            }

            const datos = await respuesta.json();
            setListaClientes(datos);
            setClientesFiltrados(datos);
            setErrorCarga(null);
        } catch (error) {
            setErrorCarga(error.message);
        } finally {
            setCargando(false);
        }

    };

    // Cargar clientes al montar el componente
    useEffect(() => {
        obtenerClientes();


    }, []);

    // Manejar cambios en los inputs del modal
    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoCliente(prev => ({ ...prev, [name]: value }));
    };

    // Registrar nuevo cliente
    const agregarCliente = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/api/registrarclientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoCliente)
            });

            if (!respuesta.ok) {
                throw new Error('Error al registrar el cliente');
            }

            // Limpiar formulario y actualizar lista
            setNuevoCliente({
                nombre: '',
                apellido: '',
                celular: '',
                direccion: '',
                cedula: ''
            });
            setMostrarModal(false);
            await obtenerClientes(); // Refrescar la lista
        } catch (error) {
            setErrorCarga(error.message);
        }
    };

    // Calcular elementos paginados
    const clientesPaginados = clientesFiltrados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
    );

    return (
        <Container className="mt-4">
            <Row>
                <h1>.</h1>
                <h1>.</h1>
                
                <Col lg={2} md={4} sm={4} xs={5}>
                    <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
                        Nuevo Cliente.
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
                    <Spinner animation="border" variant="primary" />
                    <p>Cargando clientes...</p>
                </div>
            ) : (
                <TableClientes
                    clientes={clientesPaginados}
                    cargando={cargando}
                    error={errorCarga}
                    totalElementos={listaClientes.length} // Total de elementos
                    elementosPorPagina={elementosPorPagina} // Elementos por página
                    paginaActual={paginaActual} // Página actual
                    establecerPaginaActual={establecerPaginaActual}
                    abrirModalEliminacion={abrirModalEliminacion}
                    abrirModalEdicion={abrirModalEdicion}
                />
            )}

            <ModalRegistroCliente
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoCliente={nuevoCliente}
                manejarCambioInput={manejarCambioInput}
                agregarCliente={agregarCliente}
                errorCarga={errorCarga}
            />

            <ModalEliminacionCliente
                mostrarModalEliminacion={mostrarModalEliminacion}
                setMostrarModalEliminacion={setMostrarModalEliminacion}
                eliminarCliente={eliminarCliente}
            />

            <ModalEdicionCliente
                mostrarModalEdicion={mostrarModalEdicion}
                setMostrarModalEdicion={setMostrarModalEdicion}
                clienteEditado={clienteEditado}
                manejarCambioInputEdicion={manejarCambioInputEdicion}
                actualizarCliente={actualizarCliente}
                errorCarga={errorCarga}
            />

        </Container>
    );
};

export default Clientes;