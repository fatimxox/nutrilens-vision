import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, AlertTriangle, Search } from 'lucide-react';

interface AllergySetupProps {
  allergies: string[];
  onAllergiesChange: (allergies: string[]) => void;
}

const commonAllergens = [
  'Peanuts',
  'Tree Nuts',
  'Dairy',
  'Eggs',
  'Shellfish',
  'Soy',
  'Wheat',
  'Fish',
  'Sesame',
  'Gluten',
];

export function AllergySetup({ allergies, onAllergiesChange }: AllergySetupProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = commonAllergens.filter(
    (allergen) =>
      allergen.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !allergies.includes(allergen)
  );

  const addAllergen = (allergen: string) => {
    if (!allergies.includes(allergen)) {
      onAllergiesChange([...allergies, allergen]);
    }
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const removeAllergen = (allergen: string) => {
    onAllergiesChange(allergies.filter((a) => a !== allergen));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      addAllergen(searchQuery.trim());
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          Food Allergies
        </h2>
        <p className="text-muted-foreground">
          We'll alert you when detected foods contain these allergens
        </p>
      </div>

      {/* Search input */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search or add custom allergen..."
            className="w-full rounded-xl border-2 border-border bg-card py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && (searchQuery || filteredSuggestions.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-full z-10 mt-2 max-h-48 overflow-auto rounded-xl border border-border bg-card shadow-lg"
            >
              {filteredSuggestions.map((allergen) => (
                <button
                  key={allergen}
                  onClick={() => addAllergen(allergen)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-foreground hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4 text-primary" />
                  {allergen}
                </button>
              ))}
              {searchQuery && !commonAllergens.includes(searchQuery) && (
                <button
                  onClick={() => addAllergen(searchQuery)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-foreground hover:bg-muted transition-colors border-t border-border"
                >
                  <Plus className="h-4 w-4 text-primary" />
                  Add "{searchQuery}"
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick add buttons */}
      <div className="mb-6">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Common allergens:</p>
        <div className="flex flex-wrap gap-2">
          {commonAllergens
            .filter((a) => !allergies.includes(a))
            .slice(0, 5)
            .map((allergen) => (
              <button
                key={allergen}
                onClick={() => addAllergen(allergen)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-3 w-3" />
                {allergen}
              </button>
            ))}
        </div>
      </div>

      {/* Selected allergies */}
      <div className="min-h-[120px] rounded-xl border-2 border-dashed border-border bg-surface p-4">
        {allergies.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {allergies.map((allergen) => (
                <motion.div
                  key={allergen}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive"
                >
                  <AlertTriangle className="h-4 w-4" />
                  {allergen}
                  <button
                    onClick={() => removeAllergen(allergen)}
                    className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-muted-foreground">
              No allergies added yet. Add any foods you're allergic to above.
            </p>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center text-sm text-muted-foreground"
      >
        {allergies.length > 0 ? (
          <span className="text-primary">
            We'll warn you if any meal contains these {allergies.length} allergen
            {allergies.length > 1 ? 's' : ''}.
          </span>
        ) : (
          "You can skip this step if you don't have any food allergies."
        )}
      </motion.div>
    </div>
  );
}
