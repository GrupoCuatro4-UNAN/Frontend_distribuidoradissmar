import React from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

const ModalRegistroCompra = ({
  mostrarModal,
  setMostrarModal,
  nuevaCompra,
  manejarCambioInput,
  registrarCompra,
  errorCarga
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nueva Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Compra *</Form.Label>
            <Form.Control
              type="date"
              name="fecha_compra"
              value={nuevaCompra.fecha_compra}
              onChange={manejarCambioInput}
              required
            />
          </Form.Group>

          {errorCarga && <Alert variant="danger">{errorCarga}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={registrarCompra}>
          Registrar Compra
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCompra;