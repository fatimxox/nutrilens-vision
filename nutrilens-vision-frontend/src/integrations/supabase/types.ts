export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blood_sugar_logs: {
        Row: {
          created_at: string
          glucose_level: number
          id: string
          logged_at: string
          measurement_type: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          glucose_level: number
          id?: string
          logged_at?: string
          measurement_type?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          glucose_level?: number
          id?: string
          logged_at?: string
          measurement_type?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meal_logs: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string
          fat: number | null
          fiber: number | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          logged_at: string
          meal_type: string
          name: string | null
          protein: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          fat?: number | null
          fiber?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          logged_at?: string
          meal_type: string
          name?: string | null
          protein?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          fat?: number | null
          fiber?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          logged_at?: string
          meal_type?: string
          name?: string | null
          protein?: number | null
          user_id?: string
        }
        Relationships: []
      }
      medication_reminders: {
        Row: {
          created_at: string
          dosage: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          last_taken_at: string | null
          medication_name: string
          reminder_times: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          last_taken_at?: string | null
          medication_name: string
          reminder_times?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          last_taken_at?: string | null
          medication_name?: string
          reminder_times?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          allergies: string[] | null
          avatar_url: string | null
          created_at: string
          daily_water_goal: number | null
          email: string | null
          first_name: string | null
          gender: string | null
          goals: string[] | null
          height: number | null
          id: string
          last_name: string | null
          medical_conditions: string[] | null
          notifications_enabled: boolean | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          avatar_url?: string | null
          created_at?: string
          daily_water_goal?: number | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          goals?: string[] | null
          height?: number | null
          id?: string
          last_name?: string | null
          medical_conditions?: string[] | null
          notifications_enabled?: boolean | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          avatar_url?: string | null
          created_at?: string
          daily_water_goal?: number | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          goals?: string[] | null
          height?: number | null
          id?: string
          last_name?: string | null
          medical_conditions?: string[] | null
          notifications_enabled?: boolean | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      saved_recipes: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string
          fat: number | null
          fiber: number | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          is_favorite: boolean | null
          name: string
          protein: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          fat?: number | null
          fiber?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_favorite?: boolean | null
          name: string
          protein?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          fat?: number | null
          fiber?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_favorite?: boolean | null
          name?: string
          protein?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          badges: string[] | null
          created_at: string
          current_streak: number | null
          id: string
          last_log_date: string | null
          longest_streak: number | null
          total_logs: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          badges?: string[] | null
          created_at?: string
          current_streak?: number | null
          id?: string
          last_log_date?: string | null
          longest_streak?: number | null
          total_logs?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          badges?: string[] | null
          created_at?: string
          current_streak?: number | null
          id?: string
          last_log_date?: string | null
          longest_streak?: number | null
          total_logs?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      water_logs: {
        Row: {
          amount: number
          created_at: string
          id: string
          logged_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          logged_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          logged_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
