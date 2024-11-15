import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../Css/analysisdetais.css';
import UserContext from '../Context/User/Usercontext';
import { useNavigate } from 'react-router-dom';
// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icon from '@fortawesome/free-solid-svg-icons';
import Spinner from '../Components/Spinner';

function AnalysisDetails(props) {
  const location = useLocation();
  const { uuid } = location.state || {};
  const { analysisdatabyid, getanalysisdatabyid } = useContext(UserContext);
  const hasFetchedData = useRef(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasFetchedData.current && uuid) {
      setLoading(true); // Start spinner before fetching data
      getanalysisdatabyid(uuid).then(() => setLoading(false)); // Stop spinner after fetching data
      hasFetchedData.current = true;
    }
  }, [getanalysisdatabyid, uuid]);

  const handlebackclick = () => {
    navigate('/dashboard');
  };

  const addtoportfolio = async () => {
    const host = "https://decentralized-curreny.onrender.com";
    const authToken = localStorage.getItem('authtoken');
    if (!authToken) {
      console.log("No token found. Redirecting to login.");
      return;
    }
    try {
      const response = await fetch(`${host}/Markapi/Portfolio/addcryptoportfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        },
        body: JSON.stringify({
          cryptoUUID: uuid,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        props.Displayalert(errorData.message, "Danger", "faExclamation");
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message}`);
      }
      const json = await response.json();
      if (json) {
        props.Displayalert(json.message, "Check", "faCheck");
      }
    } catch (err) {
      console.log("Error: " + err.message);
    }
  };

  return (
    <div className='container analysisbg'>
      <div className='backbtn'>
        <button onClick={handlebackclick}><FontAwesomeIcon icon={icon.faArrowLeft} /></button>
      </div>
      <h1 className='AnalysisDetailtitle text-center'>Analysis Details</h1>
      {loading ? (
        <div className="spinner-container">
          <Spinner />
          {/* <p>Loading data, please wait...</p> */}
        </div>
      ) : uuid ? (
        <>
          {analysisdatabyid && analysisdatabyid.length > 0 ? (
            analysisdatabyid.map((item, index) => (
              <div className='analysisdata' key={index}>
                <div className='flex justify-center align-center'>
                  <img src={item.Crypto_image} alt={item.Crypto_Name} />
                </div>
                <p className='text-center analysistitle'>{item.Crypto_Name} ({item.Crypto_Symbol})</p>
                <p className='text-center mt-3 analysisdescription'>{item.Crypto_Discription}</p>
                <p className='text-center mt-3 analysisRank'>Rank: {item.Crypto_Rank}</p>
                <div className='analyisbtn'>
                  <button><a href={item.Crypto_Websiteurl}>Learn More <FontAwesomeIcon icon={icon.faChevronRight} /></a></button>
                </div>
                <div className='analyisbtn pb-5'>
                  <button onClick={addtoportfolio}>Add to Portfolio <FontAwesomeIcon icon={icon.faChevronRight} /></button>
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
