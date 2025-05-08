import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaCreditos = ({ creditos, cargando, error, abrirModalEliminacion }) => {
  if (cargando) return <div>Cargando créditos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID Crédito</th>
          <th>ID Cliente</th>
          <th>Tipo</th>
          <th>Plazo</th>
          <th>Intereses</th>
          <th>Fecha de vencimiento</th>
          <th>Monto</th>
          <th>Cantidad Max</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {creditos.map((credito) => (
          <tr key={credito.id_credito}>
            <td>{credito.id_credito}</td>
            <td>{credito.id_cliente}</td>
            <td>{credito.tipo_credito}</td>
            <td>{credito.plazo_pago}m</td>
            <td>{credito.tasa_interes}%</td>
            <td>{credito.fecha_vencimiento}</td>
            <td>{credito.monto_credito} C$</td>
            <td>{credito.limite_credito} C$ </td>
            <td>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => abrirModalEliminacion(credito)}
              >
                <i className="bi bi-trash"></i>
              </Button>
              <Button
                variant="outline-warning"
                size="sm"
                className="me-2"
                onClick={() => abrirModalActualizacion(venta)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaCreditos;