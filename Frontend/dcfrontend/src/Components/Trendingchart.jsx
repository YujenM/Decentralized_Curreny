import React, { useContext, useState, useRef, useEffect } from 'react';
import '../Css/trending.css';
import { Line } from 'react-chartjs-2';
import UserContext from '../Context/Trendingdata/Trendingcontext';
import Spinner from './Spinner';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function Trendingchart() {
    const { trendingdata, gettrendingdata } = useContext(UserContext);
    const hasFetchedData = useRef(false);
    const [selectedCrypto, setSelectedCrypto] = useState('Bitcoin');
    const [analysitime, SetAnalysistime] = useState('24H');
    const [activeButton, setActiveButton] = useState('24h');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        hasFetchedData.current = false;
    }, [selectedCrypto, analysitime]);

    useEffect(() => {
        if (!hasFetchedData.current) {
            setLoading(true); // Show spinner before fetching data
            gettrendingdata(selectedCrypto, analysitime).then(() => setLoading(false)); 
            hasFetchedData.current = true;
        }
    }, [gettrendingdata, selectedCrypto, analysitime]);

    const cryptos = [
        { name: 'Bitcoin', value: 'BTC', imgSrc: 'https://cdn.coinranking.com/bOabBYkcX/bitcoin_btc.svg' },
        { name: 'Ethereum', value: 'ETH', imgSrc: 'https://cdn.coinranking.com/rk4RKHOuW/eth.svg' },
        { name: 'Polkadot', value: 'DOT', imgSrc: 'https://cdn.coinranking.com/V3NSSybv-/polkadot-dot.svg' },
        { name: 'Litecoin', value: 'LTC', imgSrc: 'https://cdn.coinranking.com/BUvPxmc9o/ltcnew.svg' },
        { name: 'Avalanche', value: 'Avax', imgSrc: 'https://cdn.coinranking.com/S0C6Cw2-w/avax-avalanche.png' },
    ];

    const handleSelect = (crypto) => {
        setSelectedCrypto(crypto);
    };

    const handleButtonClick = (time) => {
        SetAnalysistime(time);
        setActiveButton(time);
    };

    return (
        <div className='Trendingchart'>
            {loading ? (
                <div className="spinner-container">
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className='flex justify-between w-full mt-2 check'>
                        <div className='custom-dropdown'>
                            <div className='dropdown-header'>
                                <img src={cryptos.find(c => c.name === selectedCrypto).imgSrc} alt={selectedCrypto} />
                                {selectedCrypto}
                            </div>
                            <div className='dropdown-content'>
                                {cryptos.map((crypto) => (
                                    <div key={crypto.value} className='dropdown-item' onClick={() => handleSelect(crypto.name)}>
                                        <img src={crypto.imgSrc} alt={crypto.name} />
                                        {crypto.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='flex justify-between w-80'>
                            <button
                                className={`Analysisbtn ${activeButton === '24h' ? 'active' : ''}`}
                                onClick={() => handleButtonClick('24h')}
                            >
                                24h
                            </button>
                            <button
                                className={`Analysisbtn ${activeButton === '7d' ? 'active' : ''}`}
                                onClick={() => handleButtonClick('7d')}
                            >
                                7d
                            </button>
                            <button
                                className={`Analysisbtn ${activeButton === '30d' ? 'active' : ''}`}
                                onClick={() => handleButtonClick('30d')}
                            >
                                30d
                            </button>
                        </div>
                    </div>
                    <div className='mt-5'>
                        {trendingdata.status === "success" && trendingdata.data && trendingdata.data[0]?.Sparklingline ? (
                            <Line
                                data={{
                                    labels: Array.from({ length: trendingdata.data[0].Sparklingline.filter(item => item !== null).length }, (_, i) => `${i + 1}`),
                                    datasets: [
                                        {
                                            label: `Price $${trendingdata.data[0].Price.slice(0,8)} (USD)`,
                                            data: trendingdata.data[0].Sparklingline.filter(item => item !== null),
                                            fill: true,
                                            backgroundColor: 'rgba(75,192,192,0.2)',
                                            borderColor: 'rgba(75,192,192,1)',
                                            tension: 0.4,
                                        },
                                    ],
                                }}
                                height={500}
                                width={600}
                                options={{
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: { display: true },
                                        y: { display: true },
                                    },
                                    plugins: {
                                        legend: { display: true },
                                    },
                                }}
                            />
                        ) : (
                            <p>There is no data</p>
                        )}
                    </div>
                    <div className='trendingtabletable mt-5'>
                        {trendingdata.status === "success" && trendingdata.data ? (
                            <div>
                                <div className=' trendingdata flex justify-between m-2'>
                                    <h5>Crypto Name</h5>
                                    <p>{trendingdata.data[0].Crypto_Name}</p>
                                </div>
                                <div className='trendingdata flex justify-between m-2'>
                                    <h5>Crypto Price</h5>
                                    <p>{trendingdata.data[0].Price.slice(0,8)}</p>
                                </div>
                                <div className='trendingdata flex justify-between m-2'>
                                    <h5>Number of Markets</h5>
                                    <p>{trendingdata.data[0].numberofmarkets}</p>
                                </div>
                                <div className='trendingdata flex justify-between m-2'>
                                    <h5>Number of Exchanges</h5>
                                    <p>{trendingdata.data[0].numberofexchanges}</p>
                                </div>
                                <div className='trendingdata flex justify-between m-2'>
                                    <h5>24H Volume</h5>
                                    <p>{trendingdata.data[0]['24HVolume'].slice(0,8)}</p>
                                </div>
                                <div className='trendingdata flex justify-between m-2'>
                                    <h5>MarketCap</h5>
                                    <p>{trendingdata.data[0].marketcap}</p>
                                </div>
                                <div className='trendingdata flex justify-between m-2'>
                                    <h5>DMarketCap</h5>
                                    <p>{trendingdata.data[0].Dmarketcap}</p>
                                </div>
                                <div className='trendingdata flex justify-between m-2'>
                                    <h5>Crypto Change</h5>
                                    <p>{trendingdata.data[0].cryptoChange}</p>
                                </div>
                            </div>
                        ) : (
                            <p>There is no data</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Trendingchart;
