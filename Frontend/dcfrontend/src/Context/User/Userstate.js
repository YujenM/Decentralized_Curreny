import { useState } from "react";
import UserContext from "./Usercontext";

const UserState = (props) => {
    const host = "http://localhost:2000";
    const [state, setState] = useState(null);
    
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
            console.log(json); 
            setState(json.user); 
        } catch (err) {
            console.log("Error: " + err.message);
            if (err.message.includes("401")) {
                alert("Session expired, please log in again.");
            }
        }
    };

    return (
        <UserContext.Provider value={{ state, getUser }}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserState;
