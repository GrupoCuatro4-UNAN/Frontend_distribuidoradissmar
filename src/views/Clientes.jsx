import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import TableClientes from '../components/clientes/TablaClientes';
import ModalRegistroCliente from '../components/clientes/ModalRegistroCliente';

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

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Clientes</h2>
                <Button variant="primary" onClick={() => setMostrarModal(true)}>
                    <i className="fas fa-plus me-2"></i>Nuevo Cliente
                </Button>
            </div>

            {errorCarga && <Alert variant="danger">{errorCarga}</Alert>}

            {cargando ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p>Cargando clientes...</p>
                </div>
            ) : (
                <TableClientes clientes={listaClientes} />
            )}

            <ModalRegistroCliente
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoCliente={nuevoCliente}
                manejarCambioInput={manejarCambioInput}
                agregarCliente={agregarCliente}
                errorCarga={errorCarga}
            />
        </Container>
    );
};

export default Clientes;