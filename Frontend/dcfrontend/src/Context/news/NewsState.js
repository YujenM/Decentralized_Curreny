import React, { useState } from "react";
import UserContext from './Usercontext';

const NewsState = (props) => {
    // const host = "http://localhost:2000";
    const host ="https://decentralized-curreny.onrender.com"
    const [news, setNews] = useState([]);
    const[deatilednews,setDeatilednews]=useState([]);

    const getNews = async () => {
        try {
            const response = await fetch(`${host}/Markapi/News/getlatestnews/40`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorData.error}`);
            }

            const json = await response.json();
            setNews(json);
        } catch (err) {
            console.error("Error:", err.message);
        }
    };
    const getnewsbyid=async(id)=>{
        try{
            const response=await fetch(`${host}/Markapi/News/getnewsbyid/${id}`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            });
            if(!response.ok){
                const errorData=await response.json();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorData.error}`);
            }
            const json=await response.json();
            if(json){
                setDeatilednews(json);
            }
        }catch(err){
            
        }
    }

    return (
        <UserContext.Provider value={{ news, deatilednews,getNews, getnewsbyid}}>
            {props.children}
        </UserContext.Provider>
    );
};

export default NewsState;
