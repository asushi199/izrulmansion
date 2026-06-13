export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          room: "bilik_mesyuarat" | "studio";
          date: string;
          slot: "am" | "pm" | "full_day";
          name: string;
          school_or_unit: string;
          purpose: string;
          contact: string;
          contact_normalized: string;
          created_at: string;
          status: "pending" | "approved" | "rejected" | "cancelled";
          approval_token_hash: string | null;
          approved_at: string | null;
          rejected_at: string | null;
          notified_at: string | null;
          notification_error: string | null;
          cancelled_at: string | null;
        };
        Insert: {
          id?: string;
          room: "bilik_mesyuarat" | "studio";
          date: string;
          slot: "am" | "pm" | "full_day";
          name: string;
          school_or_unit: string;
          purpose: string;
          contact: string;
          contact_normalized?: string;
          created_at?: string;
          status?: "pending" | "approved" | "rejected" | "cancelled";
          approval_token_hash?: string | null;
          approved_at?: string | null;
          rejected_at?: string | null;
          notified_at?: string | null;
          notification_error?: string | null;
          cancelled_at?: string | null;
        };
        Update: {
          room?: "bilik_mesyuarat" | "studio";
          date?: string;
          slot?: "am" | "pm" | "full_day";
          name?: string;
          school_or_unit?: string;
          purpose?: string;
          contact?: string;
          contact_normalized?: string;
          status?: "pending" | "approved" | "rejected" | "cancelled";
          approval_token_hash?: string | null;
          approved_at?: string | null;
          rejected_at?: string | null;
          notified_at?: string | null;
          notification_error?: string | null;
          cancelled_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
