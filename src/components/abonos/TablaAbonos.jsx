import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaAbonos = ({ abonos, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando abonos...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;     // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
        <th>ID Abonos</th>
          <th>ID Cliente</th>
          <th>Monto</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {abonos.map((abono) => (
          <tr key={abono.id_abono}>
            <td>{abono.id_abono}</td>
            <td>{abono.id_cliente}</td>
            <td>{abono.monto}</td>
            <td>{abono.fecha_abono}</td>

          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaAbonos;