import React, { useEffect, useContext, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icon from '@fortawesome/free-solid-svg-icons';
import '../Css/Dashnews.css';
import UserContext from '../Context/news/Usercontext';
import Spinner from '../Components/Spinner';

function Detailenews() {
    const { deatilednews, getnewsbyid } = useContext(UserContext);
    const [loading, setLoading] = useState(true); 
    const hasFetchedData = useRef(false);

    const location = useLocation();
    const { newsId } = location.state || {};
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasFetchedData.current && newsId) {
            getnewsbyid(newsId).then(() => setLoading(false)); // Set loading to false after data is fetched
            hasFetchedData.current = true;
        }
    }, [getnewsbyid, newsId]);

    const handlebackclick = () => {
        navigate('/dashboard');
    };

    return (
        <div className='container'>
            <div className='backbtn'>
                <button onClick={handlebackclick}>
                    <FontAwesomeIcon icon={icon.faArrowLeft} />
                </button>
            </div>
            {loading ? (
                <div className='spinner-container'>
                    <Spinner />
                    <p>Loading news data, please wait...</p>
                </div>
            ) : deatilednews && deatilednews.length > 0 ? (
                deatilednews.map((item, index) => (
                    <div className='newsdata' key={index}>
                        <h1 className='Dnewstitle text-center mb-5'>News Details</h1>
                        <div className='Dnewsimg flex justify-center align-center'>
                            <img src={item.Tumbnail} alt={item.title} />
                        </div>
                        <p className='text-center Dnewsheading mt-5'>{item.NewsTitle}</p>
                        <p className='text-center mt-3 Dnewsdescription'>{item.NewDescription}</p>
                        <div className='Dnewsbtn'>
                            <button>
                                <a href={item.NewsUrl}>Read More <FontAwesomeIcon icon={icon.faChevronRight} /></a>
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No news data available.</p>
            )}
        </div>
    );
}

export default Detailenews;
