# Recipe App with Supabase Integration

A modern recipe sharing application built with React and Supabase, featuring user authentication, recipe creation, and a beautiful UI.

## Features

- 🔐 **User Authentication**: Sign up, login, and logout functionality
- 📝 **Recipe Creation**: Create and save recipes with images, ingredients, and instructions
- 📖 **Recipe Book**: Browse all recipes in a beautiful grid layout
- 👁️ **Recipe Details**: View detailed recipe pages with step-by-step instructions
- 🎨 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🖼️ **Image Upload**: Upload and store recipe images using Supabase Storage

## Tech Stack

- **Frontend**: React 19, React Router DOM
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: CSS3 with responsive design
- **State Management**: React Context API

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
4. Create a storage bucket named `recipe-images` (public)

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/           # React components
│   ├── AuthPage.js      # Login/Signup page
│   ├── CreateRecipe.js  # Recipe creation form
│   ├── Headerf.js       # Navigation header
│   ├── RecipeDetail.js  # Detailed recipe view
│   └── ...
├── contexts/            # React contexts
│   └── AuthContext.js   # Authentication context
├── lib/                 # External libraries
│   └── supabase.js      # Supabase client
├── services/            # API services
│   └── recipeService.js # Recipe CRUD operations
└── recipespage/         # Recipe-related pages
    ├── RecipeCard.js    # Recipe grid component
    └── Page.css         # Recipe page styles
```

## Database Schema

### Tables

- **profiles**: User profile information
- **recipes**: Recipe data (title, ingredients, instructions, etc.)
- **favorites**: User favorite recipes

### Storage

- **recipe-images**: Public bucket for recipe images

## Key Features Implementation

### Authentication
- Uses Supabase Auth with email/password
- Automatic profile creation on signup
- Protected routes and user state management

### Recipe Management
- Create recipes with images, ingredients, and instructions
- View all recipes in a responsive grid
- Click on recipes to view detailed pages
- User can only edit/delete their own recipes

### UI/UX
- Consistent color scheme (#ff6b6b primary color)
- Responsive design for all screen sizes
- Loading states and error handling
- Smooth transitions and hover effects

## API Endpoints

The app uses Supabase's auto-generated REST API:

- `GET /recipes` - Get all recipes
- `GET /recipes/:id` - Get recipe by ID
- `POST /recipes` - Create new recipe
- `PUT /recipes/:id` - Update recipe
- `DELETE /recipes/:id` - Delete recipe

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
