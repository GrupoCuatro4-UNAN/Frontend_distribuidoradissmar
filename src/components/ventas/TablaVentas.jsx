import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaVentas = ({ ventas, cargando, error, obtenerDetalles, abrirModalEliminacion, abrirModalActualizacion }) => {
  if (cargando) return <div>Cargando ventas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID Venta</th>
          <th>Fecha</th>
          <th>ID Cliente</th>
          <th>Credito</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta) => (
          <tr key={venta.id_venta}>
            <td>{venta.id_venta}</td>
            <td>{venta.fecha_venta}</td>
            <td>{venta.id_cliente}</td>
            <td>{venta.cridito}</td>
            <td>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => obtenerDetalles(venta.id_venta)}
              >
                <i className="bi bi-list-ul"></i>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => abrirModalEliminacion(venta)}
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

export default TablaVentas;