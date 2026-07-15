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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string | null
          date: string | null
          description: string | null
          icon: string | null
          id: string
          title: string
        }
        Insert: {
          category?: string | null
          date?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          title: string
        }
        Update: {
          category?: string | null
          date?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          message_type: string | null
          name: string
          subject: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          message_type?: string | null
          name: string
          subject?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string | null
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          company: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          location: string | null
          logo_url: string | null
          order_index: number | null
          responsibilities: string[] | null
          role: string
          start_date: string | null
          tech_used: string[] | null
          type: string | null
        }
        Insert: {
          company: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          logo_url?: string | null
          order_index?: number | null
          responsibilities?: string[] | null
          role: string
          start_date?: string | null
          tech_used?: string[] | null
          type?: string | null
        }
        Update: {
          company?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          logo_url?: string | null
          order_index?: number | null
          responsibilities?: string[] | null
          role?: string
          start_date?: string | null
          tech_used?: string[] | null
          type?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          order_index: number | null
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          order_index?: number | null
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          order_index?: number | null
          title?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          availability_status: string | null
          coffees_count: number | null
          current_company: string | null
          current_position: string | null
          email: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          name: string
          phone: string | null
          profile_photo_url: string | null
          projects_count: number | null
          resume_url: string | null
          summary: string
          taglines: string[]
          title: string
          updated_at: string | null
          years_experience: number | null
        }
        Insert: {
          availability_status?: string | null
          coffees_count?: number | null
          current_company?: string | null
          current_position?: string | null
          email?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          profile_photo_url?: string | null
          projects_count?: number | null
          resume_url?: string | null
          summary?: string
          taglines?: string[]
          title?: string
          updated_at?: string | null
          years_experience?: number | null
        }
        Update: {
          availability_status?: string | null
          coffees_count?: number | null
          current_company?: string | null
          current_position?: string | null
          email?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          profile_photo_url?: string | null
          projects_count?: number | null
          resume_url?: string | null
          summary?: string
          taglines?: string[]
          title?: string
          updated_at?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          architecture_highlights: string[] | null
          category: string
          created_at: string | null
          description: string | null
          github_url: string | null
          id: string
          is_featured: boolean | null
          is_flagship: boolean | null
          live_url: string | null
          long_description: string | null
          order_index: number | null
          screenshots: string[] | null
          status: string | null
          tech_stack: string[] | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          architecture_highlights?: string[] | null
          category: string
          created_at?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_flagship?: boolean | null
          live_url?: string | null
          long_description?: string | null
          order_index?: number | null
          screenshots?: string[] | null
          status?: string | null
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          architecture_highlights?: string[] | null
          category?: string
          created_at?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_flagship?: boolean | null
          live_url?: string | null
          long_description?: string | null
          order_index?: number | null
          screenshots?: string[] | null
          status?: string | null
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          color: string | null
          icon_name: string | null
          id: string
          name: string
          order_index: number | null
          proficiency: number | null
          tier: string
        }
        Insert: {
          category: string
          color?: string | null
          icon_name?: string | null
          id?: string
          name: string
          order_index?: number | null
          proficiency?: number | null
          tier?: string
        }
        Update: {
          category?: string
          color?: string | null
          icon_name?: string | null
          id?: string
          name?: string
          order_index?: number | null
          proficiency?: number | null
          tier?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
