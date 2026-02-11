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
      bed_plantings: {
        Row: {
          bed_id: string
          created_at: string
          crop_id: string
          guild_role: string
          id: string
          plant_count: number
          planted_at: string | null
        }
        Insert: {
          bed_id: string
          created_at?: string
          crop_id: string
          guild_role: string
          id?: string
          plant_count?: number
          planted_at?: string | null
        }
        Update: {
          bed_id?: string
          created_at?: string
          crop_id?: string
          guild_role?: string
          id?: string
          plant_count?: number
          planted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bed_plantings_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "garden_beds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bed_plantings_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "master_crops"
            referencedColumns: ["id"]
          },
        ]
      }
      field_journal: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          lesson_id: string
          reviewed_at: string | null
          status: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          lesson_id: string
          reviewed_at?: string | null
          status?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          lesson_id?: string
          reviewed_at?: string | null
          status?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_journal_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      garden_beds: {
        Row: {
          aerial_crop_id: string | null
          bed_length_ft: number
          bed_number: number
          bed_width_ft: number
          created_at: string
          frequency_hz: number
          id: string
          inoculant_type: string | null
          internal_brix: number | null
          notes: string | null
          updated_at: string
          vitality_status: string | null
          zone_color: string
          zone_name: string
        }
        Insert: {
          aerial_crop_id?: string | null
          bed_length_ft?: number
          bed_number: number
          bed_width_ft?: number
          created_at?: string
          frequency_hz: number
          id?: string
          inoculant_type?: string | null
          internal_brix?: number | null
          notes?: string | null
          updated_at?: string
          vitality_status?: string | null
          zone_color: string
          zone_name: string
        }
        Update: {
          aerial_crop_id?: string | null
          bed_length_ft?: number
          bed_number?: number
          bed_width_ft?: number
          created_at?: string
          frequency_hz?: number
          id?: string
          inoculant_type?: string | null
          internal_brix?: number | null
          notes?: string | null
          updated_at?: string
          vitality_status?: string | null
          zone_color?: string
          zone_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "garden_beds_aerial_crop_id_fkey"
            columns: ["aerial_crop_id"]
            isOneToOne: false
            referencedRelation: "master_crops"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          module_id: string
          name: string
          order_index: number
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          module_id: string
          name: string
          order_index: number
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          module_id?: string
          name?: string
          order_index?: number
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      master_crops: {
        Row: {
          brix_target_max: number | null
          brix_target_min: number | null
          category: string
          chord_interval: string | null
          common_name: string | null
          companion_crops: string[] | null
          created_at: string
          crop_guild: string[] | null
          cultural_role: string | null
          description: string | null
          dominant_mineral: string | null
          element: string
          focus_tag: string | null
          frequency_hz: number
          growth_habit: string | null
          guild_role: string | null
          hardiness_zone_max: number | null
          hardiness_zone_min: number | null
          harvest_days: number | null
          id: string
          instrument_type: string | null
          library_note: string | null
          min_container_gal: number | null
          name: string
          planting_season: string[] | null
          root_depth_inches: number | null
          soil_protocol_focus: string | null
          spacing_inches: string | null
          updated_at: string
          zone_color: string
          zone_name: string
        }
        Insert: {
          brix_target_max?: number | null
          brix_target_min?: number | null
          category?: string
          chord_interval?: string | null
          common_name?: string | null
          companion_crops?: string[] | null
          created_at?: string
          crop_guild?: string[] | null
          cultural_role?: string | null
          description?: string | null
          dominant_mineral?: string | null
          element: string
          focus_tag?: string | null
          frequency_hz: number
          growth_habit?: string | null
          guild_role?: string | null
          hardiness_zone_max?: number | null
          hardiness_zone_min?: number | null
          harvest_days?: number | null
          id?: string
          instrument_type?: string | null
          library_note?: string | null
          min_container_gal?: number | null
          name: string
          planting_season?: string[] | null
          root_depth_inches?: number | null
          soil_protocol_focus?: string | null
          spacing_inches?: string | null
          updated_at?: string
          zone_color: string
          zone_name: string
        }
        Update: {
          brix_target_max?: number | null
          brix_target_min?: number | null
          category?: string
          chord_interval?: string | null
          common_name?: string | null
          companion_crops?: string[] | null
          created_at?: string
          crop_guild?: string[] | null
          cultural_role?: string | null
          description?: string | null
          dominant_mineral?: string | null
          element?: string
          focus_tag?: string | null
          frequency_hz?: number
          growth_habit?: string | null
          guild_role?: string | null
          hardiness_zone_max?: number | null
          hardiness_zone_min?: number | null
          harvest_days?: number | null
          id?: string
          instrument_type?: string | null
          library_note?: string | null
          min_container_gal?: number | null
          name?: string
          planting_season?: string[] | null
          root_depth_inches?: number | null
          soil_protocol_focus?: string | null
          spacing_inches?: string | null
          updated_at?: string
          zone_color?: string
          zone_name?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          chakra_color: string
          created_at: string
          description: string | null
          display_name: string
          icon_name: string | null
          id: string
          lineage: string
          name: string
          order_index: number
        }
        Insert: {
          chakra_color: string
          created_at?: string
          description?: string | null
          display_name: string
          icon_name?: string | null
          id?: string
          lineage: string
          name: string
          order_index: number
        }
        Update: {
          chakra_color?: string
          created_at?: string
          description?: string | null
          display_name?: string
          icon_name?: string | null
          id?: string
          lineage?: string
          name?: string
          order_index?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      readiness_checklist: {
        Row: {
          checked_items: string[]
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          checked_items?: string[]
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          checked_items?: string[]
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_recipes: {
        Row: {
          chord_data: Json
          created_at: string
          environment: string
          id: string
          name: string | null
          user_id: string
          zone_hz: number
          zone_name: string
          zone_vibe: string
        }
        Insert: {
          chord_data: Json
          created_at?: string
          environment: string
          id?: string
          name?: string | null
          user_id: string
          zone_hz: number
          zone_name: string
          zone_vibe: string
        }
        Update: {
          chord_data?: Json
          created_at?: string
          environment?: string
          id?: string
          name?: string | null
          user_id?: string
          zone_hz?: number
          zone_name?: string
          zone_vibe?: string
        }
        Relationships: []
      }
      saved_soil_configs: {
        Row: {
          bed_length: number | null
          bed_width: number | null
          container_size: string | null
          created_at: string
          custom_gallons: number | null
          environment: string
          frequency_hz: number | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          bed_length?: number | null
          bed_width?: number | null
          container_size?: string | null
          created_at?: string
          custom_gallons?: number | null
          environment: string
          frequency_hz?: number | null
          id?: string
          name?: string
          user_id: string
        }
        Update: {
          bed_length?: number | null
          bed_width?: number | null
          container_size?: string | null
          created_at?: string
          custom_gallons?: number | null
          environment?: string
          frequency_hz?: number | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      seven_pillars_status: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_updated: string
          pillar_name: string
          pillar_number: number
          resonant_function: string
          site_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_updated?: string
          pillar_name: string
          pillar_number: number
          resonant_function: string
          site_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_updated?: string
          pillar_name?: string
          pillar_number?: number
          resonant_function?: string
          site_name?: string
        }
        Relationships: []
      }
      soil_amendments: {
        Row: {
          category: string
          created_at: string
          description: string | null
          frequency_affinity: number[] | null
          id: string
          name: string
          nutrient_contribution: string | null
          quantity_per_60ft: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          frequency_affinity?: number[] | null
          id?: string
          name: string
          nutrient_contribution?: string | null
          quantity_per_60ft: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          frequency_affinity?: number[] | null
          id?: string
          name?: string
          nutrient_contribution?: string | null
          quantity_per_60ft?: string
        }
        Relationships: []
      }
      user_lesson_progress: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          lesson_id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          lesson_id: string
          notes?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          lesson_id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_module_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          module_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
