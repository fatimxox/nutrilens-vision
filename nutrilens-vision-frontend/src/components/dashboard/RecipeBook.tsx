import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Heart, 
  Plus, 
  Trash2, 
  Utensils, 
  Flame, 
  Search,
  X,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface Recipe {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: string[];
  image_url: string | null;
  is_favorite: boolean;
}

export function RecipeBook() {
  const { toast } = useToast();
  const { addMeal } = useUser();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error: any) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (recipe: Recipe) => {
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .update({ is_favorite: !recipe.is_favorite })
        .eq('id', recipe.id);

      if (error) throw error;

      setRecipes(prev => 
        prev.map(r => r.id === recipe.id ? { ...r, is_favorite: !r.is_favorite } : r)
      );
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not update favorite status',
        variant: 'destructive',
      });
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      setRecipes(prev => prev.filter(r => r.id !== recipeId));
      toast({
        title: 'Recipe deleted',
        description: 'The recipe has been removed from your book',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not delete recipe',
        variant: 'destructive',
      });
    }
  };

  const logRecipeAsMeal = async (recipe: Recipe) => {
    const meal = {
      id: `meal_${Date.now()}`,
      timestamp: new Date(),
      imageUrl: recipe.image_url || '',
      items: recipe.ingredients.map(ing => ({
        name: ing,
        confidence: 1,
        nutrition: {
          calories: Math.round(recipe.calories / Math.max(recipe.ingredients.length, 1)),
          protein: Math.round(recipe.protein / Math.max(recipe.ingredients.length, 1)),
          carbs: Math.round(recipe.carbs / Math.max(recipe.ingredients.length, 1)),
          fats: Math.round(recipe.fat / Math.max(recipe.ingredients.length, 1)),
          glycemicIndex: 50,
        },
        allergenFlags: [],
      })),
      totalCalories: recipe.calories,
      totalProtein: recipe.protein,
      totalCarbs: recipe.carbs,
      totalFats: recipe.fat,
    };
    
    addMeal(meal);

    toast({
      title: 'Meal logged!',
      description: `${recipe.name} has been added to your daily log`,
    });
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = !showFavoritesOnly || recipe.is_favorite;
    return matchesSearch && matchesFavorite;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recipe Book</h1>
          <p className="text-muted-foreground">Your saved meals for quick re-logging</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              showFavoritesOnly 
                ? 'bg-warning/20 text-warning' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-warning' : ''}`} />
            Favorites
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center"
        >
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            {searchQuery ? 'No recipes found' : 'No saved recipes yet'}
          </h3>
          <p className="mt-2 text-muted-foreground">
            {searchQuery 
              ? 'Try a different search term'
              : 'When you log a meal, click "Save as Recipe" to add it here'
            }
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredRecipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-border bg-card p-5 shadow-lg transition-shadow hover:shadow-xl"
              >
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(recipe)}
                  className="absolute right-3 top-3 rounded-full p-1.5 transition-colors hover:bg-muted"
                >
                  <Heart className={`h-5 w-5 ${
                    recipe.is_favorite ? 'fill-warning text-warning' : 'text-muted-foreground'
                  }`} />
                </button>

                {/* Recipe Image or Icon */}
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  {recipe.image_url ? (
                    <img 
                      src={recipe.image_url} 
                      alt={recipe.name}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <Utensils className="h-8 w-8 text-primary" />
                  )}
                </div>

                {/* Recipe Info */}
                <h3 className="font-semibold text-foreground line-clamp-1">{recipe.name}</h3>
                
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Flame className="h-4 w-4 text-destructive" />
                  <span>{recipe.calories} kcal</span>
                </div>

                {/* Macros */}
                <div className="mt-3 flex gap-2 text-xs">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                    P: {recipe.protein}g
                  </span>
                  <span className="rounded-full bg-warning/10 px-2 py-1 text-warning">
                    C: {recipe.carbs}g
                  </span>
                  <span className="rounded-full bg-info/10 px-2 py-1 text-info">
                    F: {recipe.fat}g
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => logRecipeAsMeal(recipe)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Log Meal
                  </button>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    className="flex items-center justify-center rounded-xl bg-destructive/10 px-3 py-2 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
