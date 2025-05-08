// ModalActualizacionVenta.jsx (modificado para coincidir con tus tablas)
import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ModalActualizacionVenta = ({
    mostrarModal,
    setMostrarModal,
    venta,
    detallesVenta,
    setDetallesVenta,
    actualizarVenta,
    errorCarga,
    clientes,
    productos
    
}) => {
    const [ventaActualizada, setVentaActualizada] = useState({
        id_venta: venta?.id_venta || '',
        id_cliente: venta?.id_cliente || '',
        fecha_venta: venta?.fecha_venta ? new Date(venta.fecha_venta) : new Date(),
    });

    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [nuevoDetalle, setNuevoDetalle] = useState({ id_producto: '', cantidad: '', precio_detalle: '' });
    const [editandoDetalle, setEditandoDetalle] = useState(null);

    useEffect(() => {
        if (venta && clientes.length > 0) {
            const cliente = clientes.find(c => c.id_cliente === parseInt(venta.id_cliente));
            if (cliente) {
                setClienteSeleccionado({ value: cliente.id_cliente, label: `${cliente.primer_nombre} ${cliente.primer_apellido}` });
                setVentaActualizada(prev => ({ ...prev, id_cliente: cliente.id_cliente }));
            }
            let fechaParsed = new Date(venta.fecha_venta);
            if (isNaN(fechaParsed) && typeof venta.fecha_venta === 'string') {
                const [day, month, year] = venta.fecha_venta.split('/');
                fechaParsed = new Date(`${year}-${month}-${day}`);
            }
            setVentaActualizada(prev => ({
                ...prev,
                id_venta: venta.id_venta || '',
                fecha_venta: isNaN(fechaParsed) ? new Date() : fechaParsed,
            }));
        }
    }, [venta, clientes]);

    const cargarClientes = (inputValue, callback) => {
        const filtrados = clientes.filter(cliente =>
            `${cliente.primer_nombre} ${cliente.primer_apellido}`.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filtrados.map(cliente => ({
            value: cliente.id_cliente,
            label: `${cliente.primer_nombre} ${cliente.primer_apellido}`
        })));
    };

    const cargarProductos = (inputValue, callback) => {
        const filtrados = productos.filter(producto =>
            producto.nombre_producto.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filtrados.map(producto => ({
            value: producto.id_producto,
            label: producto.nombre_producto,
            precio: producto.precio_unitario
        })));
    };

    const manejarCambioCliente = (seleccionado) => {
        setClienteSeleccionado(seleccionado);
        setVentaActualizada(prev => ({ ...prev, id_cliente: seleccionado ? seleccionado.value : '' }));
    };

    const manejarCambioProducto = (seleccionado) => {
        setProductoSeleccionado(seleccionado);
        setNuevoDetalle(prev => ({
            ...prev,
            id_producto: seleccionado ? seleccionado.value : '',
            precio_detalle: seleccionado ? seleccionado.precio : ''
        }));
    };

    const manejarCambioDetalle = (e) => {
        const { name, value } = e.target;
        setNuevoDetalle(prev => ({ ...prev, [name]: value }));
    };

    const manejarAgregarDetalle = () => {
        if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0) {
            alert("Por favor, selecciona un producto y una cantidad válida.");
            return;
        }
        const producto = productos.find(p => p.id_producto === nuevoDetalle.id_producto);
        if (producto && nuevoDetalle.cantidad > producto.stock) {
            alert(`Stock insuficiente de ${producto.nombre_producto}. Unidades disponibles: ${producto.stock}`);
            return;
        }
        setDetallesVenta(prev => [...prev, {
            id_producto: nuevoDetalle.id_producto,
            nombre_producto: productoSeleccionado.label,
            cantidad: parseInt(nuevoDetalle.cantidad),
            precio_detalle: parseFloat(nuevoDetalle.precio_detalle)
        }]);
        setNuevoDetalle({ id_producto: '', cantidad: '', precio_detalle: '' });
        setProductoSeleccionado(null);
    };

    const eliminarDetalle = (index) => {
        setDetallesVenta(prev => prev.filter((_, i) => i !== index));
    };

    const iniciarEdicionDetalle = (index, detalle) => {
        setEditandoDetalle({ index, detalle });
        setNuevoDetalle({
            id_producto: detalle.id_producto,
            cantidad: detalle.cantidad.toString(),
            precio_detalle: detalle.precio_detalle.toString()
        });
        setProductoSeleccionado({
            value: detalle.id_producto,
            label: detalle.nombre_producto,
            precio: detalle.precio_detalle
        });
    };

    const guardarEdicionDetalle = () => {
        if (!editandoDetalle) return;
        if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0) {
            alert("Por favor, selecciona un producto y una cantidad válida.");
            return;
        }
        const producto = productos.find(p => p.id_producto === nuevoDetalle.id_producto);
        if (producto && nuevoDetalle.cantidad > producto.stock) {
            alert(`Stock insuficiente de ${producto.nombre_producto}. Unidades disponibles: ${producto.stock}`);
            return;
        }
        const nuevosDetalles = [...detallesVenta];
        nuevosDetalles[editandoDetalle.index] = {
            id_producto: nuevoDetalle.id_producto,
            nombre_producto: productoSeleccionado.label,
            cantidad: parseInt(nuevoDetalle.cantidad),
            precio_detalle: parseFloat(nuevoDetalle.precio_detalle)
        };
        setDetallesVenta(nuevosDetalles);
        setEditandoDetalle(null);
        setNuevoDetalle({ id_producto: '', cantidad: '', precio_detalle: '' });
        setProductoSeleccionado(null);
    };

    return (
        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} fullscreen>
            <Modal.Header closeButton>
                <Modal.Title>Actualizar Venta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formCliente">
                                <Form.Label>Cliente</Form.Label>
                                <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={cargarClientes}
                                    onChange={manejarCambioCliente}
                                    value={clienteSeleccionado}
                                    placeholder="Buscar cliente..."
                                    isClearable
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formFechaVenta">
                                <Form.Label>Fecha de Venta</Form.Label>
                                <DatePicker
                                    selected={ventaActualizada.fecha_venta}
                                    onChange={(date) => setVentaActualizada(prev => ({ ...prev, fecha_venta: date }))}
                                    className="form-control"
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    showTimeSelect
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <hr />
                    <h5>{editandoDetalle ? "Editar Detalle" : "Agregar Detalle"}</h5>
                    <Row>
                        <Col md={4}>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={cargarProductos}
                                onChange={manejarCambioProducto}
                                value={productoSeleccionado}
                                placeholder="Seleccionar producto"
                                isDisabled={editandoDetalle !== null}
                            />
                        </Col>
                        <Col md={3}>
                            <FormControl
                                type="number"
                                name="cantidad"
                                value={nuevoDetalle.cantidad}
                                onChange={manejarCambioDetalle}
                                placeholder="Cantidad"
                                min="1"
                            />
                        </Col>
                        <Col md={3}>
                            <FormControl
                                type="number"
                                name="precio_detalle"
                                value={nuevoDetalle.precio_detalle}
                                placeholder="Precio"
                                disabled
                            />
                        </Col>
                        <Col md={2}>
                            {editandoDetalle ? (
                                <Button variant="primary" onClick={guardarEdicionDetalle}>Guardar</Button>
                            ) : (
                                <Button variant="success" onClick={manejarAgregarDetalle}>Agregar</Button>
                            )}
                        </Col>
                    </Row>

                    {detallesVenta.length > 0 && (
                        <>
                            <Table striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Subtotal</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detallesVenta.map((detalle, index) => (
                                        <tr key={index}>
                                            <td>{detalle.nombre_producto}</td>
                                            <td>{detalle.cantidad}</td>
                                            <td>{detalle.precio_detalle.toFixed(2)}</td>
                                            <td>{(detalle.cantidad * detalle.precio_detalle).toFixed(2)}</td>
                                            <td>
                                                <Button variant="warning" size="sm" onClick={() => iniciarEdicionDetalle(index, detalle)}>Editar</Button>{' '}
                                                <Button variant="danger" size="sm" onClick={() => eliminarDetalle(index)}>Eliminar</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
                <Button variant="primary" onClick={() => actualizarVenta(ventaActualizada, detallesVenta)}>Actualizar Venta</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalActualizacionVenta;
