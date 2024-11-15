import React, { useContext, useRef, useEffect, useState } from 'react';
import '../Css/Dashboard.css';
import Analysisdata from '../Components/Analysisdata';
import Portfoliocard from '../Components/Portfoliocard';
import News from '../Components/News';
import UserContext from '../Context/Trendingdata/Trendingcontext';

function Portfolio(props) {
    const { getportfolio, getportfoliodata } = useContext(UserContext);
    const [portfolioData, setPortfolioData] = useState([]);
    const hasFetchedData = useRef(false);

    const handledeletecard = async (uuid) => {
        const authToken = localStorage.getItem('authtoken');
        // const host = "http://localhost:2000";
        const host ="https://decentralized-curreny.onrender.com";
        const response = await fetch(`${host}/Markapi/Portfolio/deletecrypto`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authToken,
            },
            body: JSON.stringify({ cryptoUUID: uuid }),
        });
        
        if (!response.ok) {
            console.log('Failed to delete');
            props.Displayalert('Failed to delete', 'Danger', 'faExclamation');
        } else {
            getportfoliodata();
            // setPortfolioData(portfolioData.filter((data) => data.uuid !== uuid));
            props.Displayalert('Deleted successfully', 'Check', 'faCheck');
        }
    };

    useEffect(() => { 
        if (!hasFetchedData.current) {
            getportfoliodata();
            hasFetchedData.current = true;
        }
    }, [getportfoliodata]);

    useEffect(() => {
        if (getportfolio.success === true ) {
            setPortfolioData(getportfolio.data);  // Initialize portfolioData with fetched data
        }
    }, [getportfolio]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-content"> 
                <div>
                    <Analysisdata heading={"Portfolio"} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="mainprotfoliocard">
                        {
                            portfolioData.length > 0 ? (
                                portfolioData.map((data, index) => (
                                    <Portfoliocard key={index} data={data} onDelete={handledeletecard} />
                                ))
                            ) : (
                                <div className="flex justify-center items-center h-64">
                                    <h1 className="text-2xl text-gray-500">Add Coin to your portfolio</h1>
                                </div>
                            )
                        }
                    </div>
                    <div>   
                        <News />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Portfolio;
