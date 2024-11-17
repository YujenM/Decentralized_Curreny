import React,{useState} from "react";
import Trendingcontext from './Trendingcontext';

const Trendingstate = (props) => {
    // const host = "http://localhost:2000";
    const host ="https://decentralized-curreny.onrender.com"?"https://decentralized-curreny.onrender.com":"http://localhost:2000";
    const [trendingdata, setTrendingdata] = useState([]);
    const authToken = localStorage.getItem('authtoken');
    const [getportfolio,setgetportfolio]=useState([]);
    const gettrendingdata=async(crypto,time)=>{
        try{

            const response=await fetch(`${host}/api/getcoincryptoprice//trendingdata/${crypto}/${time}`)
            if(!response.ok){
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error}`);
            }
            const json = await response.json();
            if(json){
                setTrendingdata(json);
            }
        }catch(err){
            console.log("Error: " + err.message);
        }
    }
    const getportfoliodata = async () => {
        try {
            const response = await fetch(`${host}/Markapi/Portfolio/getcrypto`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken,
                },
            });
    
            if (!response.ok) {
                if (response.status === 404) {
                    console.log('No portfolio data found');
                    setgetportfolio({ success: false, data: [] });
                    return;
                }
    
                const errorData = await response.json();
                console.log(errorData.error || 'Failed to fetch portfolio data');
                return;
            }
    
            const json = await response.json();
            setgetportfolio(json);
        } catch (error) {
            console.log('An error occurred:', error.message);
        }
    };
    return (
        <Trendingcontext.Provider value={{trendingdata,getportfolio ,gettrendingdata ,getportfoliodata}}>
            {props.children}
        </Trendingcontext.Provider>
    );
}

export default Trendingstate;