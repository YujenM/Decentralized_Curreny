import { useState } from "react";
import UserContext from "./Usercontext";



const UserState = (props) => {
    
    const host = "http://localhost:2000";
    const UserInitial = [];
    const [state, setState] = useState(UserInitial);
    

    // Get user
    const getUser = async () => {
        const authToken = localStorage.getItem('authtoken');
        
        if (!authToken) {
            console.log("No token found. Redirecting to login.");
            return;
        }
    
        try {
            const response = await fetch(`${host}/api/auth/getuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const json = await response.json();
            setState(json);
        } catch (err) {
            console.log("Error: " + err.message);
            if (err.message.includes("401")) {
                alert("Session expired, please log in again.");
                console.log(authToken)
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
