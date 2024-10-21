import React from 'react';
import '../Css/Analysis.css';

function Analysisdatacar(props) {
  // console.log("Image URL:", props.cryptoimage);
  return (
    <div className='Analysisdatacarmain'>
        <div>
        <div className="grid grid-cols-2 gap-1 ">
            <div className="currencyimage">
                <img src={props.cryptoimage} alt={`${props.symbol} logo`} /> {/* Ensure correct prop usage */}
            </div>
            <div className="currencysymbol">{props.symbol}</div>
        </div>
        </div>
    </div>
  );
}

export default Analysisdatacar;
