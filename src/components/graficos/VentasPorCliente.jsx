import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const VentasPorCliente = ({ clientes, totales_por_cliente }) => {
    const data = {
        labels: clientes, // Nombres de los clientes
        datasets: [
            {
                label: 'Ventas (C$)',
                data: totales_por_cliente, // Total de ventas por cliente
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
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
                    text: 'Clientes',
                },
            },
        },
    };

    return (
        <Card className="h-100">
            <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-3">Ventas por Cliente</Card.Title>
                <div className="flex-grow-1" style={{ position: "relative" }}>
                    <Bar data={data} options={options} />
                </div>
            </Card.Body>
        </Card>
    );
};
export default VentasPorCliente;
