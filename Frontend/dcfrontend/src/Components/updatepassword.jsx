import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function UpdatePassword(props) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field],
        });
    };

    const changePassword = async (e) => {
        e.preventDefault(); // Prevent form reload
        setError('');
        setSuccess('');

        const { currentPassword, newPassword, confirmPassword } = formData;

        // Validate passwords
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            props.Displayalert('New password and confirm password do not match.', 'Danger', 'faExclamation');
            return;
        }

        const host ="https://decentralized-curreny.onrender.com"?"https://decentralized-curreny.onrender.com":"http://localhost:2000";
        const authToken = localStorage.getItem('authtoken');
        if (!authToken) {
            setError("Authentication token is missing or invalid.");
            return;
        }

        try {
            const response = await fetch(`${host}/api/auth/updatepassword`, {
                method: 'PUT',
                headers: {
                    'auth-token': authToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldpassword: currentPassword,
                    newpassword: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                props.Displayalert('Password Updated Successfully', 'Check', 'faCheck');
            } else {
                props.Displayalert(data.error, 'Danger', 'faExclamation');
            }
        } catch (err) {
            console.error('Network error:', err.message);
            setError('Network error occurred. Please try again.');
        }
    };

    return (
        <div className="mt-5">
            <div className="resetheading">
                <h2>Reset Password</h2>
                <form onSubmit={changePassword}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword.currentPassword ? 'text' : 'password'}
                                className="form-control"
                                id="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                placeholder="Enter current password"
                                required
                            />
                            <FontAwesomeIcon
                                icon={showPassword.currentPassword ? faEye : faEyeSlash}
                                className="password-toggle-icon"
                                onClick={() => togglePasswordVisibility('currentPassword')}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword.newPassword ? 'text' : 'password'}
                                className="form-control"
                                id="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                placeholder="Enter new password"
                                required
                            />
                            <FontAwesomeIcon
                                icon={showPassword.newPassword ? faEye : faEyeSlash}
                                className="password-toggle-icon"
                                onClick={() => togglePasswordVisibility('newPassword')}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className='passwordtitle' htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword.confirmPassword ? 'text' : 'password'}
                                className="form-control"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm new password"
                                required
                            />
                            <FontAwesomeIcon
                                icon={showPassword.confirmPassword ? faEye : faEyeSlash}
                                className="password-toggle-icon"
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                            />
                        </div>
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    {success && <p className="text-success">{success}</p>}

                    <div className='flex justify-center mt-5'>
                        <button type="submit" className="change-password-btn">
                            Update Password
                        </button>
                            
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdatePassword;
