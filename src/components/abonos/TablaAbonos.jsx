import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

const TablaAbonos = ({
  abonos,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicionAbono }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando abonos...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;     // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Abonos</th>
            <th>ID Cliente</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {abonos.map((abono) => (
            <tr key={abono.id_abono}>
              <td>{abono.id_abono}</td>
              <td>{abono.id_cliente}</td>
              <td>{abono.monto}</td>
              <td>{abono.fecha_abono}</td>

              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(abono)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicionAbono(abono)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
              </td>

            </tr>
          ))}
        </tbody>
      </Table>

      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

    </>
  );


};

// Exportación del componente
export default TablaAbonos;