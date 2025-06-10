import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import logo from "/vite.png"; // Importación del logo de la ferretería
import "bootstrap-icons/font/bootstrap-icons.css"; // Importación de íconos de Bootstrap
import "../../App.css"; // Estilos personalizados de la aplicación

const Encabezado = () => {
  // Estado para controlar el colapso del menú lateral
  const [estaColapsado, setEstaColapsado] = useState(false);

  // Estado para controlar el dropdown "Más"
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  // Estado para detectar el tamaño de pantalla
  const [esPantallaPequena, setEsPantallaPequena] = useState(window.innerWidth < 576);
  const [esPantallaMediana, setEsPantallaMediana] = useState(window.innerWidth >= 576 && window.innerWidth < 992);

  // Hook para manejar la navegación entre rutas
  const navegar = useNavigate();

  // Hook para obtener la ubicación actual de la ruta
  const ubicacion = useLocation();

  // Validación del estado de autenticación con localStorage
  const estaLogueado = !!localStorage.getItem("usuario") && !!localStorage.getItem("contraseña");

  // Efecto para detectar cambios en el tamaño de ventana
  useEffect(() => {
    const manejarRedimensionado = () => {
      const ancho = window.innerWidth;
      setEsPantallaPequena(ancho < 576);
      setEsPantallaMediana(ancho >= 576 && ancho < 992);

      // Cerrar el menú si la pantalla se hace más grande
      if (ancho >= 992 && estaColapsado) {
        setEstaColapsado(false);
      }

      // Cerrar dropdown si la pantalla cambia de tamaño
      if (dropdownAbierto) {
        setDropdownAbierto(false);
      }
    };

    // Manejar clics fuera del dropdown
    const manejarClicFuera = (event) => {
      if (dropdownAbierto && !event.target.closest('.dropdown')) {
        setDropdownAbierto(false);
      }
    };

    window.addEventListener('resize', manejarRedimensionado);
    document.addEventListener('click', manejarClicFuera);

    return () => {
      window.removeEventListener('resize', manejarRedimensionado);
      document.removeEventListener('click', manejarClicFuera);
    };
  }, [estaColapsado, dropdownAbierto]);

  // Función para cerrar sesión
  const cerrarSesion = () => {
    setEstaColapsado(false); // Cierra el menú lateral
    localStorage.removeItem("usuario"); // Elimina el usuario de localStorage
    localStorage.removeItem("contraseña"); // Elimina la contraseña de localStorage
    navegar("/"); // Redirige a la página principal
  };

  // Función para alternar el estado del menú lateral
  const alternarColapso = () => setEstaColapsado(!estaColapsado);

  // Función genérica de navegación
  const navegarA = (ruta) => {
    navegar(ruta); // Navega a la ruta especificada
    setEstaColapsado(false); // Cierra el menú lateral
    setDropdownAbierto(false); // Cierra el dropdown
  };

  // Función para alternar el dropdown
  const alternarDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownAbierto(!dropdownAbierto);
  };

  // Configuración responsiva del logo
  const obtenerTamanoLogo = () => {
    if (esPantallaPequena) {
      return { width: "35", height: "40" };
    } else if (esPantallaMediana) {
      return { width: "40", height: "46" };
    }
    return { width: "45", height: "53" };
  };

  // Configuración responsiva del texto del brand
  const obtenerEstiloBrand = () => {
    const base = {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: esPantallaPequena ? "8px" : "12px"
    };

    if (esPantallaPequena) {
      return {
        ...base,
        fontSize: "0.9rem",
        fontWeight: "600"
      };
    } else if (esPantallaMediana) {
      return {
        ...base,
        fontSize: "1.1rem",
        fontWeight: "700"
      };
    }
    return {
      ...base,
      fontSize: "1.25rem",
      fontWeight: "700"
    };
  };

  // Texto del brand responsivo
  const obtenerTextoBrand = () => {
    if (esPantallaPequena) {
      return "DISSMAR";
    }
    return "Distribuidora DISSMAR";
  };

  // Configuración de navegación para diferentes tamaños
  const opcionesNavegacion = [
    { ruta: "/inicio", texto: "Inicio", icono: "bi-house-door-fill" },
    { ruta: "/clientes", texto: "Clientes", icono: "bi-box2-heart-fill" },
    { ruta: "/abonos", texto: "Abonos", icono: "bi-wallet2" },
    { ruta: "/compras", texto: "Compras", icono: "bi-basket-fill" },
    { ruta: "/creditos", texto: "Créditos", icono: "bi-credit-card-fill" },
    { ruta: "/estadisticas", texto: "Estadísticas", icono: "bi-pc-display-horizontal" },
    { ruta: "/dashboard", texto: "Dashboard", icono: "bi-speedometer2" },
    { ruta: "/productos", texto: "Productos", icono: "bi-people-fill" },
    { ruta: "/ventas", texto: "Ventas", icono: "bi-cart-fill" }
  ];

  return (
    // Barra de navegación fija en la parte superior con clases responsivas
    <Navbar
      expand="lg"
      fixed="top"
      className={`color-navbar ${esPantallaPequena ? 'py-2' : 'py-3'}`}
      style={{
        minHeight: esPantallaPequena ? '60px' : '70px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Container fluid={esPantallaPequena} className={esPantallaPequena ? 'px-3' : ''}>
        {estaLogueado ? (
          <>
            {/* Logo y nombre de la ferretería - Responsivo */}
            <Navbar.Brand
              onClick={() => navegarA("/inicio")}
              className="text-white d-flex align-items-center"
              style={obtenerEstiloBrand()}
            >
              <img
                alt="Logo DISSMAR"
                src={logo}
                {...obtenerTamanoLogo()}
                className="d-inline-block align-top"
                style={{
                  flexShrink: 0,
                  filter: 'brightness(1.1)'
                }}
              />
              <span className={esPantallaPequena ? 'd-none d-sm-inline' : ''}>
                <strong>{obtenerTextoBrand()}</strong>
              </span>
            </Navbar.Brand>

            {/* Navegación horizontal para pantallas grandes */}
            <Navbar.Collapse className="d-none d-lg-flex">
              <Nav className="me-auto">
                {opcionesNavegacion.slice(0, 5).map((opcion) => (
                  <Nav.Link
                    key={opcion.ruta}
                    onClick={() => navegarA(opcion.ruta)}
                    className={`text-white mx-1 px-3 py-2 rounded ${ubicacion.pathname === opcion.ruta ? 'bg-white bg-opacity-20' : 'hover-bg-white-10'
                      }`}
                    style={{
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <i className={`${opcion.icono} me-2`}></i>
                    {opcion.texto}
                  </Nav.Link>
                ))}
              </Nav>

              {/* Menú desplegable para opciones adicionales en pantallas grandes */}
              <Nav>
                <div className="dropdown position-relative">
                  <button
                    className="btn btn-outline-light dropdown-toggle me-3"
                    type="button"
                    onClick={alternarDropdown}
                    style={{
                      fontWeight: '600',
                      color: "black"
                    }}
                    aria-expanded={dropdownAbierto}
                  >
                    <i className="bi-grid-3x3-gap-fill me-2"></i>
                    Más
                  </button>
                  <ul
                    className={`dropdown-menu dropdown-menu-end ${dropdownAbierto ? 'show' : ''}`}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      zIndex: 1000,
                      display: dropdownAbierto ? 'block' : 'none',
                      marginTop: '0.5rem',
                      color: "black"
                    }}
                  >
                    {opcionesNavegacion.slice(5).map((opcion) => (
                      <li key={opcion.ruta}>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => navegarA(opcion.ruta)}
                          style={{
                            border: 'none',
                            background: 'none',
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.75rem 1rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <i className={`${opcion.icono} me-2`}></i>
                          {opcion.texto}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={cerrarSesion}
                  className="btn btn-outline-light"
                  style={{
                    fontWeight: '600',
                    color: "black"
                  }}
                >
                  <i className="bi-box-arrow-right me-2"></i>
                  {esPantallaMediana ? 'Salir' : 'Cerrar Sesión'}
                </button>
              </Nav>
            </Navbar.Collapse>

            {/* Botón para alternar el menú lateral en pantallas medianas y pequeñas */}
            <Navbar.Toggle
              aria-controls="offcanvasNavbar"
              onClick={alternarColapso}
              className="d-lg-none border-0 text-white"
              style={{
                fontSize: esPantallaPequena ? '1.2rem' : '1.5rem',
                padding: esPantallaPequena ? '4px 8px' : '6px 10px'
              }}
            >
              <i className={estaColapsado ? 'bi-x-lg' : 'bi-list'}></i>
            </Navbar.Toggle>

            {/* Menú lateral (Offcanvas) para pantallas medianas y pequeñas */}
            <Navbar.Offcanvas
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
              placement="end"
              show={estaColapsado}
              onHide={() => setEstaColapsado(false)}
              className="d-lg-none"
              style={{
                width: esPantallaPequena ? '85%' : '350px',
                maxWidth: '100vw'
              }}
            >
              {/* Encabezado del menú lateral */}
              <Offcanvas.Header
                closeButton
                className="border-bottom"
                style={{
                  padding: esPantallaPequena ? '1rem' : '1.5rem',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <Offcanvas.Title
                  id="offcanvasNavbarLabel"
                  className="color-texto-marca d-flex align-items-center"
                  style={{
                    fontSize: esPantallaPequena ? '1.1rem' : '1.3rem',
                    fontWeight: '700'
                  }}
                >
                  <img
                    alt="Logo"
                    src={logo}
                    width="30"
                    height="35"
                    className="me-2"
                  />
                  Menú Principal
                </Offcanvas.Title>
              </Offcanvas.Header>

              {/* Cuerpo del menú lateral */}
              <Offcanvas.Body style={{ padding: esPantallaPequena ? '1rem' : '1.5rem' }}>
                <Nav className="flex-column">
                  {opcionesNavegacion.map((opcion) => (
                    <Nav.Link
                      key={opcion.ruta}
                      onClick={() => navegarA(opcion.ruta)}
                      className={`text-dark mb-2 p-3 rounded d-flex align-items-center ${ubicacion.pathname === opcion.ruta ? 'bg-primary bg-opacity-10 border-start border-primary border-3' : 'hover-bg-light'
                        }`}
                      style={{
                        fontWeight: '600',
                        fontSize: esPantallaPequena ? '0.95rem' : '1rem',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        border: 'none'
                      }}
                    >
                      <i className={`${opcion.icono} me-3`} style={{ width: '20px' }}></i>
                      {opcion.texto}
                      {ubicacion.pathname === opcion.ruta && (
                        <i className="bi-check-circle-fill ms-auto text-primary"></i>
                      )}
                    </Nav.Link>
                  ))}

                  {/* Separador */}
                  <hr className="my-3" />

                  {/* Opción de cerrar sesión */}
                  <Nav.Link
                    onClick={cerrarSesion}
                    className="text-danger p-3 rounded d-flex align-items-center hover-bg-danger-light"
                    style={{
                      fontWeight: '600',
                      fontSize: esPantallaPequena ? '0.95rem' : '1rem',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="bi-box-arrow-right me-3" style={{ width: '20px' }}></i>
                    Cerrar Sesión
                  </Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </>
        ) : (
          ubicacion.pathname === "/" && (
            // Opción de iniciar sesión (solo en la ruta raíz) - Responsivo
            <Nav className="ms-auto">
              <Nav.Link
                onClick={() => navegarA("/")}
                className="text-white btn btn-outline-light"
                style={{
                  fontWeight: '600',
                  padding: esPantallaPequena ? '8px 16px' : '10px 20px',
                  fontSize: esPantallaPequena ? '0.9rem' : '1rem'
                }}
              >
                <i className="bi-person-circle me-2"></i>
                Iniciar Sesión
              </Nav.Link>
            </Nav>
          )
        )}
      </Container>
    </Navbar>
  );
};

export default Encabezado;