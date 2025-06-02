import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalEdicionProducto = ({
    mostrarModal,        // Estado que controla si el modal se muestra
    setMostrarModal,     // Función para cambiar el estado de visibilidad del modal
    productoAEditar,     // Producto que se editará
    manejarCambioInput,  // Función para manejar cambios de los inputs
    editarProducto,      // Función para ejecutar la edición
    errorCarga           // Mensaje de error si ocurre
}) => {
    // Verifica si no hay un producto seleccionado para editar
    if (!productoAEditar) {
        return null;  // Si no hay producto, no se debe mostrar el modal
    }

    return (
        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorCarga && <div className="alert alert-danger">{errorCarga}</div>}
                <Form>
                    <Form.Group controlId="nombre_producto">
                        <Form.Label>Nombre del Producto</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre_producto"
                            value={productoAEditar?.nombre_producto || ''}
                            onChange={manejarCambioInput}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="descripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            type="text"
                            name="descripcion"
                            value={productoAEditar?.descripcion || ''}
                            onChange={manejarCambioInput}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="categoria">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Control
                            type="text"
                            name="categoria"
                            value={productoAEditar?.categoria || ''}
                            onChange={manejarCambioInput}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="precio_unitario">
                        <Form.Label>Precio Unitario</Form.Label>
                        <Form.Control
                            type="number"
                            name="precio_unitario"
                            value={productoAEditar?.precio_unitario || ''}
                            onChange={manejarCambioInput}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="stock">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            type="number"
                            name="stock"
                            value={productoAEditar?.stock || ''}
                            onChange={manejarCambioInput}
                            required
                        />
                    </Form.Group>

                    {errorCarga && <div className="text-danger mt-2">{errorCarga}</div>}
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={editarProducto}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionProducto;
