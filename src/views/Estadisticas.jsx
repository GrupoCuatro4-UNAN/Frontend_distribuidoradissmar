import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Button } from 'react-bootstrap';
import VentasPorMes from '../components/graficos/VentasPorMes';
import VentasPorDia from '../components/graficos/VentasPorDia';
import ChatIA from '../components/chat/ChatIA';


const Estadisticas = () => {

    const [mostrarChatModal, setMostrarChatModal] = useState(false); // Estado para el modal
    // Estados para ventas por mes
    const [meses, setMeses] = useState([]);
    const [totalesPorMes, setTotalesPorMes] = useState([]);

    // Estados para ventas por día
    const [dias, setDias] = useState([]);
    const [totalesPorDia, setTotalesPorDia] = useState([]);

    // Estado para controlar carga y errores
    const [loading, setLoading] = useState({
        mensual: true,
        diario: true
    });
    const [error, setError] = useState({
        mensual: null,
        diario: null
    });

    // Cargar datos de ventas por mes
    useEffect(() => {
        const cargaVentasPorMes = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/totalventaspormes');
                if (!response.ok) throw new Error('Error al cargar ventas mensuales');

                const data = await response.json();
                setMeses(data.map(item => item.mes));
                setTotalesPorMes(data.map(item => item.total_ventas));
                setLoading(prev => ({ ...prev, mensual: false }));

            } catch (err) {
                console.error('Error ventas mensuales:', err);
                setError(prev => ({ ...prev, mensual: err.message }));
                setLoading(prev => ({ ...prev, mensual: false }));
            }
        };

        cargaVentasPorMes();
    }, []);

    // Cargar datos de ventas por día
    useEffect(() => {
        const cargaVentasPorDia = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/totalventasPordia');
                if (!response.ok) throw new Error('Error al cargar ventas diarias');

                const data = await response.json();
                setDias(data.map(item => item.dia));
                setTotalesPorDia(data.map(item => item.total_ventas));
                setLoading(prev => ({ ...prev, diario: false }));

            } catch (err) {
                console.error('Error ventas diarias:', err);
                setError(prev => ({ ...prev, diario: err.message }));
                setLoading(prev => ({ ...prev, diario: false }));
            }
        };

        cargaVentasPorDia();
    }, []);

    return (
        <Container fluid className="py-4 px-md-5 bg-light">
            <h2>
                .
            </h2>
            <h2>
                .
            </h2>
            <h2>
                .
            </h2>
            <h2 className="text-center text-dark mb-4">📊 Estadísticas de Ventas </h2>
            <Button
                variant="primary"
                className="mb-4"
                onClick={() => setMostrarChatModal(true)}
            >
                Consultar con IA
            </Button>

            <Tabs defaultActiveKey="mensual" className="mb-4 justify-content-center">
                <Tab eventKey="mensual" title="Ventas Mensuales">
                    <ChatIA mostrarChatModal={mostrarChatModal} setMostrarChatModal={setMostrarChatModal} />
                    <Row className="g-4 justify-content-center mt-3">
                        <Col xs={12} xl={10}>
                            <Card className="shadow-sm border-0">
                                <Card.Body>
                                    {loading.mensual ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Cargando...</span>
                                            </div>
                                        </div>
                                    ) : error.mensual ? (
                                        <div className="alert alert-danger">
                                            Error al cargar datos mensuales: {error.mensual}
                                        </div>
                                    ) : (
                                        <VentasPorMes
                                            meses={meses}
                                            totales_por_mes={totalesPorMes}
                                        />
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>

                <Tab eventKey="diario" title="Ventas Diarias">
                    <Row className="g-4 justify-content-center mt-3">
                        <Col xs={12} xl={10}>
                            <Card className="shadow-sm border-0">
                                <Card.Body>
                                    {loading.diario ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Cargando...</span>
                                            </div>
                                        </div>
                                    ) : error.diario ? (
                                        <div className="alert alert-danger">
                                            Error al cargar datos diarios: {error.diario}
                                        </div>
                                    ) : (
                                        <VentasPorDia
                                            dias={dias}
                                            totales_por_dia={totalesPorDia}
                                        />
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default Estadisticas;