import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroAbono = ({
  mostrarModal,
  setMostrarModal,
  nuevoAbono,
  manejarCambioInput,
  agregarAbono,
  errorCarga,
  clientes // Lista de categorías obtenidas
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Abono</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group className="mb-3" controlId="formCliente">
            <Form.Label>Cliente</Form.Label>
            <Form.Select
              name="id_cliente"
              value={nuevoAbono.id_cliente}
              onChange={manejarCambioInput}
              required
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMonto">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              name="monto"
              value={nuevoAbono.monto}
              onChange={manejarCambioInput}
              placeholder="Ingresa el monto"
              step="0.01"
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFecha">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fecha_abono"
              value={nuevoAbono.fecha_abono}
              onChange={manejarCambioInput}
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
        <Button variant="primary" onClick={agregarAbono}>
          Guardar Abono
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroAbono;
