import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const VentasPorCredito = ({ creditos, totales_por_credito }) => {
    const data = {
        labels: creditos, // Tipos de crédito
        datasets: [
            {
                label: 'Ventas (C$)',
                data: totales_por_credito, // Total de ventas por crédito
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
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
                    text: 'Tipos de Crédito',
                },
            },
        },
    };

    return (
        <Card className="h-100">
            <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-3">Ventas por Crédito</Card.Title>
                <div className="flex-grow-1" style={{ position: "relative" }}>
                    <Bar data={data} options={options} />
                </div>
            </Card.Body>
        </Card>
    );
};
export default VentasPorCredito;
