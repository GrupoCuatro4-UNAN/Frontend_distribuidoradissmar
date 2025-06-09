import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Alert } from "react-bootstrap";

const frasesDelDia = [
  "Cada día es una nueva oportunidad para crecer. 🌱",
  "No cuentes los días, haz que los días cuenten. 💪",
  "El éxito es la suma de pequeños esfuerzos repetidos cada día. 🔁",
  "La constancia es la clave del éxito. 🗝️",
  "Cree en ti mismo y todo será posible. ✨",
];

const Inicio = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [horaActual, setHoraActual] = useState(new Date());
  const [frase, setFrase] = useState("");
  const [contadorSesion, setContadorSesion] = useState(1);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setNombreUsuario(usuarioGuardado);
    }

    const sesiones = parseInt(localStorage.getItem("sesiones") || "0") + 1;
    localStorage.setItem("sesiones", sesiones);
    setContadorSesion(sesiones);

    setFrase(frasesDelDia[Math.floor(Math.random() * frasesDelDia.length)]);

    const intervalo = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const formatearFecha = () =>
    horaActual.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatearHora = () => horaActual.toLocaleTimeString("es-ES");

  const obtenerSaludo = () => {
    const hora = horaActual.getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <Container className="mt-4">
      <h1>.</h1><h1>.</h1>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center p-4 bg-primary text-white rounded shadow">
            <div>
              <h1 className="mb-1">
                {obtenerSaludo()}, {nombreUsuario}! 👋
              </h1>
              <p className="mb-0 opacity-75">{formatearFecha()}</p>
            </div>
            <div className="text-end">
              <Badge bg="light" text="dark" className="fs-5 px-3 py-2">
                {formatearHora()}
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* Frase del día */}
      <Row className="mb-4">
        <Col>
          <Alert variant="info" className="shadow-sm text-center fs-5">
            🌟 <strong>Frase del día:</strong> {frase}
          </Alert>
        </Col>
      </Row>

      {/* Contador de sesiones */}
      <Row className="mb-4">
        <Col>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>📈 Has iniciado sesión {contadorSesion} {contadorSesion === 1 ? "vez" : "veces"}.</Card.Title>
              <Card.Text className="text-muted">
                ¡Gracias por volver! Tu constancia hace la diferencia.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Actividad reciente simulada */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light">
              <h5 className="mb-0">📊 Actividad Simulada</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                <Badge bg="success" className="me-2">Automático</Badge>
                <span>Se actualizó tu frase diaria</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <Badge bg="info" className="me-2">Sistema</Badge>
                <span>Se registró tu sesión #{contadorSesion}</span>
              </div>
              <div className="d-flex align-items-center">
                <Badge bg="secondary" className="me-2">Notificación</Badge>
                <span>¡Sigue aprendiendo cada día!</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;
