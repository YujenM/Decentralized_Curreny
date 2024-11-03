import React from 'react';
import '../Css/Portfoliocard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Portfoliocard({ data, onDelete }) {
    const { UUID, Crypto_Name, Price, Crypto_image, "24HVolume": volume24H, numberofexchanges } = data;

    return (
        <div className='portfoliocard'>
            <div className='heading flex justify-between'>
                <div className='cardname flex items-center'>
                    <img className='portfolioimg' src={Crypto_image} alt='crypto' />
                    <h3 className='cryptotitle ml-2'>{Crypto_Name}</h3>
                </div>
                <div className="deletebtn">
                    <button onClick={() => onDelete(UUID)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
            <div className='cryptocontent container  ml-3'>
                <div className="price">
                            <h4 className='Pcardtitle'>Price</h4>
                            <p className='pricevalue'>${Price.slice(0, 6)}</p>
                        </div>
                <div className="price">
                    <h4 className='Pcardtitle'>24H Volume</h4>
                    <p className='pricevalue'>${volume24H}</p>
                </div>
                <div className="price">
                    <h4 className='Pcardtitle'>Exchanges</h4>
                    <p className='pricevalue'>{numberofexchanges}</p>
                </div>
                </div>
        </div>
    );
}

export default Portfoliocard;
