import React, { useState } from 'react';
import '../Css/forgetpass.css';
import Marklogo from '../Images/logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

function Forgetpassword(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handlesubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        const host = "http://localhost:2000";

        try {
            const response = await fetch(`${host}/api/auth/request-password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const json = await response.json();
            
            if (!response.ok) {
                props.Displayalert("Invalid Email", "Danger", "faExclamation");
            } else if (json.success) {
                props.Displayalert(json.message, "Check", "faCheck");
                navigate('/forgetpasswordpin', { state: { email } });
                setEmail('');
            }
        } catch (error) {
            props.Displayalert("Something went wrong", "Danger", "faExclamation");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='forgetpasswordmain'>
            <div className="fogetpassbg">
                <div className='forgetpasscontainer'>
                    <div className="logo">
                        <img src={Marklogo} alt='logo' />
                        <br />
                        <h5>M.A.R.K</h5>
                    </div>
                    <div className="forgetpassform">
                        <h1 className='text-center mt-2'>Forget Your Password?</h1>
                        <form onSubmit={handlesubmit}>
                            <div className="form-group">
                                <label className='text-center label mt-3 mb-5' htmlFor="email">
                                    <FontAwesomeIcon className="mr-2" icon={icon.faEnvelope} /> Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button className='submitbtn' type='submit' disabled={loading}>
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </form>
                    </div>  
                </div>
            </div>
        </div>
    );
}

export default Forgetpassword;
