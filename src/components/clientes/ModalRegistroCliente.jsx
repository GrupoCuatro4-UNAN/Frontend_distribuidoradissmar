import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejarCambioInput,
  agregarCliente,
  errorCarga,
  cargando
}) => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      agregarCliente();
    }
    
    setValidated(true);
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Registrar Nuevo Cliente</Modal.Title>
      </Modal.Header>
      
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {errorCarga && <Alert variant="danger">{errorCarga}</Alert>}
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={nuevoCliente.nombre || ''}
                  onChange={manejarCambioInput}
                  placeholder="Ej: María"
                  maxLength={20}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese el nombre
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido *</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={nuevoCliente.apellido || ''}
                  onChange={manejarCambioInput}
                  placeholder="Ej: González"
                  maxLength={20}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese el apellido
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cédula *</Form.Label>
                <Form.Control
                  type="text"
                  name="cedula"
                  value={nuevoCliente.cedula || ''}
                  onChange={manejarCambioInput}
                  placeholder="Ej: 365-1234-100R"
                  maxLength={20}
                  required
                  pattern="[0-9-]{8,20}"
                />
                <Form.Text className="text-muted">
                  Formato: 000-0000-000X
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese una cédula válida
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Celular</Form.Label>
                <Form.Control
                  type="tel"
                  name="celular"
                  value={nuevoCliente.celular || ''}
                  onChange={manejarCambioInput}
                  placeholder="Ej: 8859-3520"
                  maxLength={12}
                  pattern="[0-9-]{8,12}"
                />
                <Form.Control.Feedback type="invalid">
                  Formato: 0000-0000
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="direccion"
              value={nuevoCliente.direccion || ''}
              onChange={manejarCambioInput}
              placeholder="Ingrese la dirección completa"
              maxLength={50}
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setMostrarModal(false)}
            disabled={cargando}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                Registrando...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Registrar Cliente
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalRegistroCliente;