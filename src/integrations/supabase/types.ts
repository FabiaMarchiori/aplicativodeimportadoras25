export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assinaturas: {
        Row: {
          created_at: string | null
          data_expiracao: string | null
          data_inicio: string
          email: string
          id: string
          kiwify_customer_id: string | null
          kiwify_subscription_id: string
          nome_cliente: string | null
          plano: string
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string | null
          user_id: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string | null
          data_expiracao?: string | null
          data_inicio?: string
          email: string
          id?: string
          kiwify_customer_id?: string | null
          kiwify_subscription_id: string
          nome_cliente?: string | null
          plano: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
          user_id?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string | null
          data_expiracao?: string | null
          data_inicio?: string
          email?: string
          id?: string
          kiwify_customer_id?: string | null
          kiwify_subscription_id?: string
          nome_cliente?: string | null
          plano?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
          user_id?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      categorias: {
        Row: {
          categoria: string
          created_at: string | null
          id: number
          imagem_url: string | null
        }
        Insert: {
          categoria: string
          created_at?: string | null
          id?: number
          imagem_url?: string | null
        }
        Update: {
          categoria?: string
          created_at?: string | null
          id?: number
          imagem_url?: string | null
        }
        Relationships: []
      }
      favoritos: {
        Row: {
          created_at: string
          fornecedor_id: number
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fornecedor_id: number
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fornecedor_id?: number
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          categoria: string | null
          created_at: string
          Endereco: string | null
          id: number
          Instagram_url: string | null
          logo_url: string | null
          mockup_url: string | null
          nome_loja: string | null
          Whatsapp: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          Endereco?: string | null
          id?: number
          Instagram_url?: string | null
          logo_url?: string | null
          mockup_url?: string | null
          nome_loja?: string | null
          Whatsapp?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string
          Endereco?: string | null
          id?: number
          Instagram_url?: string | null
          logo_url?: string | null
          mockup_url?: string | null
          nome_loja?: string | null
          Whatsapp?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          is_admin: boolean | null
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          is_admin?: boolean | null
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          evento: string
          id: string
          payload: Json
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          evento: string
          id?: string
          payload: Json
          status: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          evento?: string
          id?: string
          payload?: Json
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_distinct_fornecedores: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          nome_loja: string
          categoria: string
          Whatsapp: string
          Instagram_url: string
          Endereco: string
          logo_url: string
          mockup_url: string
          created_at: string
        }[]
      }
      get_or_create_user_by_email: {
        Args: { email_param: string }
        Returns: string
      }
      has_active_subscription: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      has_role: {
        Args: { requested_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      subscription_status:
        | "ativa"
        | "inativa"
        | "cancelada"
        | "expirada"
        | "reembolsada"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      subscription_status: [
        "ativa",
        "inativa",
        "cancelada",
        "expirada",
        "reembolsada",
      ],
      user_role: ["admin", "user"],
    },
  },
} as const
