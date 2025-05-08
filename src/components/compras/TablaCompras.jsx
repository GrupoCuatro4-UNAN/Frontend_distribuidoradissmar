import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

const TablaCompras = ({
  compras,
  cargando,
  error,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual }) => {

  if (cargando) return <div>Cargando compras...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Compra</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra) => (
            <tr key={compra.id_compra}>
              <td>{compra.id_compra}</td>
              <td>{compra.fecha_compra}</td>
              <td>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => obtenerDetalles(compra.id_compra)}
                >
                  <i className="bi bi-list-ul"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(compra)}
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

      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}

      />
    </>
  );
};

export default TablaCompras;