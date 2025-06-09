import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const VentasPorProducto = ({ productos, totales_por_producto }) => {
    const data = {
        labels: productos, // Nombres de los productos
        datasets: [
            {
                label: 'Ventas (C$)',
                data: totales_por_producto, // Total de ventas por producto
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
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
                    text: 'Productos',
                },
            },
        },
    };

    return (
        <Card className="h-100">
            <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-3">Ventas por Producto</Card.Title>
                <div className="flex-grow-1" style={{ position: "relative" }}>
                    <Bar data={data} options={options} />
                </div>
            </Card.Body>
        </Card>
    );
};
export default VentasPorProducto;
