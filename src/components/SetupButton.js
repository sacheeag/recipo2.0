import React, { useState } from 'react';
import { addPredefinedRecipes } from '../utils/predefinedRecipes';

const SetupButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAddRecipes = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const result = await addPredefinedRecipes();
      setResult(result);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #ff6b6b', 
      borderRadius: '10px', 
      margin: '20px',
      backgroundColor: '#fff5f5'
    }}>
      <h3 style={{ color: '#ff6b6b', marginTop: 0 }}>🍳 Add Predefined Recipes</h3>
      <p>Click this button to add 8 delicious predefined recipes to your database:</p>
      <ul style={{ textAlign: 'left', margin: '10px 0' }}>
        <li>Classic Margherita Pizza</li>
        <li>Chicken Tikka Masala</li>
        <li>Chocolate Chip Cookies</li>
        <li>Caesar Salad</li>
        <li>Beef Stir Fry</li>
        <li>Pasta Carbonara</li>
        <li>Grilled Salmon</li>
        <li>Vegetable Soup</li>
      </ul>
      
      <button 
        onClick={handleAddRecipes}
        disabled={loading}
        style={{
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Adding Recipes...' : 'Add Predefined Recipes'}
      </button>

      {result && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: result.success ? '#e8f5e8' : '#ffe8e8',
          borderRadius: '5px',
          border: `1px solid ${result.success ? '#4caf50' : '#f44336'}`
        }}>
          {result.success ? (
            <div style={{ color: '#2e7d32' }}>
              ✅ Successfully added {result.added} recipes!
            </div>
          ) : (
            <div style={{ color: '#c62828' }}>
              ❌ Error: {result.error?.message || result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SetupButton;
