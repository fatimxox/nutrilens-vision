import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import type { NutritionItem } from '@/contexts/UserContext';

interface MedicalAlertProps {
  detectedItems: NutritionItem[];
  onDismiss: () => void;
  onRemoveItem: (itemName: string) => void;
}

function MedicalAlertContent({ detectedItems, onDismiss, onRemoveItem }: MedicalAlertProps) {
  const allergenItems = detectedItems.filter(item => item.allergenFlags.length > 0);
  
  if (allergenItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-destructive/20">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">Allergen Detected!</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            This meal may contain allergens from your profile:
          </p>
          <ul className="mt-2 space-y-1">
            {allergenItems.map((item) => (
              <li key={item.name} className="text-sm">
                <span className="font-medium text-foreground">{item.name}</span>
                <span className="text-muted-foreground"> contains </span>
                <span className="font-medium text-destructive">
                  {item.allergenFlags.join(', ')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => {
            allergenItems.forEach(item => onRemoveItem(item.name));
            onDismiss();
          }}
          className="flex-1 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
        >
          Remove Items
        </button>
        <button
          onClick={onDismiss}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export function showMedicalAlert(
  detectedItems: NutritionItem[],
  userAllergies: string[],
  onRemoveItem: (itemName: string) => void
) {
  // Check if any detected items contain user's allergens
  const itemsWithAllergens = detectedItems.filter(item =>
    item.allergenFlags.some(flag => 
      userAllergies.some(allergy => 
        flag.toLowerCase().includes(allergy.toLowerCase()) ||
        allergy.toLowerCase().includes(flag.toLowerCase())
      )
    )
  );

  if (itemsWithAllergens.length === 0) return;

  // Trigger vibration on mobile if supported
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]);
  }

  toast.custom(
    (t) => (
      <div className="w-full max-w-md rounded-xl border border-destructive/30 bg-card p-4 shadow-xl">
        <MedicalAlertContent
          detectedItems={itemsWithAllergens}
          onDismiss={() => toast.dismiss(t)}
          onRemoveItem={onRemoveItem}
        />
      </div>
    ),
    {
      duration: Infinity, // Persists until user action
      position: 'top-center',
    }
  );
}

// Hook to use medical alerts in components
export function useMedicalAlerts() {
  const { profile } = useUser();
  
  const checkForAllergens = (items: NutritionItem[], onRemoveItem: (itemName: string) => void) => {
    if (profile.allergies.length === 0) return;
    showMedicalAlert(items, profile.allergies, onRemoveItem);
  };

  return { checkForAllergens };
}