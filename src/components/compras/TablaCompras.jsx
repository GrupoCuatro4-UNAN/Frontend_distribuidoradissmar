import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaCompras = ({ compras, cargando, error }) => {
  if (cargando) return <div>Cargando compras...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID Compra</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {compras.map((compra) => (  
          <tr key={compra.id_compra}>
            <td>{compra.id_compra}</td>
            <td>{compra.fecha_compra}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaCompras;