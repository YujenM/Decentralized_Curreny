import React from 'react';
import '../Css/Portfoliocard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Portfoliocard({ data, onDelete }) {
    const {UUID, Crypto_Name, Price } = data;

    return (
        <div className='portfoliocard'>
        <div className='heading flex justify-between'>
            <div className='cardname flex items-center'>
            <h3 className='cryptotitle mt-3 ml-2'>{Crypto_Name}</h3>
            </div>
            <div className="deletebtn">
            <button onClick={()=>{onDelete(UUID)}}>
                <FontAwesomeIcon icon={faTrash} />
            </button>
            </div>
        </div>
        <div className='cryptocontent flex mt-3 ml-3'>
            <div className="price">
            <p className='pricevalue'>${Price.slice(0,8)}</p>
            </div>
        </div>
        </div>
    );
}

export default Portfoliocard;
