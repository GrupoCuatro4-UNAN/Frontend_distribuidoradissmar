import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionAbono = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    abonoEditado,
    manejarCambioInputEdicion,
    actualizarAbono,
    errorCarga,
}) => {
    return (
        <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Abono</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formIdCliente">
                        <Form.Label>ID Cliente</Form.Label>
                        <Form.Control
                            type="number"
                            name="id_cliente"
                            value={abonoEditado?.id_cliente || ""}
                            onChange={manejarCambioInputEdicion}
                            placeholder="ID del cliente"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formMonto">
                        <Form.Label>Monto</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="monto"
                            value={abonoEditado?.monto || ""}
                            onChange={manejarCambioInputEdicion}
                            placeholder="Monto del abono"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formFechaAbono">
                        <Form.Label>Fecha del Abono</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_abono"
                            value={abonoEditado?.fecha_abono || ""}
                            onChange={manejarCambioInputEdicion}
                            required
                        />
                    </Form.Group>
                    {errorCarga && (
                        <div className="text-danger mt-2">{errorCarga}</div>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={actualizarAbono}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionAbono;
