// export default SignUpSignIn;
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import './SignUpSignIn.css';
import { useNavigate } from 'react-router-dom';
import { PartnerContext } from '../../contexts/PartnerContext';
import config from '../../config';

function SignUpSignIn() {
    const [formData, setFormData] = useState({
        businessName: '',
        businessType: '',
        contactNumber: '',
        email: '',
        location: '',
        password: '',
        userName: '', // For login
        loginPassword: '', // For login
    });

    const navigate = useNavigate();
    const { setPartner } = useContext(PartnerContext);

    useEffect(() => {
        // Check if a token exists and fetch the partner data
        const token = localStorage.getItem('authToken');
        if (token) {
            axios.get(`${config.backendUrl}/api/partner`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => {
                setPartner(response.data);
                navigate('/dashboard');
            })
            .catch(error => {
                console.error('Error fetching partner data:', error);
            });
        }
    }, [navigate, setPartner]);

    // Function to update form data on input change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to handle sign-up submission
    const handleSubmitSignUp = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${config.backendUrl}/api/signup`, {
                businessName: formData.businessName,
                businessType: formData.businessType,
                contactNumber: formData.contactNumber,
                email: formData.email,
                location: formData.location,
                password: formData.password,
            });

            const partnerData = response.data;
            setPartner(partnerData);
            alert("Sign up Successful, Welcome!");
            navigate('/dashboard');
        } catch (error) {
            console.error('Error signing up:', error);
            alert(error.response?.data || "An unexpected error occurred. Please try again.");
        }
    };

    // Function to handle sign-in submission
    const handleSubmitSignIn = async (event) => {
        event.preventDefault();
        try {
            const loginResponse = await axios.post(`${config.backendUrl}/api/login`, {
                contactNumber: formData.contactNumber,
                password: formData.loginPassword,
            });

            const token = loginResponse.data.token;
            if (token) {
                localStorage.setItem('authToken', token);

                const partnerResponse = await axios.get(`${config.backendUrl}/api/partner`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setPartner(partnerResponse.data);
                navigate('/dashboard');
            } else {
                throw new Error('Token not received');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            alert("An error occurred during sign-in. Please try again.");
        }
    };

    // Function to toggle the form panel
    const handleToggle = () => {
        document.getElementById('container').classList.toggle('right-panel-active');
    };

    return (
        <div className='authForm'>
            {/* <span className="big-circle">
                <span className="inner-circle"></span>
            </span> */}

            <img src="https://i.imgur.com/wcGWHvx.png" className="square" alt="" />

            <div className="container" id="container">

                {/* Sign Up Section */}
                <div className="form-container sign-up-container">

                    <form onSubmit={handleSubmitSignUp}>

                        <h1 className='createAccount'>Create Account</h1>

                        <div className="social-container">
                            <a href="#" className="log_social_icons" ><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="log_social_icons"><i className="fab fa-google-plus-g"></i></a>
                            <a href="#" className="log_social_icons"><i className="fab fa-linkedin-in"></i></a>
                        </div>

                        <span>or use your email for registration</span>

                        <div className="infield">
                            <input 
                                className='input-sign'
                                type="text"
                                placeholder="Official Names"
                                name="OfficialNames"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="infield">
                            <input
                                className='input-sign'
                                type="number"
                                placeholder="ID Number"
                                name="IDNumber"
                                value={formData.businessType}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="infield">
                            <input
                                className='input-sign'
                                type="number"
                                placeholder="Driver Licence Number"
                                name="DriverLicenceNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="infield">
                            <input
                                className='input-sign'
                                type="number"
                                placeholder="Number Plate"
                                name="NumberPlate"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div className="infield">
                            <input
                                className='input-sign'
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="infield">
                            <input
                                className='input-sign'
                                type="text"
                                placeholder="Confirm Password"
                                name="ConfirmPassword"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <button className='loginBtn logphone' type="submit">Sign Up</button>

                    </form>
                </div>

                {/* Sign In Section */}
                <div className="form-container sign-in-container">
                    <form onSubmit={handleSubmitSignIn}>
                        <h1 className='logIn_h1'>Log in</h1>

                        <div className="social-container">
                            <a href="#" className="log_social_icons"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="log_social_icons"><i className="fab fa-google-plus-g"></i></a>
                            <a href="#" className="log_social_icons"><i className="fab fa-linkedin-in"></i></a>
                        </div>

                        <span>or use your account</span>

                        <div className="infield">
                            <input
                                className='input-sign'
                                type="text"
                                placeholder="Official Names"
                                name="Official Names"
                                value={formData.businessName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="infield">
                            <input
                                className='input-sign'
                                type="number"
                                placeholder="ID Number"
                                name="ID Number"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="infield">
                            <input
                                className='input-sign'
                                type="password"
                                placeholder="Password"
                                name="loginPassword"
                                value={formData.loginPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <a href="#" className="forgot">Forgot your password ?</a>

                        <button className='loginBtn' type="submit">Log In</button>
                    </form>
                </div>

                {/* Overlay Messages */}
                <div className="overlay-container" id="overlayCon">
                    <div className="overlay">

                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your Account info</p>
                            <button className="signBtn btnScaled loginBtn" onClick={handleToggle}>Log In</button>
                        </div>

                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your Account details and start journey with us</p>
                            <button id="signUpBtn" className="signBtn btnScaled loginBtn" onClick={handleToggle}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpSignIn;
