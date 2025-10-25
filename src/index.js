import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'

import App2 from './App2'
import App3 from './App3'
import App4 from './App4';
import App5 from './App5';
import App6 from './App6';
import App7 from './App7';

// Import new components
import AuthPage from './components/AuthPage';
import CreateRecipe from './components/CreateRecipe';
import RecipeDetail from './components/RecipeDetail';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/action" element={<App2 />} />
          <Route path="/action2" element={<AuthPage />} />
          <Route path="/action3" element={<AuthPage />} />
          <Route path="/home1" element={<App5 />}/>
          <Route path="/recipe" element={<App6 />}/>
          <Route path="/recipe/:id" element={<RecipeDetail />}/>
          <Route path="/create-recipe" element={<CreateRecipe />}/>
          <Route path="/share" element={<App7 />}/>
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
reportWebVitals();

