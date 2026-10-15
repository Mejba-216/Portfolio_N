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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_date: string | null
          category: string
          certificate_type: string
          certificate_url: string | null
          created_at: string
          credential_id: string
          credential_url: string
          description: string
          featured: boolean
          id: string
          organization: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          achievement_date?: string | null
          category?: string
          certificate_type?: string
          certificate_url?: string | null
          created_at?: string
          credential_id?: string
          credential_url?: string
          description?: string
          featured?: boolean
          id?: string
          organization?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          achievement_date?: string | null
          category?: string
          certificate_type?: string
          certificate_url?: string | null
          created_at?: string
          credential_id?: string
          credential_url?: string
          description?: string
          featured?: boolean
          id?: string
          organization?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      awards: {
        Row: {
          award_date: string | null
          created_at: string
          description: string
          id: string
          organization: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          award_date?: string | null
          created_at?: string
          description?: string
          id?: string
          organization?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          award_date?: string | null
          created_at?: string
          description?: string
          id?: string
          organization?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          credential_id: string
          credential_url: string
          id: string
          issue_date: string | null
          name: string
          organization: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_id?: string
          credential_url?: string
          id?: string
          issue_date?: string | null
          name: string
          organization?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_id?: string
          credential_url?: string
          id?: string
          issue_date?: string | null
          name?: string
          organization?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          description: string
          end_date: string | null
          id: string
          institution: string
          location: string
          sort_order: number
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string
          end_date?: string | null
          id?: string
          institution: string
          location?: string
          sort_order?: number
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string
          end_date?: string | null
          id?: string
          institution?: string
          location?: string
          sort_order?: number
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      experience: {
        Row: {
          company: string
          created_at: string
          description: string
          end_date: string | null
          id: string
          location: string
          position: string
          sort_order: number
          start_date: string | null
          technologies: string[]
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          location?: string
          position: string
          sort_order?: number
          start_date?: string | null
          technologies?: string[]
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          location?: string
          position?: string
          sort_order?: number
          start_date?: string | null
          technologies?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          created_at: string
          id: string
          language: string
          level: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          language: string
          level?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          level?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          subject?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          bio: string
          created_at: string
          email: string
          full_name: string
          id: string
          location: string
          phone: string
          photo_url: string | null
          resume_url: string | null
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          bio?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          location?: string
          phone?: string
          photo_url?: string | null
          resume_url?: string | null
          summary?: string
          title?: string
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          location?: string
          phone?: string
          photo_url?: string | null
          resume_url?: string | null
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          alt: string
          created_at: string
          id: string
          image_url: string
          project_id: string
          sort_order: number
        }
        Insert: {
          alt?: string
          created_at?: string
          id?: string
          image_url: string
          project_id: string
          sort_order?: number
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          image_url?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string
          featured: boolean
          features: string[]
          github_url: string
          id: string
          live_url: string
          published: boolean
          short_description: string
          slug: string
          sort_order: number
          technologies: string[]
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string
          featured?: boolean
          features?: string[]
          github_url?: string
          id?: string
          live_url?: string
          published?: boolean
          short_description?: string
          slug: string
          sort_order?: number
          technologies?: string[]
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string
          featured?: boolean
          features?: string[]
          github_url?: string
          id?: string
          live_url?: string
          published?: boolean
          short_description?: string
          slug?: string
          sort_order?: number
          technologies?: string[]
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          footer_text: string
          id: string
          site_name: string
          tagline: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          footer_text?: string
          id?: string
          site_name?: string
          tagline?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          footer_text?: string
          id?: string
          site_name?: string
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          id: string
          level: number
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          level?: number
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          level?: number
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          id: string
          platform: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          sort_order?: number
          updated_at?: string
          url?: string
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
