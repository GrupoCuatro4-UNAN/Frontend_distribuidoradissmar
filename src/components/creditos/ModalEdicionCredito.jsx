import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCredito = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    creditoEditado,
    manejarCambioInputEdicion,
    actualizarCredito,
    errorCarga,
    clientes
}) => {
    return (
        <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Crédito</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formCliente">
                        <Form.Label>Cliente</Form.Label>
                        <Form.Select
                            name="id_cliente"
                            value={creditoEditado?.id_cliente || ""}
                            onChange={manejarCambioInputEdicion}
                            required
                        >
                            <option value="">Selecciona un cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                                    {cliente.nombre} {cliente.apellido}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formTipo">
                        <Form.Label>Tipo de crédito</Form.Label>
                        <Form.Control
                            type="text"
                            name="tipo_credito"
                            value={creditoEditado?.tipo_credito || ""}
                            onChange={manejarCambioInputEdicion}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPlazo">
                        <Form.Label>Plazo de pago (en meses)</Form.Label>
                        <Form.Control
                            type="number"
                            name="plazo_pago"
                            value={creditoEditado?.plazo_pago || ""}
                            onChange={manejarCambioInputEdicion}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formInteres">
                        <Form.Label>Tasa de interés (%)</Form.Label>
                        <Form.Control
                            type="number"
                            name="tasa_interes"
                            value={creditoEditado?.tasa_interes || ""}
                            onChange={manejarCambioInputEdicion}
                            step="0.01"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formVencimiento">
                        <Form.Label>Fecha de vencimiento</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_vencimiento"
                            value={creditoEditado?.fecha_vencimiento?.split("T")[0] || ""}
                            onChange={manejarCambioInputEdicion}
                        /> 
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMonto">
                        <Form.Label>Monto del crédito</Form.Label>
                        <Form.Control
                            type="number"
                            name="monto_credito"
                            value={creditoEditado?.monto_credito || ""}
                            onChange={manejarCambioInputEdicion}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formLimite">
                        <Form.Label>Límite del crédito</Form.Label>
                        <Form.Control
                            type="number"
                            name="limite_credito"
                            value={creditoEditado?.limite_credito || ""}
                            onChange={manejarCambioInputEdicion}
                            required
                        />
                    </Form.Group>

                    {errorCarga && <div className="text-danger mt-2">{errorCarga}</div>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={actualizarCredito}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionCredito;
