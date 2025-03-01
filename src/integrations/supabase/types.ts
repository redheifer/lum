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
      calls: {
        Row: {
          calldate: string
          callerid: string
          campaignid: string | null
          campaignname: string | null
          createdat: string | null
          description: string | null
          disposition: string | null
          duration: string
          endcallsource: string
          id: string
          inboundcallid: string
          payout: number
          platform: string
          publisher: string
          rating: number | null
          recording: string | null
          revenue: number
          target: string
          transcript: string | null
        }
        Insert: {
          calldate: string
          callerid: string
          campaignid?: string | null
          campaignname?: string | null
          createdat?: string | null
          description?: string | null
          disposition?: string | null
          duration: string
          endcallsource: string
          id?: string
          inboundcallid: string
          payout?: number
          platform: string
          publisher: string
          rating?: number | null
          recording?: string | null
          revenue?: number
          target: string
          transcript?: string | null
        }
        Update: {
          calldate?: string
          callerid?: string
          campaignid?: string | null
          campaignname?: string | null
          createdat?: string | null
          description?: string | null
          disposition?: string | null
          duration?: string
          endcallsource?: string
          id?: string
          inboundcallid?: string
          payout?: number
          platform?: string
          publisher?: string
          rating?: number | null
          recording?: string | null
          revenue?: number
          target?: string
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_campaignid_fkey"
            columns: ["campaignid"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          createdat: string | null
          id: string
          name: string
          platform: string
          publisher: string
          status: string
          target: string
        }
        Insert: {
          createdat?: string | null
          id?: string
          name: string
          platform: string
          publisher: string
          status: string
          target: string
        }
        Update: {
          createdat?: string | null
          id?: string
          name?: string
          platform?: string
          publisher?: string
          status?: string
          target?: string
        }
        Relationships: []
      }
      onboarding: {
        Row: {
          businessdata: Json | null
          currentstep: number
          id: string
          iscomplete: boolean
        }
        Insert: {
          businessdata?: Json | null
          currentstep?: number
          id?: string
          iscomplete?: boolean
        }
        Update: {
          businessdata?: Json | null
          currentstep?: number
          id?: string
          iscomplete?: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
