
import React, { useState, useEffect } from "react";
import "./Page.css";
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../services/recipeService';

const RecipeCards = ({ recipe, onRecipeClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onRecipeClick(recipe.id);
  };

  return (
    <div 
      className="recipe-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="recipe-image">
        <img src={recipe.image_url || "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg"} alt={recipe.title} />
        <div className="user-avatars">
          <img src={recipe.profiles?.avatar_url || "https://randomuser.me/api/portraits/thumb/men/1.jpg"} alt="User" className="avatar" />
        </div>
        {isHovered && (
          <button className="view-recipe-btn">View Recipe</button>
        )}
      </div>
      <div className="recipe-info">
        <p className="tag">{recipe.tags?.[0] || 'Recipe'}</p>
        <h3 className="title2">{recipe.title}</h3>
        <div className="bottom-section">
          <p className="time">{recipe.prep_time || 30} min</p>
          <div className="rating">
            ⭐ <span>4.5</span>
          </div>
          <button className="favorite-btn">♡</button>
        </div>
      </div>
    </div>
  );
};



const RecipeCard = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const { data, error } = await recipeService.getRecipes();
                if (error) {
                    setError(error.message);
                } else {
                    setRecipes(data || []);
                }
            } catch (err) {
                setError('Failed to load recipes');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const handleRecipeClick = (recipeId) => {
        navigate(`/recipe/${recipeId}`);
    };

    if (loading) {
        return (
            <div className="recipes-master-container">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="loading-spinner" style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: '4px solid #f3f3f3', 
                        borderTop: '4px solid #ff6b6b', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <p>Loading recipes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recipes-master-container">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h3>Error loading recipes</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="recipes-master-container">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h3>No recipes found</h3>
                    <p>Be the first to create a recipe!</p>
                </div>
            </div>
        );
    }

  const recipeGroups = [];
  for (let i = 0; i < recipes.length; i += 4) {
    recipeGroups.push(recipes.slice(i, i + 4));
  }

  
  return (
    <div className="recipes-master-container">
      {recipeGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="recipe-row">
          {group.map((recipe, index) => (
            <RecipeCards
              key={recipe.id || index}
              recipe={recipe}
              onRecipeClick={handleRecipeClick}
            />
          ))}
        </div>
              ))}
              </div>
            );
          };
          
          export default RecipeCard;
