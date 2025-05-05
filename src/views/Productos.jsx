import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/productos/TablaProductos';
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalRegistroProducto from '../components/productos/ModalRegisterProducto';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalEliminacionProducto from '../components/productos/ModalEliminacionProducto';


const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    descripcion: '',
    precio_unitario: '',
    stock: '',
    categoria: ''
  });
  const [porductosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtrados = listaProductos.filter(
      (producto) =>
        producto.nombre_producto.toLowerCase().includes(texto) ||
        producto.descripcion.toLowerCase().includes(texto) ||
        producto.categoria.toLowerCase().includes(texto)
    );
    setProductosFiltrados(filtrados);
  };

  // Calcular elementos paginados
  const productosPaginados = porductosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );


  const eliminarProducto = async () => {
    if (!productoAEliminar) return;
    try {
      const respuesta = await
        fetch(`http://localhost:3000/api/eliminarproducto/${productoAEliminar.id_producto}`, {
          method: 'DELETE',
        });
      if (!respuesta.ok) {
        throw new Error('Error al eliminar el producto');
      }
      await obtenerProductos(); // Refresca la lista
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1); // Regresa a la primera página
      setProductoAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };
  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  useEffect(() => {

    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos);

      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  // Maneja los cambios en los inputs del modal de productos

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: value  // No convertir aquí a número
    }));
  };

  // Manejo de la inserción de un nuevo producto
  const agregarProducto = async () => {
    const { nombre_producto, descripcion, precio_unitario, stock, categoria } = nuevoProducto;

    if (!nombre_producto || !descripcion || !precio_unitario || !stock || !categoria) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el producto');
      }

      await obtenerProductos(); // Refresca la lista desde el servidor
      setNuevoProducto({
        nombre_producto: '',
        descripcion: '',
        precio_unitario: '',
        stock: '',
        categoria: ''
      });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };




  return (
    <Container className="mt-5">
      <br />
      <h4>Productos</h4>

      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nuevo Producto
          </Button>
        </Col>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <br /><br />

      <TablaProductos
        productos={productosPaginados}
        cargando={cargando}
        error={errorCarga}
        totalElementos={listaProductos.length} // Total de elementos
        elementosPorPagina={elementosPorPagina} // Elementos por página
        paginaActual={paginaActual} // Página actual
        establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
        abrirModalEliminacion={abrirModalEliminacion}
      />

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejarCambioInput={manejarCambioInput}
        agregarProducto={agregarProducto}
        errorCarga={errorCarga}
      />

      <ModalEliminacionProducto
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarProducto={eliminarProducto}
      />

    </Container>
  );
};

export default Productos;