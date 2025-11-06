import React, { useState } from 'react';
import Logo from '../images/Logom.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Headerf() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [menuActive, setMenuActive] = useState(false);
    
    const home = () => {
        navigate('/');
    };
    
    const action2 = () => {
        navigate('/action2');
    };
    
    const login = () => {
        navigate('/action3');
    };

    const createRecipe = () => {
        navigate('/create-recipe');
    };

    const goToFavorites = () => {
        navigate('/favorites');
    };
    
    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };
    
    return (
        <>
        <div className="header">
            <div className="mobile-menu-toggle" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className="title">
                <img src={Logo} alt="Sachee Agarwal 23BDS0087" />
                <span onClick={home}>Recipo</span>
            </div>
            <div className={`nav-links ${menuActive ? 'active' : ''}`}>
                <a href="/">Home</a>
                <a href="/">About</a>
                <a href="/recipe">Recipes</a>
                <a href="/">Contact</a>
            </div>
            <div className="auth-buttons">
                <button className="create-recipe-btn" onClick={createRecipe}>Create Recipe</button>
                {user && (
                    <button className="favorites-btn" onClick={goToFavorites} title="My Favorites">
                        ♥ Favorites
                    </button>
                )}
                {user ? (
                    <div className="user-menu">
                        <span className="user-name">{user.user_metadata?.full_name || user.email}</span>
                        <button className="logout-btn" onClick={handleSignOut}>Logout</button>
                    </div>
                ) : (
                    <>
                        <button className="login-btn" onClick={login}>Login</button>
                        <button className="signup-btn" onClick={action2}>Sign Up</button>
                    </>
                )}
            </div>
        </div>
        </>
    );
}

export default Headerf;