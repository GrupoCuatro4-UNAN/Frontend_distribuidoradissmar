import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaProductos = ({ productos, cargando, error }) => {
  if (cargando) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID Producto</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Categoría</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto) => (
          <tr key={producto.id_producto}>
            <td>{producto.id_producto}</td>
            <td>{producto.nombre_producto}</td>
            <td>{producto.descripcion}</td>
            <td>{producto.precio_unitario}</td>
            <td>{producto.stock}</td>
            <td>{producto.categoria}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaProductos;