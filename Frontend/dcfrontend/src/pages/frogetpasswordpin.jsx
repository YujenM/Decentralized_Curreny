import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Css/forgetpass.css';
import Marklogo from '../Images/logo.png';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import * as icon from "@fortawesome/free-solid-svg-icons";

function ForgetPasswordPin(props) {
    const navigate=useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const [pin, setPin] = useState(["", "", "", ""]);
    const inputRefs = useRef([]);


    const handleChange = (value, index) => {
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Move to the next input if a digit is entered
        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Backspace: move to the previous input if empty
        if (e.key === "Backspace" && !pin[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const pinNumber = pin.join('');
        // console.log(pinNumber);
        // const host = "http://localhost:2000";
        const host ="https://decentralized-curreny.onrender.com";
        const response = await fetch(`${host}/api/auth/verify-reset-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, code: pinNumber })
        });

        const json = await response.json();
        if (!response.ok) {
            props.Displayalert("Invalid Code", "Danger", "faExclamation");
            return;
        }
        if (json.success) {
            navigate('/changepassword', { state: { email, pin: pinNumber } });
            props.Displayalert(json.message, "Check", "faCheck");
        }
    }

    return (
        <div className='forgetpasswordmain'>
            <div className='fogetpassbg'>
                <div className='forgetpasscontainer'>
                    <div className="logo">
                        <img src={Marklogo} alt='logo' />
                        <br />
                        <h5>M.A.R.K</h5>
                    </div>
                    <div className="forgetpassform">
                        <h1 className='text-center mt-2'>Enter your PIN</h1>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                {pin.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        ref={(el) => inputRefs.current[index] = el}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            fontSize: '1.5rem',
                                            textAlign: 'center',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc'
                                        }}
                                    />
                                ))}
                            </div>
                            <button className='submitbtn' type='submit' style={{ marginTop: '20px' }}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgetPasswordPin;
