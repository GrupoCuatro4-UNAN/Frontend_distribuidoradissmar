// ModalRegistroAbono.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Alert, Card, Spinner } from 'react-bootstrap';



const ModalRegistroAbono = ({ 
  mostrarModal, 
  setMostrarModal,
  nuevoAbono,
  manejarCambioInput,
  agregarAbono,
  errorCarga,
  clientes = [], // Valor por defecto array vacío
  creditosClientes = [], // Valor por defecto array vacío
  abonos = [] // Valor por defecto array vacío
}) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [saldoPendiente, setSaldoPendiente] = useState(0);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (nuevoAbono?.id_cliente) {
      const cliente = clientes.find(c => c.id_cliente == nuevoAbono.id_cliente);
      const credito = creditosClientes.find(c => c.id_cliente == nuevoAbono.id_cliente);
      
      setClienteSeleccionado(cliente || null);
      
      if (credito) {
        const abonosCliente = abonos.filter(a => a.id_cliente == nuevoAbono.id_cliente);
        const totalAbonado = abonosCliente.reduce((sum, abono) => sum + (abono.monto || 0), 0);
        setSaldoPendiente((credito.monto_credito || 0) - totalAbonado);
      } else {
        setSaldoPendiente(0);
      }
    } else {
      setClienteSeleccionado(null);
      setSaldoPendiente(0);
    }
  }, [nuevoAbono?.id_cliente, clientes, creditosClientes, abonos]);

  // Función segura para manejar cambios
  const handleChange = (e) => {
    try {
      manejarCambioInput(e);
    } catch (error) {
      console.error("Error al manejar cambio:", error);
    }
  };

  // Función segura para agregar abono
  const handleAgregarAbono = async () => {
    setCargando(true);
    try {
      await agregarAbono();
    } catch (error) {
      console.error("Error al agregar abono:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Registrar Nuevo Abono</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {errorCarga && <Alert variant="danger">{errorCarga}</Alert>}
        
        <Form>
          {/* Campo Selección de Cliente */}
          <Form.Group className="mb-3">
            <Form.Label>Cliente *</Form.Label>
            {clientes.length === 0 ? (
              <Alert variant="warning">No hay clientes disponibles</Alert>
            ) : (
              <Form.Select
                name="id_cliente"
                value={nuevoAbono?.id_cliente || ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map(cliente => {
                  const credito = creditosClientes.find(c => c.id_cliente === cliente.id_cliente);
                  return (
                    <option 
                      key={cliente.id_cliente} 
                      value={cliente.id_cliente}
                      disabled={!credito}
                    >
                      {cliente.nombre} {cliente.apellido} - {cliente.cedula}
                      {credito ? ` (Crédito: C$${(credito.monto_credito || 0).toFixed(2)})` : ' (Sin crédito)'}
                    </option>
                  );
                })}
              </Form.Select>
            )}
          </Form.Group>

          {/* Información del cliente seleccionado */}
          {clienteSeleccionado && (
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Información del Cliente</Card.Title>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Nombre:</strong> {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</p>
                    <p><strong>Cédula:</strong> {clienteSeleccionado.cedula || 'No registrada'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Teléfono:</strong> {clienteSeleccionado.celular || 'No registrado'}</p>
                    <p><strong>Dirección:</strong> {clienteSeleccionado.direccion || 'No registrada'}</p>
                  </div>
                </div>
                {saldoPendiente > 0 && (
                  <Alert variant={saldoPendiente > 0 ? 'info' : 'success'}>
                    <strong>Saldo pendiente:</strong> C${saldoPendiente.toFixed(2)}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Campo Monto */}
          <Form.Group className="mb-3">
            <Form.Label>Monto *</Form.Label>
            <div className="input-group">
              <span className="input-group-text">C$</span>
              <Form.Control
                type="number"
                name="monto"
                value={nuevoAbono?.monto || ''}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                max={saldoPendiente > 0 ? saldoPendiente : undefined}
                required
                placeholder="Ej: 150.50"
                disabled={!nuevoAbono?.id_cliente}
              />
            </div>
            <Form.Text className="text-muted">
              {saldoPendiente > 0 ? 
                `Monto máximo permitido: C$${saldoPendiente.toFixed(2)}` : 
                nuevoAbono?.id_cliente ? 'El cliente no tiene saldo pendiente' : 'Seleccione un cliente primero'}
            </Form.Text>
          </Form.Group>

          {/* Campo Fecha */}
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Abono</Form.Label>
            <Form.Control
              type="date"
              name="fecha_abono"
              value={nuevoAbono?.fecha_abono || ''}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => setMostrarModal(false)}
          disabled={cargando}
        >
          Cancelar
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleAgregarAbono}
          disabled={cargando || !nuevoAbono?.id_cliente || !nuevoAbono?.monto || 
                   (saldoPendiente > 0 && nuevoAbono.monto > saldoPendiente)}
        >
          {cargando ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ms-2">Procesando...</span>
            </>
          ) : (
            <>
              <i className="fas fa-save me-2"></i>
              Registrar Abono
            </>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroAbono;