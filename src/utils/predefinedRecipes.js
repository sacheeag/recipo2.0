// Predefined recipes data
import { supabase } from '../lib/supabase';

export const predefinedRecipes = [
  {
    title: "Classic Margherita Pizza",
    description: "A traditional Italian pizza with fresh tomatoes, mozzarella, and basil. Simple yet delicious!",
    ingredients: [
      "1 pizza dough (store-bought or homemade)",
      "1/2 cup tomato sauce",
      "8 oz fresh mozzarella cheese",
      "Fresh basil leaves",
      "2 tbsp olive oil",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 475°F (245°C)",
      "Roll out pizza dough on a floured surface",
      "Spread tomato sauce evenly over the dough",
      "Tear mozzarella into pieces and distribute over sauce",
      "Drizzle with olive oil and season with salt and pepper",
      "Bake for 12-15 minutes until crust is golden",
      "Remove from oven and top with fresh basil leaves",
      "Slice and serve immediately"
    ],
    image_url: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg",
    prep_time: 30,
    difficulty: "Easy",
    tags: ["Italian", "Vegetarian", "Pizza"]
  },
  {
    title: "Chicken Tikka Masala",
    description: "Creamy and flavorful Indian curry with tender chicken pieces in a rich tomato-based sauce.",
    ingredients: [
      "1.5 lbs chicken breast, cut into cubes",
      "1 cup plain yogurt",
      "2 tbsp lemon juice",
      "2 tsp garam masala",
      "1 tsp turmeric",
      "1 tsp cumin",
      "1 large onion, diced",
      "3 cloves garlic, minced",
      "1 inch ginger, grated",
      "1 can crushed tomatoes",
      "1 cup heavy cream",
      "2 tbsp butter",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Marinate chicken in yogurt, lemon juice, and spices for 30 minutes",
      "Heat butter in a large pan over medium heat",
      "Cook marinated chicken until golden brown, set aside",
      "In the same pan, sauté onions until soft",
      "Add garlic and ginger, cook for 1 minute",
      "Add crushed tomatoes and simmer for 10 minutes",
      "Return chicken to pan and add cream",
      "Simmer for 15 minutes until chicken is cooked through",
      "Garnish with fresh cilantro and serve with rice"
    ],
    image_url: "https://images.pexels.com/photos/725990/pexels-photo-725990.jpeg",
    prep_time: 45,
    difficulty: "Medium",
    tags: ["Indian", "Curry", "Chicken"]
  },
  {
    title: "Chocolate Chip Cookies",
    description: "Soft and chewy homemade chocolate chip cookies that are perfect for any occasion.",
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups chocolate chips"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C)",
      "Mix flour, baking soda, and salt in a bowl",
      "In another bowl, cream butter and both sugars",
      "Beat in eggs one at a time, then vanilla",
      "Gradually mix in flour mixture",
      "Fold in chocolate chips",
      "Drop rounded tablespoons onto ungreased baking sheets",
      "Bake for 9-11 minutes until golden brown",
      "Cool on baking sheet for 2 minutes before removing"
    ],
    image_url: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg",
    prep_time: 25,
    difficulty: "Easy",
    tags: ["Dessert", "Cookies", "Chocolate"]
  },
  {
    title: "Caesar Salad",
    description: "Classic Caesar salad with crisp romaine lettuce, homemade croutons, and tangy dressing.",
    ingredients: [
      "2 heads romaine lettuce, chopped",
      "1/2 cup parmesan cheese, grated",
      "1/2 cup croutons",
      "2 cloves garlic, minced",
      "2 tbsp lemon juice",
      "1 tsp Dijon mustard",
      "1/2 cup olive oil",
      "2 anchovy fillets (optional)",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Wash and dry romaine lettuce thoroughly",
      "Make dressing by whisking garlic, lemon juice, and mustard",
      "Slowly whisk in olive oil until emulsified",
      "Add anchovies if using and season with salt and pepper",
      "Toss lettuce with dressing in a large bowl",
      "Add croutons and half the parmesan cheese",
      "Toss gently to combine",
      "Serve immediately with remaining parmesan on top"
    ],
    image_url: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg",
    prep_time: 20,
    difficulty: "Easy",
    tags: ["Salad", "Healthy", "Vegetarian"]
  },
  {
    title: "Beef Stir Fry",
    description: "Quick and easy beef stir fry with colorful vegetables in a savory sauce.",
    ingredients: [
      "1 lb beef sirloin, sliced thin",
      "2 bell peppers, sliced",
      "1 onion, sliced",
      "2 cups broccoli florets",
      "3 cloves garlic, minced",
      "1 inch ginger, grated",
      "3 tbsp soy sauce",
      "2 tbsp oyster sauce",
      "1 tbsp cornstarch",
      "2 tbsp vegetable oil",
      "Sesame seeds for garnish"
    ],
    instructions: [
      "Mix soy sauce, oyster sauce, and cornstarch in a bowl",
      "Heat oil in a large wok or pan over high heat",
      "Cook beef until browned, about 2-3 minutes, set aside",
      "Add vegetables to the pan and stir fry for 3-4 minutes",
      "Add garlic and ginger, cook for 30 seconds",
      "Return beef to pan and add sauce mixture",
      "Stir fry for 2 minutes until sauce thickens",
      "Garnish with sesame seeds and serve over rice"
    ],
    image_url: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg",
    prep_time: 25,
    difficulty: "Easy",
    tags: ["Asian", "Beef", "Stir Fry"]
  },
  {
    title: "Pasta Carbonara",
    description: "Creamy Italian pasta dish with eggs, cheese, and crispy pancetta.",
    ingredients: [
      "1 lb spaghetti",
      "6 oz pancetta or bacon, diced",
      "4 large eggs",
      "1 cup parmesan cheese, grated",
      "4 cloves garlic, minced",
      "Black pepper to taste",
      "Salt for pasta water",
      "Fresh parsley for garnish"
    ],
    instructions: [
      "Cook spaghetti according to package directions",
      "Reserve 1 cup pasta water before draining",
      "Cook pancetta in a large pan until crispy",
      "Add garlic and cook for 30 seconds",
      "Whisk eggs and parmesan in a bowl",
      "Add hot pasta to pan with pancetta",
      "Remove from heat and quickly stir in egg mixture",
      "Add pasta water gradually until creamy",
      "Season with black pepper and garnish with parsley"
    ],
    image_url: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg",
    prep_time: 20,
    difficulty: "Medium",
    tags: ["Italian", "Pasta", "Creamy"]
  },
  {
    title: "Grilled Salmon",
    description: "Perfectly grilled salmon with herbs and lemon. Healthy and delicious!",
    ingredients: [
      "4 salmon fillets (6 oz each)",
      "2 tbsp olive oil",
      "2 tbsp lemon juice",
      "2 cloves garlic, minced",
      "1 tsp dried dill",
      "1 tsp dried thyme",
      "Salt and pepper to taste",
      "Lemon wedges for serving"
    ],
    instructions: [
      "Preheat grill to medium-high heat",
      "Mix olive oil, lemon juice, garlic, and herbs",
      "Season salmon with salt and pepper",
      "Brush herb mixture over salmon fillets",
      "Grill salmon for 4-5 minutes per side",
      "Fish should flake easily when done",
      "Serve immediately with lemon wedges",
      "Great with steamed vegetables or rice"
    ],
    image_url: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
    prep_time: 15,
    difficulty: "Easy",
    tags: ["Seafood", "Healthy", "Grilled"]
  },
  {
    title: "Vegetable Soup",
    description: "Hearty and nutritious vegetable soup perfect for any season.",
    ingredients: [
      "2 tbsp olive oil",
      "1 onion, diced",
      "2 carrots, diced",
      "2 celery stalks, diced",
      "3 cloves garlic, minced",
      "1 can diced tomatoes",
      "4 cups vegetable broth",
      "1 cup green beans, cut",
      "1 cup corn kernels",
      "1 tsp dried thyme",
      "Salt and pepper to taste",
      "Fresh herbs for garnish"
    ],
    instructions: [
      "Heat olive oil in a large pot over medium heat",
      "Sauté onion, carrots, and celery for 5 minutes",
      "Add garlic and cook for 1 minute",
      "Add tomatoes, broth, and thyme",
      "Bring to a boil, then reduce heat and simmer",
      "Add green beans and corn",
      "Simmer for 15-20 minutes until vegetables are tender",
      "Season with salt and pepper",
      "Garnish with fresh herbs and serve hot"
    ],
    image_url: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
    prep_time: 30,
    difficulty: "Easy",
    tags: ["Soup", "Vegetarian", "Healthy"]
  }
];

