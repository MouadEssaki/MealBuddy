import React, { useState } from 'react';
import Register1 from './Register1';
import Register2 from './Register2';
import Register3 from './Register3';
import Register4 from './Register4';
import Login from './Login';

const LoginRegister = ({ onAuthSuccess }) => {
    const [step, setStep] = useState('login');
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        avatar: null,
        goal: '',
        preferences: [],
    });

    const handleNextStep = (newData) => {
        setFormData({ ...formData, ...newData });
        if (step === 'login') setStep('register1');
        else if (step === 'register1') setStep('register2');
        else if (step === 'register2') setStep('register3');
        else if (step === 'register3') setStep('register4');
    };

    const handlePreviousStep = () => {
        if (step === 'register1') setStep('login');
        else if (step === 'register2') setStep('register1');
        else if (step === 'register3') setStep('register2');
        else if (step === 'register4') setStep('register3');
    };

    const handleBackToLogin = () => {
        setStep('login');
        // Optionally, reset form data when going back to login
        setFormData({
            email: '',
            username: '',
            password: '',
            avatar: null,
            goal: '',
            preferences: [],
        });
    };

    const handleAuthSuccess = (token) => {
        // Store the token or perform any other action after successful authentication
        console.log('Authentication successful:');
        onAuthSuccess(token);
    };

    return (
        <>
            {step === 'login' && (
                <Login
                    onAuthSuccess={onAuthSuccess}
                    onSwitchToRegister={() => setStep('register1')}
                />
            )}

            {step === 'register1' && (
                <Register1
                    onNext={handleNextStep}
                    onBackToLogin={handleBackToLogin}
                    formData={formData}
                    setFormData={setFormData}
                />
            )}
            {step === 'register2' && (
                <Register2
                    onNext={handleNextStep}
                    onBack={handlePreviousStep}
                    onBackToLogin={handleBackToLogin}
                    formData={formData}
                    setFormData={setFormData}
                />
            )}
            {step === 'register3' && (
                <Register3
                    onNext={handleNextStep}
                    onBack={handlePreviousStep}
                    onBackToLogin={handleBackToLogin}
                    formData={formData}
                    setFormData={setFormData}
                />
            )}
            {step === 'register4' && (
                <Register4
                    onNext={handleNextStep}
                    onBack={handlePreviousStep}
                    onBackToLogin={handleBackToLogin}
                    formData={formData}
                    setFormData={setFormData}
                    onAuthSuccess={handleAuthSuccess}
                    setStep={setStep}
                />
            )}
        </>
    );
};

export default LoginRegister;
