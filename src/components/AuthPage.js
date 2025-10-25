import React, { useState } from 'react';
import './SignLogin.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
    const navigate = useNavigate();
    const { signIn, signUp } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        console.log('Attempting to', isLogin ? 'login' : 'signup', 'with:', formData.email);

        try {
            if (isLogin) {
                // Login
                console.log('Attempting login...');
                const { data, error } = await signIn(formData.email, formData.password);
                console.log('Login result:', { data, error });
                if (error) {
                    setError(error.message);
                } else {
                    console.log('Login successful, navigating to home');
                    navigate('/');
                }
            } else {
                // Sign up
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                
                console.log('Attempting signup...');
                const { data, error } = await signUp(formData.email, formData.password, {
                    full_name: formData.name
                });
                console.log('Signup result:', { data, error });
                
                if (error) {
                    setError(error.message);
                } else {
                    console.log('Signup successful, redirecting to home');
                    navigate('/');
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="design-container">
            <div className="content-wrapper">
                <div className="text-container">
                    <h1>Discover Culinary Magic</h1>
                    <h1>Cook With us</h1>
                    <p>
                        Find recipes tailored to your ingredients. Whether you're a seasoned chef or a kitchen beginner, we'll help you create delicious meals with what you already have.
                    </p>
                    
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-fields">
                            {!isLogin && (
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name" 
                                    className="input-field" 
                                    required={!isLogin}
                                />
                            )}
                            
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email" 
                                className="input-field" 
                                required
                            />
                            
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password" 
                                className="input-field" 
                                required
                            />
                            
                            {!isLogin && (
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password" 
                                    className="input-field" 
                                    required={!isLogin}
                                />
                            )}
                        </div>
                        
                        {error && (
                            <div className="error-message" style={{ color: '#ff6b6b', marginBottom: '10px', fontSize: '14px' }}>
                                {error}
                            </div>
                        )}
                        
                        <button type="submit" className="signup-btn1" disabled={loading}>
                            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
                        </button>
                    </form>
                    
                    <div className="auth-toggle" style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ color: '#666', fontSize: '14px' }}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                type="button" 
                                onClick={toggleMode}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: '#ff6b6b', 
                                    cursor: 'pointer', 
                                    textDecoration: 'underline',
                                    marginLeft: '5px'
                                }}
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
