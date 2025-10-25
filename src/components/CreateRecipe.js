import React, { useState, useRef } from 'react';
import './CreateRecipe.css';
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../services/recipeService';

function CreateRecipe() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  const [recipeTitle, setRecipeTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [steps, setSteps] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient('');
    }
  };

  const handleAddStep = () => {
    const newStepId = steps.length ? Math.max(...steps.map(step => step.id)) + 1 : 1;
    setSteps([...steps, { id: newStepId, content: '' }]);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSaveRecipe = async () => {
    if (!recipeTitle.trim()) {
      setError('Please enter a recipe title');
      return;
    }

    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    if (steps.length === 0) {
      setError('Please add at least one instruction step');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (selectedImage && fileInputRef.current.files[0]) {
        const uploadResult = await recipeService.uploadRecipeImage(fileInputRef.current.files[0], Date.now());
        if (uploadResult.error) {
          throw uploadResult.error;
        }
        imageUrl = uploadResult.data.url;
      }

      const recipeData = {
        title: recipeTitle.trim(),
        description: description.trim(),
        ingredients: ingredients.filter(ing => ing.trim()),
        instructions: steps.map(step => step.content.trim()).filter(content => content),
        image_url: imageUrl,
        prep_time: 30, // Default value, can be made configurable
        difficulty: 'Easy', // Default value, can be made configurable
        tags: ['Custom'], // Default value, can be made configurable
      };

      const { error } = await recipeService.createRecipe(recipeData);
      
      if (error) {
        throw error;
      }

      // Success - navigate to recipe book
      navigate('/recipe');
    } catch (err) {
      setError(err.message || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="create-recipe-container">
      <div className="create-recipe-header">
        <h1>Create new recipe</h1>
        <button className="save-button" onClick={handleSaveRecipe} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ 
          color: '#ff6b6b', 
          margin: '10px 20px', 
          padding: '10px', 
          backgroundColor: '#ffe6e6', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <div className="recipe-form">
        <div className="form-group">
          <label htmlFor="recipe-title">Recipe Title:</label>
          <input
            type="text"
            id="recipe-title"
            className="form-control"
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Recipe image:</label>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <div className="image-upload-container">
            {!selectedImage ? (
              <div className="empty-image-container">
                <button className="add-image-btn" onClick={triggerFileInput}>
                  <span className="camera-icon">📷</span>
                  <span>Add Recipe Image</span>
                </button>
              </div>
            ) : (
              <div className="image-preview">
                <img src={selectedImage} alt="Recipe preview" />
                <div className="image-actions">
                  <button className="image-action-btn">Set as cover</button>
                  <button className="image-action-btn" onClick={triggerFileInput}>Change image</button>
                </div>
              </div>
            )}
            
            <div className="image-thumbnails">
              <div className="thumbnail-container">
                <button className="add-photo-btn" onClick={triggerFileInput}>
                  <span className="plus-icon">+</span>
                  <span>Add Photo</span>
                </button>
              </div>
              {selectedImage && (
                <div className="thumbnail-container selected">
                  <img src={selectedImage} alt="Selected thumbnail" className="thumbnail" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Introduce your recipe"
          />
          <div className="character-count">0 / 150</div>
        </div>

        <div className="form-group">
          <label>Ingredients:</label>
          <ul className="ingredients-list">
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                <input
                  type="text"
                  className="form-control"
                  value={ingredient}
                  onChange={(e) => {
                    const updatedIngredients = [...ingredients];
                    updatedIngredients[index] = e.target.value;
                    setIngredients(updatedIngredients);
                  }}
                />
              </li>
            ))}
            <li>
              <input
                type="text"
                className="form-control"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add ingredients"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
              />
            </li>
          </ul>
          <button className="add-header-btn" onClick={handleAddIngredient}>
            + Header
          </button>
        </div>

        <div className="form-group">
          <label>Instructions:</label>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={step.id} className="step-item">
                <div className="step-header">
                  <div className="step-number">Step {step.id}</div>
                  <div className="step-icon-container">
                    <button className="step-icon-btn">
                      <span className="camera-icon">📷</span>
                    </button>
                  </div>
                </div>
                <textarea
                  className="form-control step-textarea"
                  value={step.content}
                  onChange={(e) => {
                    const updatedSteps = [...steps];
                    updatedSteps[index].content = e.target.value;
                    setSteps(updatedSteps);
                  }}
                />
              </div>
            ))}
            <input
              type="text"
              className="form-control"
              placeholder="Write instructions"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddStep();
                }
              }}
            />
          </div>
          <button className="add-header-btn" onClick={handleAddStep}>
            + Header
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRecipe;