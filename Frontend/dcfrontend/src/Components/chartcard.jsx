import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import '../Css/chartcard.css';

// Registering the required plugins, including 'Filler'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function ChartCard({ cryptoName, price, percentageChange, sparklineData = [], iconUrl }) {
    const data = {
        labels: sparklineData.map(() => ''),  // Empty labels for each data point
        datasets: [
            {
                label: 'Price',
                data: sparklineData,
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                fill: true,
                tension: 0.3,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { display: false },
            y: { display: false }
        },
        plugins: {
            legend: { display: false }
        }
    };

    return (
        <div className="chartcontainer">
            <div className="chart-card">
                <div className="card-header">
                    <div className="icon">
                        <img src={iconUrl} alt="crypto" />
                    </div>
                    <div className="info">
                        <p className="c_name">{cryptoName}</p>
                        <p className="c_price">${price}</p>
                        <p className={`percentage ${percentageChange >= 0 ? 'positive' : 'negative'}`}>
                            {percentageChange >= 0 ? '+' : ''}{percentageChange}(24h)
                        </p>
                    </div>
                </div>
                <div className="chart-container">
                    {sparklineData.length > 0 ? (
                        <Line data={data} options={options} />
                    ) : (
                        <p>No data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChartCard;
