import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icon from '@fortawesome/free-solid-svg-icons';

function Personalinfo() {
    const host = "https://decentralized-curreny.onrender.com";
    const authToken = localStorage.getItem('authtoken');
    const [imagePreview, setImagePreview] = useState(null); // For previewing the selected file
    const [uploadStatus, setUploadStatus] = useState(null); // For feedback

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // Generate preview URL
        } else {
            setImagePreview(null);
        }
    };

    const addPhoto = async () => {
        const formData = new FormData();
        const imageFile = document.getElementById('image').files[0];

        if (!imageFile) {
            setUploadStatus("No file selected.");
            return;
        }

        formData.append('image', imageFile);

        try {
            const response = await fetch(`${host}/Markapi/Settings/addprofile`, {
                method: 'PUT',
                headers: {
                    'auth-token': authToken,
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setUploadStatus("Photo uploaded successfully!");
                console.log("updated succesfully")
                console.log(result); 
            } else {
                const error = await response.json();
                setUploadStatus(error.message || "Failed to upload photo.");
            }
        } catch (err) {
            setUploadStatus("An error occurred. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="personalinfo">
            <div className="addphoto mt-5">
                <div className="usericon">
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="fonticon"
                            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                        />
                    ) : (
                        <FontAwesomeIcon className="fonticon" icon={icon.faUserPlus} />
                    )}
                </div>
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
                </div>
                <button className="btn btn-primary mt-3" onClick={addPhoto}>
                    Submit Photo
                </button>
            </div>
            {uploadStatus && <p className="mt-3">{uploadStatus}</p>}
        </div>
    );
}

export default Personalinfo;
