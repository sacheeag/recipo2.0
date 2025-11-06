import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';
import Headerf from './Headerf';
import Footer from './Footer';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setError('Please log in to view your favorites');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await recipeService.getUserFavorites();
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setFavorites(data || []);
        }
      } catch (err) {
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleRemoveFavorite = async (recipeId, e) => {
    e.stopPropagation(); // Prevent card click
    
    try {
      const { error } = await recipeService.removeFromFavorites(recipeId);
      if (error) {
        console.error('Error removing favorite:', error);
      } else {
        // Remove from local state
        setFavorites(favorites.filter(fav => fav.id !== recipeId));
      }
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <Headerf />
        <div className="favorites-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your favorites...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="favorites-page">
        <Headerf />
        <div className="favorites-container">
          <div className="error-container">
            <h2>Please Log In</h2>
            <p>You need to be logged in to view your favorite recipes.</p>
            <button onClick={() => navigate('/action3')} className="login-prompt-btn">
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-page">
        <Headerf />
        <div className="favorites-container">
          <div className="error-container">
            <h2>Error Loading Favorites</h2>
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <Headerf />
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>My Favorite Recipes</h1>
          <p className="favorites-count">{favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} saved</p>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon">♡</div>
            <h2>No favorites yet!</h2>
            <p>Start exploring recipes and add your favorites here.</p>
            <button onClick={() => navigate('/recipe')} className="browse-recipes-btn">
              Browse Recipes
            </button>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((recipe) => (
              <div
                key={recipe.id}
                className="favorite-recipe-card"
                onClick={() => handleRecipeClick(recipe.id)}
              >
                <div className="favorite-recipe-image">
                  <img 
                    src={recipe.image_url || "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg"} 
                    alt={recipe.title} 
                  />
                  <button
                    className="remove-favorite-btn"
                    onClick={(e) => handleRemoveFavorite(recipe.id, e)}
                    title="Remove from favorites"
                  >
                    ♥
                  </button>
                </div>
                <div className="favorite-recipe-info">
                  <p className="favorite-tag">{recipe.tags?.[0] || 'Recipe'}</p>
                  <h3 className="favorite-title">{recipe.title}</h3>
                  <div className="favorite-meta">
                    <p className="favorite-time">{recipe.prep_time || 30} min</p>
                    <div className="favorite-rating">
                      ⭐ <span>4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
