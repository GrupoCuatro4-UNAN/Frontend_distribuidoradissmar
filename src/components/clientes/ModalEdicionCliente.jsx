import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCliente = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    clienteEditado,
    manejarCambioInputEdicion,
    actualizarCliente,
    errorCarga,
}) => {
    return (
        <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={clienteEditado?.nombre || ""}
                            onChange={manejarCambioInputEdicion}
                            placeholder="Ingresa nombre (máx. 20 caracteres)"
                            maxLength={20}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formApellido">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control
                            type="text"
                            name="apellido"
                            value={clienteEditado?.apellido || ""}
                            onChange={manejarCambioInputEdicion}
                            placeholder="Ingresa el apellido (máx. 20 caracteres)"
                            maxLength={20}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCelular">
                        <Form.Label>Celular</Form.Label>
                        <Form.Control
                            type="tel"
                            name="celular"
                            value={clienteEditado?.celular || ""}
                            onChange={manejarCambioInputEdicion}
                            placeholder="Ingresa el número de celular (12 dígitos)"
                            maxLength={12}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDireccion">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                            type="text"
                            name="direccion"
                            value={clienteEditado?.direccion || ""}
                            onChange={manejarCambioInputEdicion}
                            placeholder="Ingresa la dirección (máx. 150 caracteres)"
                            maxLength={150}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCedula">
                        <Form.Label>Cédula</Form.Label>
                        <Form.Control
                            type="text"
                            name="cedula"
                            value={clienteEditado?.cedula || ""}
                            onChange={manejarCambioInputEdicion}
                            placeholder="Ingresa la cédula (máx. 20 caracteres)"
                            maxLength={20}
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
                <Button variant="primary" onClick={actualizarCliente}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionCliente;