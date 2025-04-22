import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "./axios";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    };

    const validateDob = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Invalid email format.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character.");
            return;
        }

        if (!validateDob(dob)) {
            setError("You must be at least 18 years old to register.");
            return;
        }

        setError(""); 
        console.log({ email, password, dob });
        try{
            const response = await axios.post("http://localhost:8000/users/login", { email, password, dob }, { withCredentials: true });
            const token = response.data.data.accessToken;
            if (token) {
                console.log('token:', token);
                localStorage.setItem("token", token);
                navigate("/transaction");
            } else {
                console.log('Token not received in response:', response.data);
                setError("Login failed. Token not received.");
            }
        }catch(error){
            console.error('Error logging in:', error?.response?.data?.message || error.message);
            setError(error?.response?.data?.message || "Invalid email or password.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <br></br>
                <button className="register-btn" onClick={() => navigate("/register")}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default Login;
