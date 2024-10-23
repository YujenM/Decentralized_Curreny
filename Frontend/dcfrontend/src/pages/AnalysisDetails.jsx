import React, { useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../Css/analysisdetais.css';
import UserContext from '../Context/User/Usercontext';
import { useNavigate } from 'react-router-dom';
// font awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icon from '@fortawesome/free-solid-svg-icons';

function AnalysisDetails() {
  const location = useLocation();
  const { uuid } = location.state || {};
  const { analysisdatabyid, getanalysisdatabyid } = useContext(UserContext);
  const hasFetchedData = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasFetchedData.current && uuid) {
      getanalysisdatabyid(uuid);
      hasFetchedData.current = true;
    }
  }, [getanalysisdatabyid, uuid]);

  const handlebackclick=()=>{
    navigate('/dashboard');
  }

  return (
    <div className='container analysisbg'>
      <div className='backbtn'>
        <button onClick={handlebackclick}><FontAwesomeIcon icon={icon.faArrowLeft} /></button>
      </div>
  
      <h1 className='AnalysisDetailtitle text-center'>Analysis Details</h1>
      {uuid ? (
        <>
          {analysisdatabyid && analysisdatabyid.length > 0 ? (
            analysisdatabyid.map((item, index) => (
              <div className='analysisdata' key={index}>
                <div className='flex justify-center align-center'>
                  <img src={item.Crypto_image} alt={item.Crypto_Name} />
                </div>
                <p className='text-center analysistitle'>{item.Crypto_Name }({item.Crypto_Symbol})</p>
                <p className='text-center mt-3 analysisdescription'> {item.Crypto_Discription}</p>
                <p className='text-center mt-3 analysisRank'>Rank: {item.Crypto_Rank}</p>
                <div className='analyisbtn'>
                  <button ><a href={item.Crypto_Websiteurl}>Learn More <FontAwesomeIcon icon={icon.faChevronRight} /></a></button>
                </div>
              </div>
              
            ))
          ) : (
            <p>No analysis data available.</p>
          )}
        </>
      ) : (
        <p>No UUID passed.</p>
      )}
    </div>
  );
}

export default AnalysisDetails;
