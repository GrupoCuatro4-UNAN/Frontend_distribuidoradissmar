// components/detalles_ventas/ModalDetallesVenta.jsx
import React from 'react';
import { Modal, Button, Table, Container } from 'react-bootstrap';

const ModalDetallesVenta = ({ mostrarModal, setMostrarModal, detalles, cargandoDetalles, errorDetalles }) => {
    return (
        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} fullscreen>
            <Modal.Header closeButton>
                <Modal.Title>Detalles de la Venta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {cargandoDetalles ? (
                    <div>Cargando detalles...</div>
                ) : errorDetalles ? (
                    <div>Error: {errorDetalles}</div>
                ) : (
                    <Container>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>ID Detalle</th>
                                    <th>ID Venta</th>
                                    <th>ID Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio </th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalles.map((detalle) => (
                                    <tr key={detalle.id_detalle_venta}>
                                        <td>{detalle.id_detalle_venta}</td>
                                        <td>{detalle.id_venta}</td>
                                        <td>{detalle.id_producto}</td>
                                        <td>{detalle.cantidad}</td>
                                        <td>C$ {detalle.precio_detalle.toFixed(2)}</td>
                                        <td>C$ {detalle.subtotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDetallesVenta;
