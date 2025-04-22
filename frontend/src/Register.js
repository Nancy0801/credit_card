import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "./axios";

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");
    const [error, setError] = useState("");

    const validateName = (name) => {
        return /^[A-Za-z\s]{3,}$/.test(name); // At least 3 characters, only alphabets and spaces
    };

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

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!validateName(name)) {
            setError("Name must contain at least 3 characters and only letters.");
            return;
        }

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
        try{
            const response = await axios.post("/users/register",{
                name, email , password , dob
            });
            console.log("registration success: " , response.data);
            alert("Registration successful!.");
            navigate("/transaction");
        } catch(error){
            console.error("registration error: ", error.response?.data?.message || error.message);
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                    />
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
                    <button type="submit">Register</button>
                </form>
                <br></br>
                <button className="login-btn" onClick={() => navigate("/")}>
                    Already Registered? Login
                </button>
            </div>
        </div>
    );
};

export default Register;
