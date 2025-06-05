import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Registra los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const VentasPorDia = ({ dias, totales_por_dia }) => {
    const data = {
        labels: dias, // Ahora recibe días en lugar de meses
        datasets: [
            {
                label: 'Ventas por día (C$)',
                data: totales_por_dia, // Total de ventas por día
                backgroundColor: 'rgba(153, 102, 255, 0.2)', // Cambio de color a morado
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (context) => `C$ ${context.raw.toLocaleString()}` // Formato monetario en tooltips
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Córdobas (C$)',
                },
                ticks: {
                    callback: (value) => `C$ ${value.toLocaleString()}` // Formato monetario en eje Y
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Días', // Cambiado de "Meses" a "Días"
                },
            },
        }
    };

    return (
        <Card className="h-100">
            <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-3">Ventas por día</Card.Title> {/* Título actualizado */}
                <div className="flex-grow-1" style={{ position: "relative" }}>
                    <Bar
                        data={data}
                        options={options}
                    />
                </div>
            </Card.Body>
        </Card>
    );
};

export default VentasPorDia;