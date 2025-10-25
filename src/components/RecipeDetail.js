import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import Headerf from './Headerf';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data, error } = await recipeService.getRecipeById(id);
        if (error) {
          setError(error.message);
        } else {
          setRecipe(data);
        }
      } catch (err) {
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const goBack = () => {
    navigate('/recipe');
  };

  if (loading) {
    return (
      <div className="recipe-detail-container">
        <Headerf />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail-container">
        <Headerf />
        <div className="error-container">
          <h2>Recipe not found</h2>
          <p>{error || 'The recipe you are looking for does not exist.'}</p>
          <button onClick={goBack} className="back-button">Back to Recipes</button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-container">
      <Headerf />
      
      <div className="recipe-detail-content">
        {/* Back button */}
        <button onClick={goBack} className="back-button">
          ← Back to Recipes
        </button>

        {/* Recipe Header */}
        <div className="recipe-header">
          <div className="recipe-image-container">
            <img 
              src={recipe.image_url || '/images/food1.jpg'} 
              alt={recipe.title}
              className="recipe-main-image"
            />
          </div>
          
          <div className="recipe-info">
            <h1 className="recipe-title">{recipe.title}</h1>
            <p className="recipe-author">By {recipe.profiles?.full_name || 'Anonymous'}</p>
            <p className="recipe-description">{recipe.description}</p>
            
            <div className="recipe-meta">
              <div className="meta-item">
                <span className="meta-label">Prep Time:</span>
                <span className="meta-value">{recipe.prep_time} minutes</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Difficulty:</span>
                <span className="meta-value">{recipe.difficulty}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Tags:</span>
                <span className="meta-value">
                  {recipe.tags?.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="recipe-content">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  <span className="ingredient-checkbox">☐</span>
                  <span className="ingredient-text">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {recipe.instructions?.map((instruction, index) => (
                <li key={index} className="instruction-item">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">{instruction}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="recipe-actions">
          <button className="action-button favorite-btn">
            ♡ Add to Favorites
          </button>
          <button className="action-button share-btn">
            📤 Share Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
