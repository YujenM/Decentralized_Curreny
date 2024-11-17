import React, { useState, useContext, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icon from '@fortawesome/free-solid-svg-icons';
import UserContext from '../Context/User/Usercontext';

function Personalinfo(props) {
    const host ="https://decentralized-curreny.onrender.com"?"https://decentralized-curreny.onrender.com":"http://localhost:2000";
    const authToken = localStorage.getItem('authtoken');
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [fileSelected, setFileSelected] = useState(false);
    const [localPhoto, setLocalPhoto] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const { updateUserProfile } = useContext(UserContext);
    const { state, getUser } = useContext(UserContext);
    const hasFetchedData = useRef(false);

    useEffect(() => {
        if (!hasFetchedData.current) {
            getUser();
            hasFetchedData.current = true;
        }
    }, [getUser]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setFileSelected(true);
        } else {
            setImagePreview(null);
            setFileSelected(false);
        }
    };

    const addOrEditNumber = async () => {
        try {
            const response = await fetch(`${host}/Markapi/Settings/addnumber`, {
                method: "POST",
                headers: {
                    "auth-token": authToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ phone: phoneNumber })
            });
    
            // Read the response body only once
            const responseBody = await response.text();
    
            if (response.ok) {
                try {
                    // const result = JSON.parse(responseBody);
                    props.Displayalert('Number Updated', 'Check', 'faCheck');
                    // console.log("Number added/updated successfully:", result);
                } catch {
                    // console.log("Number added/updated successfully (plain text):", responseBody);
                }
                getUser();
                setIsModalOpen(false); 
            } else {
                // Handle error response
                try {
                    const error = JSON.parse(responseBody);
                    console.error("Failed to add or edit number:", error.message || "Unknown error");
                } catch {
                    console.error("Failed to add or edit number (plain text):", responseBody);
                }
            }
        } catch (err) {
            console.error("Error:", err.message);
        }
    };
    

    const addPhoto = async () => {
        setIsUploading(true);
        const formData = new FormData();
        const imageFile = document.getElementById("image").files[0];

        if (!imageFile) {
            setUploadStatus("No file selected.");
            setIsUploading(false);
            return;
        }

        formData.append("image", imageFile);

        try {
            const response = await fetch(`${host}/Markapi/Settings/addprofile`, {
                method: "PUT",
                headers: {
                    "auth-token": authToken,
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Server response after photo upload:", result);

                const newPhotoUrl = result.photoUrl;
                setLocalPhoto(newPhotoUrl);
                updateUserProfile(newPhotoUrl);
                props.Displayalert('Profile Updated', 'Check', 'faCheck');
                setImagePreview(null);
                setFileSelected(false);
            } else {
                const error = await response.json();
                setUploadStatus(error.message || "Failed to upload photo.");
            }
        } catch (err) {
            setUploadStatus("An error occurred. Please try again.");
            console.error(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="personalinfo">
            <div className="addphoto mt-5">
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="userphoto"
                        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                    />
                ) : localPhoto || state.User_Photo ? (
                    <img
                        src={localPhoto || state.User_Photo}
                        alt="user"
                        className="userphoto"
                        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                    />
                ) : (
                    <div className="usericon">
                        <FontAwesomeIcon className="fonticons" icon={icon.faUserPlus} />
                    </div>
                )}
                <div className="mt-5">
                    <label className="mt-5 ml-5" htmlFor="image">
                        <FontAwesomeIcon icon={icon.faImage} /> Upload
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                    {fileSelected && !isUploading && (
                        <button
                            className="btn btn-primary mt-3 ml-4 imagesubmitbtn"
                            onClick={addPhoto}
                        >
                            Submit Photo
                        </button>
                    )}
                </div>
            </div>
            {uploadStatus && <p className="mt-3">{uploadStatus}</p>}
            <div className="mt-4 userpersonalinfo">
                <p className="mt-5 ml-5">Name: {state.User_Name}</p>
                <p className="mt-3 ml-5">Email: {state.User_Email}</p>
                <div className='usernumber'>
                    <p className="mt-3 ml-5">Phone Number: {state.User_Number ? state.User_Number : "N/A"}</p>
                    <button
                        className="numberbutton ml-4 mt-4"
                        onClick={() => setIsModalOpen(true)} // Open modal
                    >
                        Add/Edit Number
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add/Edit Phone Number</h2>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter phone number"
                        />
                        <button onClick={addOrEditNumber}>Submit</button>
                        <button onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Personalinfo;
