import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const VentasPorMes = ({ meses, totales_por_mes }) => {
    const data = {
        labels: meses, // Nombres de los meses
        datasets: [
            {
                label: 'Ventas(C$)',
                data: totales_por_mes, // Total de ventas por mes
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Córdobas (C$)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Meses', // Corregido: "Meses" en lugar de "Meseses"
                },
            },
        }, // Eliminado el punto y coma interno
    };

    return (
        <Card className="h-100"> {/* Clase de Bootstrap para altura */}
            <Card.Body className="d-flex flex-column"> {/* Flex para mejor manejo del espacio */}
                <Card.Title className="mb-3">Ventas por mes</Card.Title> {/* Margen inferior */}
                <div className="flex-grow-1" style={{ position: "relative" }}> {/* Ocupa el espacio restante */}
                    <Bar
                        data={data}
                        options={options}
                        plugins={[/* Plugins adicionales si los necesitas */]}
                    />
                </div>
            </Card.Body>
        </Card>
    );
};
export default VentasPorMes;