import React, { useEffect, useRef, useState, useContext } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../Css/Prediction.css';
import UserContext from '../Context/Trendingdata/Trendingcontext';
import Spinner from '../Components/Spinner';
import Predictionchart from '../Components/Predctionchart';

function Analysis() {
    const { getprediction, getpredictiondata } = useContext(UserContext);
    const hasFetchedData = useRef(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!hasFetchedData.current) {
            setLoading(true);
            getpredictiondata().finally(() => setLoading(false)); 
            hasFetchedData.current = true;
        }
    }, [getprediction, getpredictiondata]);

    return (
        <div className='dashboard-container'>
            <div className='dashboard-content'>
                <div className='flex justify-center'>
                    <h2 className='predictionheading'>Coin Prediction</h2>
                </div>
                {loading ? (
                    <Spinner /> 
                ) : getprediction && getprediction.success ? (
                    <Table className='crypto-table'>
                        <Thead>
                            <Tr>
                                <Th>Crypto Coin</Th>
                                <Th>Price</Th>
                                <Th>1D</Th>
                                <Th>2D</Th>
                                <Th>3D</Th>
                                <Th>4D</Th>
                                <Th>5D</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {Object.keys(getprediction.data).map((coin) => {
                                const coinData = getprediction.data[coin][0];
                                return (
                                    <Tr key={coinData.UUID}>
                                        <Td>{coin.charAt(0).toUpperCase() + coin.slice(1)}</Td>
                                        <Td>{parseFloat(coinData.Price).toFixed(2)}</Td>
                                        {coinData.PredictionPrice.map((price, index) => (
                                            <Td key={index}>{parseFloat(price).toFixed(2)}</Td>
                                        ))}
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                ) : (
                    <p>No data available</p>
                )}
            </div>
            <div>
                  <Predictionchart />
            </div>
        </div>
    );
}

export default Analysis;
