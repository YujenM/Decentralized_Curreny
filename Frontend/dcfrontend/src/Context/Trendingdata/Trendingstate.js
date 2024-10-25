import React,{useState} from "react";
import Trendingcontext from './Trendingcontext';

const Trendingstate = (props) => {
    const host = "http://localhost:2000";
    const [trendingdata, setTrendingdata] = useState([]);
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
    return (
        <Trendingcontext.Provider value={{trendingdata ,gettrendingdata }}>
            {props.children}
        </Trendingcontext.Provider>
    );
}

export default Trendingstate;