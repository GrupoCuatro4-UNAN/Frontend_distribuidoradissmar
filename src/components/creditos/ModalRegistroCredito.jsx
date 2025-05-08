import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCredito = ({
    mostrarModal,
    setMostrarModal,
    nuevoCredito,
    manejarCambioInput,
    agregarCredito,
    errorCarga,
    clientes // Lista de categorías obtenidas
}) => {
    return (
        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Credito</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formCliente">
                        <Form.Label>Cliente</Form.Label>
                        <Form.Select
                            name="id_cliente"
                            value={nuevoCredito.id_cliente}
                            onChange={manejarCambioInput}
                            required
                        >
                            <option value="">Selecciona un cliente</option>
                            {Array.isArray(clientes) && clientes.map((cliente) => (
                                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                                    {cliente.nombre}
                                </option>
                            ))}
                        </Form.Select>

                        <Form.Group className="mb-3" controlId="formTipoCredito">
                            <Form.Label>Tipo credito</Form.Label>
                            <Form.Control
                                type="text"
                                name="tipo_credito"
                                value={nuevoCredito.tipo_credito}
                                onChange={manejarCambioInput}
                                placeholder="Ingresa el tipo de credito (máx. 20 caracteres)"
                                maxLength={20}
                                required
                            />
                        </Form.Group>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPlazoPago">
                        <Form.Label>Plazo a pagar</Form.Label>
                        <Form.Control
                            type="number"
                            name="plazo_pago"
                            value={nuevoCredito.plazo_pago}
                            onChange={manejarCambioInput}
                            placeholder="Ingresa el plazo"
                            min="0"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTasaInteres">
                        <Form.Label>Tasa de interes</Form.Label>
                        <Form.Control
                            type="number"
                            name="tasa_interes"
                            value={nuevoCredito.tasa_interes}
                            onChange={manejarCambioInput}
                            placeholder="Ingresa la tasa de interes"
                            min="0"
                            required
                        />
                        <Form.Group className="mb-3" controlId="formFechaVencimiento">
                            <Form.Label>Fecha de vencimiento</Form.Label>
                            <Form.Control
                                type="date"
                                name="fecha_vencimiento"
                                value={nuevoCredito.fecha_vencimiento}
                                onChange={manejarCambioInput}
                                required
                            />
                        </Form.Group>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formMontoCredito">
                        <Form.Label>Monto de credito</Form.Label>
                        <Form.Control
                            type="number"
                            name="monto_credito"
                            value={nuevoCredito.monto_credito}
                            onChange={manejarCambioInput}
                            placeholder="Ingresa el monto de credito"
                            min="0"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formLimiteCredito">
                        <Form.Label>Limite de credito</Form.Label>
                        <Form.Control
                            type="number"
                            name="limite_credito"
                            value={nuevoCredito.limite_credito}
                            onChange={manejarCambioInput}
                            placeholder="Ingresa el monto de credito"
                            min="0"
                            required
                        />
                    </Form.Group>
                    {errorCarga && (
                        <div className="text-danger mt-2">{errorCarga}</div>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={agregarCredito}>
                    Guardar Credito
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroCredito;
