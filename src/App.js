import React from 'react';
import Headerf from './components/Headerf'
import DiscoverBox from './components/DiscoverBox';
import ShareRecipe from './components/ShareRecipe';
import Footer from './components/Footer'
import Section2 from './components/Section2'
import Recipes from './components/Recipes';
import LandingPage from './components/Landingpage';

function App() {
  return (
    <div className="App">
      <Headerf />
      <div className="main-content">
        <DiscoverBox />
        <LandingPage />
        <ShareRecipe />
        <Recipes />
        <Section2 />
      </div>
      <Footer />
    </div>
  );
}

export default App;
