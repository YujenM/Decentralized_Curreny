import React, {  useState, useRef } from "react";
import UserContext from "./Usercontext";

const UserState = (props) => {
    // const host = "http://localhost:2000";
    const host ="https://decentralized-curreny.onrender.com"
    const markdata=[]
    const [state, setState] = useState(markdata);
    const [analysisData, setAnalysisData] = useState([]);
    const[analysisdatabyid,setgetanalysisdatabyid]=useState([]);
    const[chartdata,setchartdata]=useState([]);
    const[tabledata,setTabledata]=useState([]);
    
    const hasFetchedData = useRef(false);
    // get user information
    const getUser = async () => {
        const authToken = localStorage.getItem('authtoken');
        
        if (!authToken) {
            console.log("No token found. Redirecting to login.");
            return;
        }
        
        try {
            const response = await fetch(`${host}/api/auth/getuser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error}`);
            }

            const json = await response.json();
            setState(json.user); 
        } catch (err) {
            console.log("Error: " + err.message);
            if (err.message.includes("401")) {
                alert("Session expired, please log in again.");
            }
        }
    };

    //  get currency id symbol and image

    const getanalysisdata = async () => {
        try {
            const response = await fetch(`${host}/api/coincrypto/getanalysisdata`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error}`);
            }

            const json = await response.json();
            if (json) {
                setAnalysisData(json); 
            }

            hasFetchedData.current = true;
        } catch (err) {
            console.log("Error: " + err.message);
        }
    };

    // get currency data by id name symbol image discription url and rank
    const getanalysisdatabyid= async(id)=>{
        try{
            const response=await fetch(`${host}/api/getcoincryptoprice/getanalysiscryptodata/${id}`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
            if(!response.ok){
                const errorData=await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error}`);
            }
            const json =await response.json();
            if(json){
                setgetanalysisdatabyid(json);
            }
    
        }catch(err){
            console.log("Error: " + err.message);
        }
    
    }

    // get currecydata for chart data 
    const getchartdata = async () => {
        try {
          const response = await fetch(`${host}/api/getcoincryptoprice/allcurrencychartdata`); // Correct template string and added 'await'
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error}`);
            }
            
            const json = await response.json();
            if (json) {
                setchartdata(json);
            }
            
            } catch (err) {
            console.log("Error: " + err.message);
            }
        };
    // get currency data for table data
    const gettabledata=async()=>{
        try{
            const response=await fetch(`${host}/api/getcoincryptoprice/alltabledata`);
            if(!response.ok){
                const errorData=await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error}`);
            }
            const json=await response.json();
            if(json){
                setTabledata(json);
            }

        }catch(err){
            console.log("Error: " + err.message);
        }
    }
    


    return (
        <UserContext.Provider value={{ state,analysisData,analysisdatabyid,chartdata,tabledata,getUser, getanalysisdata,getanalysisdatabyid,getchartdata,gettabledata}}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserState;
