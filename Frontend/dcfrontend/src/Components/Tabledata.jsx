import React, { useEffect, useContext, useRef } from 'react';
import UserContext from '../Context/User/Usercontext';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../Css/dashboardtable.css';

function Tabledata() {
  const { tabledata, gettabledata } = useContext(UserContext);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (!hasFetchedData.current) {
      gettabledata();
      hasFetchedData.current = true;
    }
    // console.log(tabledata);
  }, [gettabledata, tabledata]);

  return (
    <div className="table-container">
      <Table className='crypto-table'>
      <Thead>
        <Tr>
          <Th>Crypto Rank</Th>
          <Th>Price</Th>
          <Th>Stock Exchange</Th>
          <Th>Market Cap</Th>
          <Th>Currency</Th>
        </Tr>
      </Thead>
      <Tbody>
        {tabledata &&  tabledata.status==="success" && Array.isArray(tabledata.data) ? (
          tabledata.data.map((crypto, index) => (
            <Tr key={index}>
    
              <Td>{crypto.Crypto_Name}</Td>
              <Td>{crypto.Price.slice(0,8)}</Td>
              <Td>{crypto.numberofexchanges}</Td>
              <Td>{crypto.marketcap.slice(0,5)}</Td>
              <Td>{crypto.Currency}</Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={4}>No data found</Td>
          </Tr>
        )

        }
      </Tbody>
    </Table>
    </div>
  );
}

export default Tabledata;
