import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaVentas = ({ ventas, cargando, error }) => {
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
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta) => (
          <tr key={venta.id_venta}>
            <td>{venta.id_venta}</td>
            <td>{venta.fecha_venta}</td>
            <td>{venta.id_cliente}</td>
            <td>{venta.total} aqui me da un error raro xd</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaVentas;