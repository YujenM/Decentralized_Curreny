import React, { useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import '../Css/forgetpass.css';
import Marklogo from '../Images/logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";

function Changepassword(props) {
    const location = useLocation();
    const { email, pin } = location.state || {};
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            props.Displayalert("Password Do not match", "Danger", "faExclamation");
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            // const host = "http://localhost:2000";
            const host ="https://decentralized-curreny.onrender.com";
            const response = await fetch(`${host}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, resetCode: pin, newPassword: password })
            });

            const json = await response.json();
            if (response.ok) {
                navigate('/login');
                props.Displayalert(json.message, "Check", "faCheck");

            } else {
                props.Displayalert("Invalid Email", "Danger", "faExclamation");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
                        <h1 className='text-center mt-2'>Reset Your Password</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className='text-center label mt-3 mb-2' htmlFor="password">
                                    <FontAwesomeIcon className="mr-2" icon={icon.faLock} /> New Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        placeholder="Enter your new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ paddingRight: '2.5rem' }}
                                    />
                                    <FontAwesomeIcon
                                        icon={showPassword ? icon.faEyeSlash : icon.faEye}
                                        onClick={togglePasswordVisibility}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className='text-center label mt-3 mb-2' htmlFor="confirmPassword">
                                    <FontAwesomeIcon className="mr-2" icon={icon.faLock} /> Confirm Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="Confirm your new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        style={{ paddingRight: '2.5rem' }}
                                    />
                                    <FontAwesomeIcon
                                        icon={showConfirmPassword ? icon.faEyeSlash : icon.faEye}
                                        onClick={toggleConfirmPasswordVisibility}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
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

export default Changepassword;
