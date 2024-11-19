import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../Css/Prediction.css';
function Analysis() {
  return (
    <div className='dashboard-container'>
        <div className='dashboard-content'>
            <div className='flex justify-center'>
            <h2 className='predictionheading'>Coin Prediction</h2>
            </div>
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
                    <Tr>
                        <Td>Bitcoin</Td>
                        <Td>92189.31</Td>
                        <Td>91856.3</Td>
                        <Td>92463.2</Td>
                        <Td>93652</Td>
                        <Td>94025.2</Td>
                        <Td>94425.8</Td>
                    </Tr>
                    
                </Tbody>
                <Tbody>
                    <Tr>
                        <Td>Etherium</Td>
                        <Td>3141.355</Td>
                        <Td>3256.55</Td>
                        <Td>3150.78</Td>
                        <Td>3269.30</Td>
                        <Td>3310.85</Td>
                        <Td>3398.3</Td>
                    </Tr>
                    
                </Tbody>
                <Tbody>
                    <Tr>
                        <Td>Avalanche</Td>
                        <Td>35.44214</Td>
                        <Td>35.22365</Td>
                        <Td>35.6523</Td>
                        <Td>35.8576</Td>
                        <Td>34.326</Td>
                        <Td>35.4856</Td>
                    </Tr>
                    
                </Tbody>
                <Tbody>
                    <Tr>
                        <Td>Polkadot</Td>
                        <Td>5.822857</Td>
                        <Td>5.62585</Td>
                        <Td>5.62485</Td>
                        <Td>5.75695</Td>
                        <Td>5.85462</Td>
                        <Td>5.89652</Td>
                    </Tr>
                    
                </Tbody>
                <Tbody>
                    <Tr>
                        <Td>Litecoin</Td>
                        <Td>90.3988</Td>
                        <Td>91.2563</Td>
                        <Td>90.3665</Td>
                        <Td>90.7562</Td>
                        <Td>91.2548</Td>
                        <Td>93.5545</Td>
                    </Tr>
                    
                </Tbody>
                
                </Table>
        </div>
    </div>
  )
}

export default Analysis