// Function to add predefined recipes to database
export const addPredefinedRecipes = async () => {
  console.log('🍳 Adding predefined recipes to database...');
  
  try {
    // Create a demo user profile first (this will be used for all predefined recipes)
    const demoUserData = {
      email: 'demo@recipo.com',
      password: 'demo123456',
      options: {
        data: {
          full_name: 'Demo Chef'
        }
      }
    };

    // Try to sign up demo user (or sign in if exists)
    let { data: authData, error: authError } = await supabase.auth.signUp(demoUserData);
    
    if (authError && authError.message.includes('already registered')) {
      // User exists, try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoUserData.email,
        password: demoUserData.password
      });
      
      if (signInError) {
        console.error('Failed to sign in demo user:', signInError);
        return { success: false, error: signInError };
      }
      
      authData = signInData;
    }

    if (!authData?.user) {
      console.error('No user data available');
      return { success: false, error: 'No user data' };
    }

    console.log('✅ Demo user authenticated:', authData.user.email);

    // Add each recipe to the database
    const results = [];
    for (const recipe of predefinedRecipes) {
      const { data, error } = await supabase
        .from('recipes')
        .insert([
          {
            ...recipe,
            user_id: authData.user.id
          }
        ])
        .select();

      if (error) {
        console.error(`❌ Failed to add recipe "${recipe.title}":`, error);
        results.push({ recipe: recipe.title, success: false, error });
      } else {
        console.log(`✅ Added recipe: ${recipe.title}`);
        results.push({ recipe: recipe.title, success: true, data });
      }
    }

    // Sign out demo user
    await supabase.auth.signOut();

    const successCount = results.filter(r => r.success).length;
    console.log(`🎉 Successfully added ${successCount}/${predefinedRecipes.length} recipes!`);

    return { 
      success: true, 
      added: successCount, 
      total: predefinedRecipes.length,
      results 
    };

  } catch (error) {
    console.error('❌ Error adding predefined recipes:', error);
    return { success: false, error };
  }
};
