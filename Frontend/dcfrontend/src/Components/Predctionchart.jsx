import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function PredictionChart() {
    const [predictionData, setPredictionData] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState('Bitcoin');

    // Wrap the cryptos array in useMemo to prevent unnecessary re-renders
    const cryptos = useMemo(() => [
        { name: 'Bitcoin', value: 'Qwsogvtv82FCd' },
        { name: 'Ethereum', value: 'razxDUgYGNAdQ' },
        { name: 'Polkadot', value: '25W7FG7om'},
        { name: 'Litecoin', value: 'D7B1x_ks7WhV5' },
        { name: 'Avalanche', value: 'dvUj0CzDZ' },
    ], []); 

    const fetchPredictionData = async (uuid) => {
        try {
            const host = "https://decentralized-curreny.onrender.com" || "http://localhost:2000";
            const response = await fetch(`${host}/Markapi/Prediction/getcryptopredictiondata/${uuid}`);
            const data = await response.json();

            if (data?.status === 'success' && Array.isArray(data.data[0]?.PredictionPrice)) {
                const cleanData = data.data[0].PredictionPrice.map(Number);
                setPredictionData(cleanData);
            } else {
                throw new Error('Invalid data format from API');
            }
        } catch (err) {
            console.error('Error fetching data:', err.message);
        }
    };

    useEffect(() => {
        const selectedCryptoUUID = cryptos.find((crypto) => crypto.name === selectedCrypto)?.value;
        if (selectedCryptoUUID) {
            fetchPredictionData(selectedCryptoUUID);
        }
    }, [selectedCrypto, cryptos]); // Added cryptos to dependency array

    const handleCryptoChange = (cryptoName) => {
        setSelectedCrypto(cryptoName);
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: '#FFFFFF', borderRadius: '8px' }}>
            <div>
                <label style={{ marginRight: '10px' }}>Select Cryptocurrency:</label>
                <select
                    value={selectedCrypto}
                    onChange={(e) => handleCryptoChange(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', color: 'black' }}
                >
                    {cryptos.map((crypto) => (
                        <option key={crypto.value} value={crypto.name}>
                            {crypto.name}
                        </option>
                    ))}
                </select>
            </div>

            {predictionData.length > 0 ? (
                <Line
                    data={{
                        labels: predictionData.map((_, i) => {
                            const today = new Date();
                            const tomorrow = new Date(today);
                            tomorrow.setDate(today.getDate() + 1); // Start from tomorrow
                            const date = new Date(tomorrow);
                            date.setDate(tomorrow.getDate() + i); // Add i days to tomorrow
                            return date.toLocaleDateString();
                        }),
                        datasets: [
                            {
                                label: `Predicted Price (USD)`,
                                data: predictionData,
                                fill: false,
                                borderColor: '#00FFFF',
                                borderWidth: 2,
                                pointBackgroundColor: '#00FFFF',
                                pointRadius: 4,
                                tension: 0.3,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        scales: {
                            x: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)',
                                },
                                ticks: {
                                    color: '#FFFFFF',
                                },
                            },
                            y: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)',
                                },
                                ticks: {
                                    color: '#FFFFFF',
                                },
                            },
                        },
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    color: '#FFFFFF',
                                },
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                titleColor: '#FFFFFF',
                                bodyColor: '#FFFFFF',
                            },
                        },
                    }}
                />
            ) : (
                <p>Loading data or no data available.</p>
            )}
        </div>
    );
}

export default PredictionChart;
