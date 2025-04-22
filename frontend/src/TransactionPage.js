import React, { useState } from 'react';
import './TransactionPage.css';
import axios from 'axios'

const TransactionPage = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [amount, setAmount] = useState('');
    const [location, setLocation] = useState('');
    const [errors, setErrors] = useState({});

    const handleCardNumberChange = (e) => {
        const input = e.target.value.replace(/\D/g, ''); 
        const formatted = input.replace(/(\d{4})(?=\d)/g, '$1 '); 
        setCardNumber(formatted.slice(0, 19)); 
    };

    const handleExpiryDateChange = (e) => {
        const input = e.target.value.replace(/\D/g, ''); 
        const formatted = input.replace(/(\d{2})(?=\d)/g, '$1/'); 
        setExpiryDate(formatted.slice(0, 5));
    };

    const handleCvvChange = (e) => {
        const input = e.target.value.replace(/\D/g, ''); 
        setCvv(input.slice(0, 3));
    };

    const validateForm = () => {
        let errors = {};
        const cardNumberPattern = /^\d{4} \d{4} \d{4} \d{4}$/;
        const expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const cvvPattern = /^\d{3}$/;

        if (!cardNumber.match(cardNumberPattern)) {
            errors.cardNumber = "Card number must be 16 digits (xxxx xxxx xxxx xxxx).";
        }
        if (!expiryDate.match(expiryDatePattern)) {
            errors.expiryDate = "Expiry date must be in MM/YY format.";
        }
        if (!cvv.match(cvvPattern)) {
            errors.cvv = "CVV must be 3 digits.";
        }
        if (amount <= 0) {
            errors.amount = "Amount must be greater than 0.";
        }
        if (!location.trim()) {
            errors.location = "Location is required.";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        console.log({ cardNumber, expiryDate, cvv, amount, location });
        // Handle transaction logic here (send data to backend, etc.)
        const token = localStorage.getItem('token');
        const transactionData = {
            cardNumber,
            expiryDate,
            cvv,
            amount,
            location
        };
        console.log('token:' , token);
    
        try {
            const response = await axios.post('http://localhost:8000/users/transactions', transactionData, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
    
            if (response.status === 201) {
                alert('Transaction recorded successfully!');
                setCardNumber('');
                setExpiryDate('');
                setCvv('');
                setAmount('');
                setLocation('');
            }
        } catch (error) {
            console.error('Error submitting transaction:', error.response|| error.message);
            alert('Transaction failed.');
        }
    };

    return (
        <div className="transaction-container">
            <h2>Transaction Details</h2>
            <div className="card-preview">
                <div className="card">
                    <div className="card-header">
                        <h3>Bank Name</h3>
                    </div>
                    <div className="card-body">
                        <div className="card-number">
                            {cardNumber || '**** **** **** ****'}
                        </div>
                        <div className="card-info">
                            <span>{expiryDate || 'MM/YY'}</span>
                            <span>{cvv ? `CVV: ${cvv}` : 'CVV: ***'}</span>
                        </div>
                    </div>
                    <div className="card-footer">
                        <span>{location || 'Location'}</span>
                        <span>{amount ? `$${amount}` : 'Amount'}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <label>Card Number:</label>
                <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    required
                />
                {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}

                <div className="card-details">
                    <div>
                        <label>Expiry Date:</label>
                        <input
                            type="text"
                            value={expiryDate}
                            onChange={handleExpiryDateChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            required
                        />
                        {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}
                    </div>
                    <div>
                        <label>CVV:</label>
                        <input
                            type="text"
                            value={cvv}
                            onChange={handleCvvChange}
                            placeholder="123"
                            required
                        />
                        {errors.cvv && <p className="error-message">{errors.cvv}</p>}
                    </div>
                </div>

                <label>Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    min="1"
                    required
                />
                {errors.amount && <p className="error-message">{errors.amount}</p>}

                <label>Location:</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter Location"
                    required
                />
                {errors.location && <p className="error-message">{errors.location}</p>}

                <button type="submit">Make Payment</button>
            </form>
        </div>
    );
};

export default TransactionPage;
