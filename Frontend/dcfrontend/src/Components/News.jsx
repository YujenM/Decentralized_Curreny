import React, { useEffect, useContext, useRef } from 'react';
import UserContext from '../Context/news/Usercontext';
import '../Css/Dashnews.css';
import { useNavigate } from 'react-router-dom';

function News() {
    const { news, getNews } = useContext(UserContext);
    const hasFetchedData = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasFetchedData.current) {
            getNews();
            hasFetchedData.current = true;
        }
        // console.log(news);
    }, [getNews, news]);

    // Function to handle click on a news item
    const handleNewsClick = (newsId) => {
        navigate('/dashboard/News', { state: { newsId } });
        // console.log("Clicked news ID:", newsId);
    };

    return (
        <div className='Dashnews'>
            <div className='dashdiv'>
                <h1 className='dashnewstitle'>Latest News</h1>
                {
                    news && Array.isArray(news) ? (
                        news.map((newsItem, index) => (
                            <div
                                className='newscontainer'
                                key={index}
                                onClick={() => handleNewsClick(newsItem.NEWS)} 
                            >
                                <p className='newsdate'>{newsItem.timeAgo}</p>
                                <p className='newstitle ml-4'>{newsItem.NewsTitle}</p>
                            </div>
                        ))
                    ) : (
                        <div className='newscontainer'>
                            <p className='newsdate'>20h ago</p>
                            <p className='newstitle ml-4'>Coinbase to Launch Crypto App Store, Focused on Web3</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default News;
