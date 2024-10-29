export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      blog_posts: {
        Row: {
          content: string | null;
          id: string;
          image_url: string | null;
          published_at: string | null;
          title: string;
          user_id: string | null;
        };
        Insert: {
          content?: string | null;
          id?: string;
          image_url?: string | null;
          published_at?: string | null;
          title: string;
          user_id?: string | null;
        };
        Update: {
          content?: string | null;
          id?: string;
          image_url?: string | null;
          published_at?: string | null;
          title?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_posts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      feeding_records: {
        Row: {
          amount: number | null;
          date: string | null;
          fish_id: string | null;
          food_type: string | null;
          id: string;
          notes: string | null;
        };
        Insert: {
          amount?: number | null;
          date?: string | null;
          fish_id?: string | null;
          food_type?: string | null;
          id?: string;
          notes?: string | null;
        };
        Update: {
          amount?: number | null;
          date?: string | null;
          fish_id?: string | null;
          food_type?: string | null;
          id?: string;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'feeding_records_fish_id_fkey';
            columns: ['fish_id'];
            isOneToOne: false;
            referencedRelation: 'koi_fish';
            referencedColumns: ['id'];
          },
        ];
      };
      growth_records: {
        Row: {
          date: string | null;
          fish_id: string | null;
          id: string;
          image_url: string | null;
          notes: string | null;
          size: number | null;
          weight: number | null;
        };
        Insert: {
          date?: string | null;
          fish_id?: string | null;
          id?: string;
          image_url?: string | null;
          notes?: string | null;
          size?: number | null;
          weight?: number | null;
        };
        Update: {
          date?: string | null;
          fish_id?: string | null;
          id?: string;
          image_url?: string | null;
          notes?: string | null;
          size?: number | null;
          weight?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'growth_records_fish_id_fkey';
            columns: ['fish_id'];
            isOneToOne: false;
            referencedRelation: 'koi_fish';
            referencedColumns: ['id'];
          },
        ];
      };
      koi_fish: {
        Row: {
          age: number | null;
          breeder: string | null;
          created_at: string | null;
          id: string;
          image_url: string | null;
          inpond_since: string | null;
          name: string;
          notes: string | null;
          origin: string | null;
          physique: string | null;
          pond_id: string | null;
          purchase_date: string | null;
          purchase_price: number | null;
          sex: string | null;
          size: number | null;
          status: string | null;
          updated_at: string | null;
          user_id: string | null;
          variety: string | null;
          weight: number | null;
        };
        Insert: {
          age?: number | null;
          breeder?: string | null;
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          inpond_since?: string | null;
          name: string;
          notes?: string | null;
          origin?: string | null;
          physique?: string | null;
          pond_id?: string | null;
          purchase_date?: string | null;
          purchase_price?: number | null;
          sex?: string | null;
          size?: number | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          variety?: string | null;
          weight?: number | null;
        };
        Update: {
          age?: number | null;
          breeder?: string | null;
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          inpond_since?: string | null;
          name?: string;
          notes?: string | null;
          origin?: string | null;
          physique?: string | null;
          pond_id?: string | null;
          purchase_date?: string | null;
          purchase_price?: number | null;
          sex?: string | null;
          size?: number | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          variety?: string | null;
          weight?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'koi_fish_pond_id_fkey';
            columns: ['pond_id'];
            isOneToOne: false;
            referencedRelation: 'ponds';
            referencedColumns: ['id'];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string | null;
          price: number | null;
          product_id: string | null;
          quantity: number | null;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          price?: number | null;
          product_id?: string | null;
          quantity?: number | null;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          price?: number | null;
          product_id?: string | null;
          quantity?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          order_date: string | null;
          status: string | null;
          total_amount: number | null;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          order_date?: string | null;
          status?: string | null;
          total_amount?: number | null;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          order_date?: string | null;
          status?: string | null;
          total_amount?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      ponds: {
        Row: {
          created_at: string | null;
          depth: number | null;
          drain_count: number | null;
          fish_count: number | null;
          id: string;
          image_url: string | null;
          name: string;
          pump_capacity: number | null;
          size: number | null;
          user_id: string | null;
          volume: number | null;
        };
        Insert: {
          created_at?: string | null;
          depth?: number | null;
          drain_count?: number | null;
          fish_count?: number | null;
          id?: string;
          image_url?: string | null;
          name: string;
          pump_capacity?: number | null;
          size?: number | null;
          user_id?: string | null;
          volume?: number | null;
        };
        Update: {
          created_at?: string | null;
          depth?: number | null;
          drain_count?: number | null;
          fish_count?: number | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          pump_capacity?: number | null;
          size?: number | null;
          user_id?: string | null;
          volume?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'ponds_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          category: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          image_url: string | null;
          marketplace_name: string | null;
          marketplace_url: string | null;
          name: string;
          price: number | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          marketplace_name?: string | null;
          marketplace_url?: string | null;
          name: string;
          price?: number | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          marketplace_name?: string | null;
          marketplace_url?: string | null;
          name?: string;
          price?: number | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      water_parameters: {
        Row: {
          ammonium_nh4: number | null;
          amount_fed: number | null;
          co2: number | null;
          date_time: string | null;
          hardness: number | null;
          id: string;
          kh: number | null;
          nitrate_no3: number | null;
          nitrite_no2: number | null;
          note: string | null;
          outdoor_temp: number | null;
          oxygen_o2: number | null;
          ph_value: number | null;
          phosphate_po4: number | null;
          pond_id: string | null;
          salt: number | null;
          temperature: number | null;
          total_chlorines: number | null;
        };
        Insert: {
          ammonium_nh4?: number | null;
          amount_fed?: number | null;
          co2?: number | null;
          date_time?: string | null;
          hardness?: number | null;
          id?: string;
          kh?: number | null;
          nitrate_no3?: number | null;
          nitrite_no2?: number | null;
          note?: string | null;
          outdoor_temp?: number | null;
          oxygen_o2?: number | null;
          ph_value?: number | null;
          phosphate_po4?: number | null;
          pond_id?: string | null;
          salt?: number | null;
          temperature?: number | null;
          total_chlorines?: number | null;
        };
        Update: {
          ammonium_nh4?: number | null;
          amount_fed?: number | null;
          co2?: number | null;
          date_time?: string | null;
          hardness?: number | null;
          id?: string;
          kh?: number | null;
          nitrate_no3?: number | null;
          nitrite_no2?: number | null;
          note?: string | null;
          outdoor_temp?: number | null;
          oxygen_o2?: number | null;
          ph_value?: number | null;
          phosphate_po4?: number | null;
          pond_id?: string | null;
          salt?: number | null;
          temperature?: number | null;
          total_chlorines?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'water_parameters_pond_id_fkey';
            columns: ['pond_id'];
            isOneToOne: false;
            referencedRelation: 'ponds';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
